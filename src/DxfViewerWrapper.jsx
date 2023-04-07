import React, {useEffect, useRef} from 'react'
import * as three from "three"
import { DxfViewer } from 'dxf-viewer'

const DEFAULT_DXF_VIEWER_OPTIONS = {
  clearColor: new three.Color("#fff"),
  autoResize: true,
  colorCorrection: true
}

const DXF_EVENT_NAMES =  ["loaded", "cleared", "destroyed", "resized", "pointerdown",
"pointerup", "viewChanged", "message"]

const DxfViewerWrapper = ({fileUrl, onProgress, onEvent, options}) => {

  if (!fileUrl) return "No DXF File Selected"

  const viewerCanvasRef = useRef(null)
  const dxfViewerRef = useRef(null)

  const subscribe = (eventName) => {
    dxfViewerRef.current.Subscribe(eventName, e => {if (onEvent) ("dxf-" + eventName, e)})
    // if (eventName == "loaded") {
    //   dxfViewerRef.current.Subscribe(eventName, () => _onProgress("finished"))
    // }
  }
  
  useEffect(()=> {
    if (viewerCanvasRef.current) {
      dxfViewerRef.current = new DxfViewer(viewerCanvasRef.current, { ...DEFAULT_DXF_VIEWER_OPTIONS, ...(options||{})} )
      for (const eventName of DXF_EVENT_NAMES) {
        subscribe(eventName)
      }
    }
  }, [viewerCanvasRef.current])

  const _onProgress = (phase, size, total) => {
    if (onProgress) {
      let payload = { phase }
      switch(phase) {
        case 'fetch': 
          payload.size = size 
          payload.total = total
          break
        case 'finished':
          payload.layers = dxfViewerRef.current.GetLayers()
          break;
        default: 
          // nothing else to do...
      }
      onProgress(payload)
    }
  }
  
  useEffect(()=>{
    if (dxfViewerRef.current) {
      dxfViewerRef.current.Clear()
      if (fileUrl) {
        dxfViewerRef.current.Load({
          url: fileUrl,
          fonts: null,
          progressCbk: _onProgress,
          workerFactory: () => DxfViewer.SetupWorker()
        })
        // Using "loaded" message instead
        .then(() => {
          _onProgress("finished")
        })
      }
    }
  }, [fileUrl])

  return (
    <div ref={viewerCanvasRef} className="viewer-canvas-container"/>
  )

}

export default DxfViewerWrapper