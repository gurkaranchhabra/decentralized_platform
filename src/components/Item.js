import React, { Component } from 'react';

export default class Item extends Component{
    render(){
        return(
            <div>
                <h1>Share Item: </h1>
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        const itemName = this.itemName.value
                        const itemDescription = this.itemDescription.value
                        const itemPrice = this.itemPrice.value
                        this.props.uploadItem(itemName,itemDescription,itemPrice)
                        console.log(this.props.items)
                    }}>
                        <br></br>
                        <input id="itemName" type="text" ref={(input) => { this.itemName = input }} placeholder="Item Name" required/>
                        <input id="itemDescription" type="text" ref={(input) => { this.itemDescription = input }} placeholder="Item Description" required/>
                        <input id="itemPrice" type="text" ref={(input) => { this.itemPrice = input }} placeholder="Item Price" required/>
                        <button type="submit">Upload Item!</button>
                    </form>
                    {console.log(this.props.item)}
                    {this.props.items ?
                    this.props.items.map((item,key) => {
                        return(
                            <div>
                                <h1>Name: {item.itemName}</h1>
                                <p>Description: {item.itemDescription}</p>
                                <p>Price: {item.itemPrice}</p>
                                <a
                                    href={"https://etherscan.io/address/" + item.itemOwner}
                                    rel="noopener noreferrer"
                                    target="_blank">
                                    {item.itemOwner.substring(0,10)}...
                                </a>
                                <button 
                                name={item.itemId}
                                onClick={(e) => {
                                    let itemPrice = window.web3.utils.toWei(item.itemPrice, 'Ether')
                                    this.props.buyItem(e.target.name, itemPrice)
                                }}>
                                Buy Item
                                </button>
                            </div>
                        )
                    }):'No posts found'}
            </div>
        )
    }
}

