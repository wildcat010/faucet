// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Faucet{
    uint public funds = 1000;
    address public manager;

    uint public numOfFunders;

    mapping(address => bool) private funders;
    mapping(uint => address) private lutFunders;

    constructor() {
        manager = msg.sender;
    }

    receive() external payable {
        
    }

    function addFunds() external payable {
    address funder = msg.sender;

    if (!funders[funder]) {
      uint index = numOfFunders++;
      funders[funder] = true;
      lutFunders[index] = funder;
    }
  }
}