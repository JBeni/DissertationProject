// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3 <0.9.0;

contract SignatureChain {

    constructor() {}

    modifier onlyValidAddress() {
        require(address(0x0) != msg.sender, "Address is not valid.");
        _;
    }

    function verifySignature(address p, bytes32 hash, uint8 v, bytes32 r, bytes32 s) external view onlyValidAddress returns(bool) {
        return ecrecover(hash, v, r, s) == p;
    }

    function verifyTest(bytes32 hash, uint8 v, bytes32 r, bytes32 s) external view onlyValidAddress returns(address) {
        return ecrecover(hash, v, r, s);
    }
}
