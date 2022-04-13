import './App.css';
import Decentralized from './contracts/Decentralized.json'
import Web3 from 'web3'
import React, {Component} from 'react'
import Post from './components/Post'
import File from './components/File'
import Item from './components/Item'
import Movies from './components/Movies'
import Map from './components/Map'
import { BrowserRouter, Link, Route, Switch }  from 'react-router-dom'

const API_KEY = "d609b7522e0d90fff2f965f402e48b5e"

const ipfsHttpClient = require('ipfs-http-client')
const ipfsClient = ipfsHttpClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3Module()
    await this.loadBlockchainData()
  }

  async loadWeb3Module() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Ethereum browser not found!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const currentNetworkId = await web3.eth.net.getId()
    const currentNetworkData = Decentralized.networks[currentNetworkId]
    if(currentNetworkData) {
      const decentralized = new web3.eth.Contract(Decentralized.abi, currentNetworkData.address)
      this.setState({ decentralized })
      this.setState({ nftTokenURIString: 'https://ipfs.io/ipfs/bafybeigdmytd7ep3v2eu2rb3s4itbsacgt672j5zsjlpcqhtzlykzr2cz4' })
      fetch('https://ipfs.io/ipfs/bafybeigdmytd7ep3v2eu2rb3s4itbsacgt672j5zsjlpcqhtzlykzr2cz4').then(res => res.json().then(jsonObject => {
        console.log(jsonObject);
        this.setState({nftTokenURI: jsonObject})
      }))
      const postsCount = await decentralized.methods.postCount().call()
      this.setState({ postsCount })
      const filesCountLocal = await decentralized.methods.fileCount().call()
      this.setState({ filesCountLocal })
      const itemCount = await decentralized.methods.itemCount().call()
      this.setState({ itemCount })
      const moviesCount = await decentralized.methods.movieCount().call()
      this.setState({ moviesCount })
      const placesCount = await decentralized.methods.placeCount().call()
      this.setState({ placesCount })
      for (let i = 1; i <= postsCount; i++) {
        const post = await decentralized.methods.posts(i).call()
        this.setState({
          post: [...this.state.post, post]
        })
      }
      for (let i = filesCountLocal; i >= 1; i--) {
        const file = await decentralized.methods.files(i).call()
        this.setState({
          files: [...this.state.files, file]
        })
      }
      for (let i = itemCount; i >= 1; i--) {
        const item = await decentralized.methods.items(i).call()
        if(item.itemPrice > 0){
          this.setState({
            items: [...this.state.items, item]
          })
        }
        
      }

      for (let i = moviesCount; i >= 1; i--) {
        const movie = await decentralized.methods.movies(i).call()
        this.setState({
          movies: [...this.state.movies, movie]
        })
      }

      for (let i = placesCount; i >= 1; i--) {
        const place = await decentralized.methods.places(i).call()
        this.setState({
          places: [...this.state.places, place]
        })
      }
      this.setState({
        post: this.state.post.sort((a,b) => b.tipAmount - a.tipAmount )
      })
      fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc`).then(res => res.json().then(data => {
        let popularMovies = data.results
        console.log(popularMovies)
        this.setState({ popularMovies })
      }))
      fetch('https://covid19.mathdro.id/api/countries/gb/confirmed').then(res => res.json().then(data => {
        this.setState({ covid19Data: data })
      }))
      this.setState({ loading: false})
    } else {
      window.alert('Smart Contract not deployed to detected network/ local network.')
    }
  }

  captureFile = e => {
    e.preventDefault()
    const currentFile = e.target.files[0]
    const fileReader = new window.FileReader()
    fileReader.readAsArrayBuffer(currentFile)
    fileReader.onloadend = () => {
      this.setState({ bufferArrFile: Buffer(fileReader.result),
        fileName:currentFile.name
       })
    }
  }

  capturePost = e => {
    e.preventDefault()
    const currentFile = e.target.files[0]
    const fileReader = new window.FileReader()
    fileReader.readAsArrayBuffer(currentFile)
    fileReader.onloadend = () => {
      this.setState({ bufferArrPost: Buffer(fileReader.result) })
    }
  }

  captureItem = e => {
    e.preventDefault()
    const currentFile = e.target.files[0]
    const fileReader = new window.FileReader()
    fileReader.readAsArrayBuffer(currentFile)
    fileReader.onloadend = () => {
      this.setState({ bufferArrItem: Buffer(fileReader.result) })
    }
  }

  uploadPost = postDescription => {
    ipfsClient.add(this.state.bufferArrPost, (error, result) => {
      if(error) {
        console.error(error)
        return
      }
      this.setState({ loading: true })
      this.state.decentralized.methods.uploadPost(result[0].hash, postDescription).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }

  tipPostOwner(id, tipAmount) {
    this.setState({ loading: true })
    this.state.decentralized.methods.tipPostOwner(id).send({ from: this.state.account, value: tipAmount }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  uploadFile = description => {
    ipfsClient.add(this.state.bufferArrFile, (error, result) => {
      if(error) {
        console.error(error)
        return
      }
    this.setState({ loading: true })
      this.state.decentralized.methods.uploadFile(result[0].hash, result[0].size, this.state.fileName, description).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({
         loading: false,
         fileName: null
       })
       window.location.reload()
      }).on('error', (e) =>{
        window.alert('Error Detected!')
        this.setState({loading: false})
      })
    })
  }

  convertToBytes =  bytes => {
    let sizeTypes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizeTypes[i];
   }


  uploadItem = (name, description, price) => {
    this.setState({ loading: true })
      this.state.decentralized.methods.uploadItem(name,description,price).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({
         loading: false
       })
       window.location.reload()
      }).on('error', (e) =>{
        window.alert('Error Detected!')
        this.setState({loading: false})
      }) 
  }

  buyItem = (id, price) => {
    this.setState({ loading: true })
    this.state.decentralized.methods.buyItem(id).send({ from: this.state.account, value: price }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
      window.location.reload()
    })
  }

  handleInput = (e) => {
    e.preventDefault()
    const toSearch = e.target.value
    this.setState({ search: toSearch })
    if(toSearch.length === 0){
      fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc`).then(res => res.json().then(data => {
        let popularMovies = data.results
        console.log(popularMovies)
        this.setState({ popularMovies })
      }))
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    fetch(`https://api.themoviedb.org/3/search/movie?query=${this.state.search}&api_key=${API_KEY}&language=en-US&page=1&include_adult=false`).then(data => data.json().then(res => {
      this.setState({ popularMovies:res.results })
    }))
  }

  bookMovie = (id, price) => {
    this.setState({ loading: true })
      this.state.decentralized.methods.addBookedMovie(id).send({ from: this.state.account, value: price }).on('transactionHash', (hash) => {
       this.setState({loading: false})
       window.location.reload()
      })
    }
  
  showBookedMovies = () => {
    let resultsArr = []
    let newArr = []
    this.setState(prevstate => ({ 
      booked: !prevstate.booked
    }
    ));
    if(this.state.booked){
      if(this.state.moviesCount > 0){
        this.setState({ 
          popularMovies:[] 
        })
        for(let i = 0; i < this.state.moviesCount; i++){
          resultsArr.push(this.state.movies[i].movieId)
        }
        for(let i = 0; i < resultsArr.length;i++){
          fetch(`https://api.themoviedb.org/3/movie/${resultsArr[i]}?api_key=${API_KEY}`).then(res => res.json().then(data => {
            this.setState(prevstate => ({ 
              popularMovies: [...prevstate.popularMovies, data]
            }
            ));
          }))
        }
      }
    }else{
      fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc`).then(res => res.json().then(data => {
        let popularMovies = data.results
        console.log(popularMovies)
        this.setState({ popularMovies })
        console.log('fetching again')
      }))
    }
  }

  setLocation = (location) => {
    this.setState({ locationData: location })
  }
  
  setSelectedPlace = (place) => {
    this.setState({ selectedPlace: place})
  }

  addPlaceDetails = (long, lat, confirmed, recovered, deaths) => {
    this.setState({ loading: true })
      this.state.decentralized.methods.addPlaceDetails(long, lat, confirmed, recovered, deaths).send({ from: this.state.account }).on('transactionHash', (hash) => {
       this.setState({loading: false})
      })
  }

  showBlockchainPlaces = () => {
    this.setState({ showPlaces: true })
  }
  

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      decentralized: null,
      nft: null,
      post: [],
      files:[],
      items:[],
      movies:[],
      places:[],
      loading: true,
      renderPost: false,
      renderFile: false,
      renderItem: false,
      renderVoting: false,
      renderNFT: false,
      search:'',
      searchArray:[],
      booked: false,
      covid19Data:[],
      locationData:{
        longitude:1.1743,
        latitude:52.3555,
        width:'100vw',
        height:'100vh',
        zoom:6
      },
      selectedPlace: null,
      showPlaces: false
    }
    this.uploadPost = this.uploadPost.bind(this)
    this.tipPostOwner = this.tipPostOwner.bind(this)
    this.captureFile = this.captureFile.bind(this)
    this.capturePost = this.capturePost.bind(this)
    this.captureItem = this.captureItem.bind(this)
    this.uploadItem = this.uploadItem.bind(this)
    this.buyItem = this.buyItem.bind(this)
    this.handleInput = this.handleInput.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.bookMovie = this.bookMovie.bind(this)
    this.showBookedMovies = this.showBookedMovies.bind(this)
    this.setLocation = this.setLocation.bind(this)
    this.setSelectedPlace = this.setSelectedPlace.bind(this)
    this.addPlaceDetails = this.addPlaceDetails.bind(this)
    this.showBlockchainPlaces = this.showBlockchainPlaces.bind(this)
  }

  render() {
    return (
      <BrowserRouter>
      <div className="App">
        { this.state.loading
          ? <div><p>Loading:</p></div> 
          : <div>
            <Switch>
              <Route exact path="/">
              <Link to = "/socialmedia">Social Media</Link>
              <br></br>
              <Link to = "/filesystem">File System</Link>
              <br></br>
              <Link to = "/ecommerce">eCommerce</Link>
              <br></br>
              <Link to = "/moviesystem">Movie System</Link>
              <br></br>
              <Link to = "/map">Covid-19 Map</Link>
              <br></br>
            </Route>

            <Route path="/socialmedia">
              <Post
                posts={this.state.post}
                captureFile={this.capturePost}
                uploadPost={this.uploadPost}
                tipPostOwner={this.tipPostOwner}
              />
            </Route> 

            <Route path="/filesystem">
              <File 
                files={this.state.files}
                captureFile={this.captureFile}
                uploadFile={this.uploadFile}
                convertToBytes={this.convertToBytes}
              />
            </Route>
           
           <Route path="/ecommerce">
              <Item
                items={this.state.items}
                uploadItem={this.uploadItem}
                buyItem={this.buyItem}
              />
            </Route>

            <Route path="/moviesystem">
              <Movies
                popularMovies = {this.state.popularMovies}
                handleInput = {this.handleInput}
                handleSubmit = {this.handleSubmit}
                bookMovie = {this.bookMovie}
                bookedMovies = {this.state.movies}
                booked = {this.state.booked}
                showBookedMovies = {this.showBookedMovies}
              />
            </Route>

            <Route path="/map">
              <Map
                locationData = {this.state.locationData}
                setLocation = {this.setLocation}
                covid19Data = {this.state.covid19Data}
                setSelectedPlace = {this.setSelectedPlace}
                selectedPlace = {this.state.selectedPlace}
                showPlaces = {this.state.showPlaces}
                places = {this.state.places}
              />
            </Route>

            </Switch> 
          </div>
        }
      </div>
      </BrowserRouter>
    );
  }
}

export default App;
