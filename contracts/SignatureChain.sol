// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3 <0.9.0;

contract SignatureChain {

    constructor() {}

    modifier onlyOwner() {
        require(address(0x0) == msg.sender, "The address is not valid.");
        _;
    }

    function verifySignature(address p, bytes32 hash, uint8 v, bytes32 r, bytes32 s) external view onlyOwner returns(bool) {
        return ecrecover(hash, v, r, s) == p;
    }

    function verifyTest(bytes32 hash, uint8 v, bytes32 r, bytes32 s) external view onlyOwner returns(address) {
        return ecrecover(hash, v, r, s);
    }
}
