import React, { Component } from 'react'

export default class Movies extends Component{
    render(){
        return(
            <div>
                <button onClick={this.props.showBookedMovies}>Show Booked Movies</button>
                <form onSubmit={(e) => this.props.handleSubmit(e)}>
                <input type="text" onChange={(e) => this.props.handleInput(e)}/>
                </form>
        
                {this.props.popularMovies.length > 0 ? this.props.popularMovies.map((movie) => {
                    return(
                        <div className="movies" key ={movie.id}>
                            <span className="movie">
                            <img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}></img> 
                            <h5>{movie.original_title}</h5>
                            {this.props.booked &&
                                    <button onClick={() => {
                                        let price = window.web3.utils.toWei('0.1', 'Ether')
                                        console.log(movie.id, price)
                                        this.props.bookMovie(movie.id, price)
                                    }}>Book Movie.</button>
                                }
                            </span>
                        </div>
                    )
                }):''}
        </div>
        )
    }
}