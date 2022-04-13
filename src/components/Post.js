import React, { Component } from 'react';

export default class Post extends Component {
  
    render() {
      return (
        <div>
          <h1>Share Post: </h1>
          <form onSubmit={(e) => {
            e.preventDefault()
            const postDescription = this.postDescription.value
            this.props.uploadPost(postDescription)
          }}>
          <input type='file' accept=".jpg, .jpeg, .png, .bmp, .gif, .mp4, .mkv, .ogg, .wmv" onChange={this.props.captureFile} />
          <br></br>
          <input id="postDescription" type="text" ref={(input) => { this.postDescription = input }} placeholder="Post Description" required/>
          <button type="submit">Upload!</button>
          </form>
          {this.props.posts.map((post,key) => {
            return(
              <div>
                <ul id="postList">
                      <li>
                        <p><img src={`https://ipfs.infura.io/ipfs/${post.postHash}`} style={{ maxWidth: '420px'}}/></p>
                        <p>{post.postDescription}</p>
                      </li>
                      <li key={key}>
                        <small>
                          TIPS ON THE POST: {window.web3.utils.fromWei(post.tipPostAmount.toString(), 'Ether')} ETH
                        </small>
                        <button
                          name={post.postId}
                          onClick={(e) => {
                            let tipPostAmount = window.web3.utils.toWei('0.5', 'Ether')
                            console.log(e.target.name, tipPostAmount)
                            this.props.tipPostOwner(e.target.name, tipPostAmount)
                          }}
                        >tip 0.5 ether
                        </button>
                        </li>
                      </ul>
                    </div>
                    ) 
          })}
          </div>
      )
    }
  }
  
  
  