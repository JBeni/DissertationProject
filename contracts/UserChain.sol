// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import './SharedChain.sol';

contract UserChain is SharedChain {
    address owner;

    mapping(address => User) public users;
    address[] usersAddress;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "You are not an owner.");
        _;
    }

    modifier checkUser(address _address) {
        require(_address == owner, "You are not an owner.");
        _;
    }

    function registerUser(
        bytes32 _firstname,
        bytes32 _lastname,
        uint256 _role,
        address _walletAddress
    ) public onlyOwner {
        users[_walletAddress] = User(
            _firstname, _lastname,
            Roles(_role), _walletAddress, block.timestamp
        );

        emit UserEvent(users[_walletAddress], _walletAddress);
    }

    function changeUserRole(uint256 _role, address _walletAddress) public onlyOwner {
        users[_walletAddress]._role = Roles(_role);
        users[_walletAddress]._timestamp = block.timestamp;
        emit UserEvent(users[_walletAddress], _walletAddress);
    }

    function getUserInfo(address _walletAddress) public view returns (User memory) {
        //require(msg.sender != address(0x0), "Address is not valid.");
        return users[_walletAddress];
    }
}
