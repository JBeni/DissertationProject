// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import './SharedChain.sol';

contract UserChain is SharedChain {
    address owner;

    mapping(address => User) public users;
    uint256 public usersCounter = 0;
    address[] usersAddress;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(address(0xf08B741073b3Cb01ef6fB3B412E71C977F276fAa) == msg.sender, "You are not the right user.");
        _;
    }

    function registerUser(
        bytes32 _firstname,
        bytes32 _lastname,
        uint256 _role,
        address _walletAddress
    ) public onlyOwner {
        require(address(0x0) != _walletAddress, "Address is not valid.");
        if (owner != msg.sender) revert("You are not the right user.");

        users[_walletAddress] = User(
            _firstname, _lastname,
            Roles(_role), _walletAddress, block.timestamp
        );

        emit UserEvent(users[_walletAddress], _walletAddress);
        usersAddress.push(_walletAddress);
        usersCounter++;
    }

    function changeUserRole(uint256 _role, address _walletAddress) public onlyOwner {
        if (owner != msg.sender) revert("You are not the right user.");

        users[_walletAddress]._role = Roles(_role);
        users[_walletAddress]._timestamp = block.timestamp;
        emit UserEvent(users[_walletAddress], _walletAddress);
    }

    function getAllUsers() public view onlyOwner returns(User[] memory) {
        User[] memory allUsers = new User[](usersCounter);
        for (uint256 index = 0; index < usersCounter; index++) {
            address _walletAddress = usersAddress[index];
            User storage user = users[_walletAddress];
            allUsers[index] = user;
        }
        return allUsers;
    }

    function getUserInfo(address _walletAddress) public view onlyOwner returns (User memory) {
        return users[_walletAddress];
    }
}
