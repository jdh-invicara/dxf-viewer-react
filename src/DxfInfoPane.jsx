import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const DxfInfoPane = ({fileName, fileSize, status}) => {

  const getStatusMessage = () => status?.phase == "fetch" ? `fetching ${status.size} of ${status.total}` : status.phase

  return (
    <>
      <TableContainer component={Paper} className='file-info-table'>
        <Table aria-label="simple table">
          <TableBody>
            <TableRow>
              <TableCell>File Name</TableCell>
              <TableCell>{fileName || "No File Selected"}</TableCell>
            </TableRow>
            {fileSize !==0 &&
              <TableRow>
                <TableCell>File Size</TableCell>
                <TableCell>{fileSize} bytes</TableCell>
              </TableRow>
            }
            {status && status?.phase != "finished" &&
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell>{getStatusMessage()}</TableCell>
              </TableRow>
            }
            {status?.phase == "finished" && 
              <TableRow>
              <TableCell>Number of layers</TableCell>
              <TableCell>{status?.layers.length}</TableCell>
            </TableRow>
          }
          </TableBody>
        </Table>
      </TableContainer>
      {status?.layers && 
          <div>
            <LayersList layers={status.layers} />
          </div>
      }
    </>
  )

}

export default DxfInfoPane

const LayersList = ({layers}) => 
  <ul className='layer-list'>
    <li key="all-layers"> <Swatch color={0xffffff} /> All Layers</li>
    { layers.map(l => <LayerListItem layer={l} />) }
  </ul>


const LayerListItem = ({layer}) => 
  <li key={layer.name}>
    <Swatch color={layer.color}/>
    {layer.displayName}
  </li>

const Swatch = ({color}) => 
  <div className='swatch' style={{
    backgroundColor: color==0 ? "black" : "#" + color.toString(16),
    borderColor: color==0 ? "black" : "#" + color.toString(16)
  }}>
        <input type="checkbox" />
</div>