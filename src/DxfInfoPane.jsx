import React, {useEffect, useState} from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const DxfInfoPane = ({fileName, fileSize, status}) => {

  const getStatusMessage = () => status?.phase == "fetch" ? `fetching ${status.size} of ${status.total}` : status.phase

  return (
    <>
      <TableContainer component={Paper} className='file-info-table'>
        <Table aria-label="simple table">
          <TableBody>
            <KeyValTableRow kkey="File Name" val={fileName || "No File Selected"} />
            {fileSize !==0 && <KeyValTableRow kkey="File Size" val={fileSize} />}
            {status && status?.phase != "finished" && <KeyValTableRow kkey="Status" val={getStatusMessage()} />}
            {status?.phase == "finished" && <KeyValTableRow kkey="Number of layers" val={status?.layers.length} />}
          </TableBody>
        </Table>
      </TableContainer>
      {status?.layers && 
          <div>
            <LayersList layers={status.layers} dxfViewer={status?.dxfViewer} />
          </div>
      }
    </>
  )
}

export default DxfInfoPane

const KeyValTableRow = ({kkey, val}) => 
  <TableRow>
    <TableCell>{kkey}</TableCell>
    <TableCell>{val}</TableCell>
  </TableRow>

const LayersList = ({layers: layersIn, dxfViewer}) => {

  console.log(dxfViewer)
  console.log(dxfViewer.GetLayers())

  let [layers, setLayers] = useState([])
  let [items, setItems] = useState([])

  useEffect(()=>{
    if (layersIn) {
      let newLayers = [{name:"_all_layers_", displayName: "All Layers", color: 0xffffff, selected: true}]
      layersIn.forEach(l => newLayers.push({...l, selected: true}))
      setLayers(newLayers)
    }
  },[layersIn])

  useEffect(()=>{
    setItems(layers.map(l =>(<LayerListItem layer={l} onChange={_onChange}/>)))
  },[layers])

  const _onChange = (name, value) => {
    console.log({name, value})
    if (name=="_all_layers_") {
      let newLayers = layers.slice(0)
      newLayers.forEach(l => {
        l.selected = value
        if (l.name != "_all_layers_") {
          // if (onChange) onChange(l.name, value)
          if (dxfViewer) dxfViewer.ShowLayer(l.name, value)
        }
      })
      setLayers(newLayers)
    }
    else {
      let i = layers.findIndex(l => l.name == name)
      let newLayers = layers.slice(0)
      newLayers[i].selected = value    
      setLayers(newLayers)
      // if (onChange) onChange(name, value)      
      if (dxfViewer) dxfViewer.ShowLayer(name, value)
    }
  }

  return (
    <ul className='layer-list'>
      {items}
    </ul>
  )
}

const LayerListItem = ({layer, onChange}) => 
  <li key={"ll-"+layer.name}>
    <div className='swatch' style={{
      display:"inline-block",
      backgroundColor: layer.color==0 ? "black" : "#" + layer.color.toString(16),
      borderColor: layer.color==0 ? "black" : "#" + layer.color.toString(16)
      }}>
    </div>
    <input type="checkbox" checked={layer.selected} onChange={e=>onChange(layer.name, e.target.checked)}/>
    {layer.displayName}
  </li>