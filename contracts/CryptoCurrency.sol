// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract CryptoCurrency{
    mapping(address => uint) public walletBalances;
    uint public tokenSupply = 1000 * 10 ** 18;
    string public tokenName = "Gurkaran's Token";
    string public tokenSymbol = "GKC";
    uint public number = 18;
    mapping(address => mapping(address => uint)) public allowed;

    event BalanceTransfered(address indexed fromAddress, address indexed toAddress, uint amount);
    event AddressApproved(address indexed ownerAddress, address indexed spenderAddress, uint amount);

    constructor(){
        walletBalances[msg.sender] = tokenSupply;
    }

    function calculateBalanceOf(address _owner) public view returns(uint){
        return walletBalances[_owner];
    }

    function transferBalance(address _toAddress, uint _amount) public returns (bool){
        require(calculateBalanceOf(msg.sender) >= _amount, "Not enough balance!");
        walletBalances[_toAddress] += _amount;
        walletBalances[msg.sender] -= _amount;
        emit BalanceTransfered(msg.sender, _toAddress, _amount);
        return true;
    }

    function transfer(address _fromAddress, address _toAddress, uint _amount) public returns(bool){
        require(calculateBalanceOf(_fromAddress) >= _amount, 'Not enough balance!');
        require(allowed[_fromAddress][msg.sender] >= _amount, 'Not enough allowance!');
        walletBalances[_toAddress] += _amount;
        walletBalances[_fromAddress] -= _amount;
        emit BalanceTransfered(_fromAddress, _toAddress, _amount);
        return true;
    }

    function approveAddress(address _spenderAddress, uint _amount) public returns (bool){
        allowed[msg.sender][_spenderAddress] = _amount;
        emit AddressApproved(msg.sender, _spenderAddress, _amount);
        return true;
    }

}