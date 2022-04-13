const NFT = artifacts.require("NonFungibleToken");

module.exports = function(deployer, _network, accounts) {
  deployer.deploy(NFT);
  const nft = NFT.deployed()
  nft.mint(accounts[0])
};