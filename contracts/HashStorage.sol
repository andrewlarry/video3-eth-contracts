pragma solidity ^0.4.24;

contract HashStorage {
    string public hash;

    constructor () public {
        hash = "";
    }

    function setHash (string newHash) public {
        hash = newHash;
    }
}


