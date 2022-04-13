import React, {Component} from 'react'
import ReactMapGl,{Marker,Popup} from 'react-map-gl'

export default class Map extends Component{
    render(){
        return(
            <ReactMapGl {...this.props.locationData} mapboxApiAccessToken={'pk.eyJ1IjoiZGFmdWMiLCJhIjoiY2tsNmVob3hhMDU3eTJvbnBjeTZnZ2x6ZiJ9._kXojEL_1dpdw-FfcmJ4YA'} onViewportChange={() => {
                this.props.setLocation(this.props.locationData)
            }} mapStyle='mapbox://styles/dafuc/ckl6qfpg2244518mud63pkjkg'>
        {this.props.covid19Data.length > 0 ? this.props.covid19Data.map(res => (
            <Marker key={res.uid}
                    latitude={res.lat}
                    longitude={res.long}
            >
                <button onClick={(e) => {
                  e.preventDefault()
                  this.props.setSelectedPlace(res)
                }} className='imageButton'>
                 <img src='https://phil.cdc.gov//PHIL_Images/23311/23311_lores.jpg' alt='Covid-19 Image' className="iconImage" />
                </button>
            </Marker>
        ) ):''}

        
        (
          <Popup latitude={this.props.selectedPlace.lat} longitude={this.props.selectedPlace.long} onClose={() => {
            this.props.setSelectedPlace(null)
          }}>
            <div className="popup">
              <h2>{this.props.selectedPlace.provinceState}</h2>
              <p>Confirmed Cases : {this.props.selectedPlace.confirmed}</p>
              {this.props.selectedPlace.recovered === 0 ? (
                <p>Recovered Cases are not disclosed.</p>
              ):<p>Recovered Cases : {this.props.selectedPlace.recovered}</p>}
              <p>Deaths : {this.props.selectedPlace.deaths}</p>
            </div>
          </Popup>
        <button onClick={this.props.showBlockchainPlaces}>Saved Blockchain Data</button>
        {this.props.showPlaces & this.props.places.length > 0 && this.props.places.map(place => {
            console.log(place);
            return(
                <div>

                </div>
            )
        })}
        </ReactMapGl>
        )
    }
}