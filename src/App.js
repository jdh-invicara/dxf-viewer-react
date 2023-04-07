import React, {useState, useEffect} from 'react'
import Button from '@mui/material/Button'
import SplitPane from 'react-split-pane'

import DxfViewerWrapper from './DxfViewerWrapper'
import DxfInfoPane from './DxfInfoPane'

import './App.css'
import './split-pane.css'

const App = () => {
  let [file, setFile] = useState(null)
  let [fileName, setFileName] = useState("")
  let [fileUrl, setFileUrl] = useState("")
  let [fileSize, setFileSize] = useState(0)
  let [progress, setProgress] = useState(null)

  useEffect(()=> {
    console.log({file})
    if (file) {
      setFileName(file.name)
      setFileSize(file.size)
      setFileUrl(URL.createObjectURL(file))
    }
  }, [file])
  
  const watchProgress = (progress) => {
    setProgress(progress)
    console.log(progress)
  }

  const handleEvent = (name, ev) => {
    console.log(name, ev)
  }

  return (
  <div>
    <div className='header'>
      <span className='app-title'>DXF Tool</span>
      <Button variant="contained" component="label">
        Select File 
        <input type="file" hidden accept='.dxf' onChange={e=>setFile(e.target.files[0])}/>
      </Button>
      <span className='selected-file'>{file?.name || "<-- Select a DXF File"}</span>
      <span className='app-description'>Simple viewer app using <a target="_blank" href="https://github.com/vagran/dxf-viewer">dxf-viewer</a> and React.  
          Modeled after <a target="_blank" href="https://github.com/vagran/dxf-viewer-example-src">dxf-viewer-example</a></span>
    </div>
    <div className='main-area'>
      <SplitPane
        split="vertical"
        minSize={150}
        defaultSize={parseInt(localStorage.getItem('splitPos') || 250)}
        onChange={(size) => localStorage.setItem('splitPos', size)}
      >
        <div className='info pane'> <DxfInfoPane fileName={fileName} status={progress} fileSize={fileSize}/> </div>
        <div className='viewer pane'> <DxfViewerWrapper fileUrl={fileUrl} onProgress={watchProgress} onEvent={handleEvent} options={{}} /> </div>
      </SplitPane>
    </div>
  </div>
)}

export default App


