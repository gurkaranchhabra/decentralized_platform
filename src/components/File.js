import React, { Component } from 'react';
import moment from 'moment'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

export default class File extends Component{

    render(){
        return(
            <div className="file">
                <div>
                    <main role="main">
                    <div>
                    <p>&nbsp;</p>
                    <div>
                    <h2><b><ins>Share File</ins></b></h2>
                  <form onSubmit={(e) => {
                    e.preventDefault()
                    const fileDescription = this.fileDescription.value
                    this.props.uploadFile(fileDescription)
                  }} >
                      <div>
                        <br></br>
                          <input
                            id="fileDescription"
                            type="text"
                            ref={(input) => { this.fileDescription = input }}
                            placeholder="File Description"
                            required />
                      </div>
                    <input type="file" onChange={this.props.captureFile}/>
                    <button type="submit"><b>Upload File!</b></button>
                  </form>
                </div>
                <p>&nbsp;</p>
                {this.props.files.length > 0 ? 
                <div>
                  <TableContainer component={Paper}>
                  <Table aria-label="simple table">
                  <TableHead>
                  <TableRow>
                  <TableCell>id</TableCell>
                  <TableCell>name</TableCell>
                  <TableCell>description</TableCell>
                  <TableCell>size</TableCell>
                  <TableCell>date</TableCell>
                  <TableCell>uploader</TableCell>
                  <TableCell>hash</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {this.props.files.map((file, key) => {
                  return(
                      <TableRow>
                        <TableCell>{file.fileId}</TableCell>
                        <TableCell align="right">{file.fileName}</TableCell>
                        <TableCell align="right">{file.fileDescription}</TableCell>
                        <TableCell align="right">{this.props.convertToBytes(file.fileSize)}</TableCell>
                        <TableCell align="right">{moment.unix(file.fileUploadTime).format('h:mm:ss A M/D/Y')}</TableCell>
                        <TableCell align="right"><a
                            href={"https://etherscan.io/address/" + file.fileUploader}
                            rel="noopener noreferrer"
                            target="_blank">
                            {file.fileUploader.substring(0,10)}...
                          </a></TableCell>
                        <TableCell align="right">
                        <a
                          href={"https://ipfs.infura.io/ipfs/" + file.fileHash}
                          rel="noopener noreferrer"
                          target="_blank">
                          {file.fileHash.substring(0,10)}...
                        </a>
                        </TableCell>
                      </TableRow>
                  )})}
                  </TableBody>
                  </Table>
                  </TableContainer>
                </div>
                :''}
            </div>
          </main>
        </div>
    </div>
        )
    }
}
