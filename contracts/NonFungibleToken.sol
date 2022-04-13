// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
 
contract NonFungibleToken is ERC721URIStorage {
 
  uint256 public nftTokenCounter;
  address public nftCreator;

  constructor () public ERC721 ("Gurkaran's NFT", "NFT"){
    nftTokenCounter = 0;
    nftCreator = msg.sender;
  }

  function createMint(address _toAddress, string calldata _tokenURI) external {
    require(msg.sender == nftCreator);
    _safeMint(_toAddress, nftTokenCounter);
    _setTokenURI(nftTokenCounter, _tokenURI);
    nftTokenCounter ++;
  }

 
}