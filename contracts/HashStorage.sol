pragma solidity ^0.4.24;

contract HashStorage {
    string public hash;

    constructor(string initialHash) public {
        hash = initialHash;
    }

    function setHash(string newHash) public {
        hash = newHash;
    }
}


