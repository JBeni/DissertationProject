// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3 < 0.9.0;

contract SignatureChain {

    // verify signature verifica daca mesajul semnat cu cheia privata apartinei contului cu adresa publica care trebuia sa semneze tranzactia
    // the buyer address din examplul ala e adresa walletul;ui care a initiat tranzactia
    function verifySignature(address p, bytes32 hash, uint8 v, bytes32 r, bytes32 s) external pure returns(bool) {
        return ecrecover(hash, v, r, s) == p;
    }

    function verifyTest(bytes32 hash, uint8 v, bytes32 r, bytes32 s) external pure returns(address) {
        return ecrecover(hash, v, r, s);
    }

}
