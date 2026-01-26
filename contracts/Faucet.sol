// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Faucet{
    uint public funds = 1000;
    address public manager;

    constructor() {
        manager = msg.sender;
    }

    receive() external payable {
        
    }
}