const crypto = artifacts.require("CryptoCurrency");

module.exports = function(deployer) {
  deployer.deploy(crypto);
};