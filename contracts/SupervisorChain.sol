// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract Supervisor {
    address _supervisorAddress;

    constructor() {
        _supervisorAddress = msg.sender;
    }

    modifier onlySupervisor {
        require(_supervisorAddress == msg.sender, "You are not a supervisor");
        _;
    }
}
