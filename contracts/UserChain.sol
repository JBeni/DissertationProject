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
        usersAddress.push(_walletAddress);
        usersCounter++;
    }

    function changeUserRole(uint256 _role, address _walletAddress) public onlyOwner {
        users[_walletAddress]._role = Roles(_role);
        users[_walletAddress]._timestamp = block.timestamp;
        emit UserEvent(users[_walletAddress], _walletAddress);
    }

    function getAllUsers() public view returns(User[] memory) {
        User[] memory allUsers = new User[](usersCounter);
        for (uint256 index = 0; index < usersCounter; index++) {
            address _walletAddress = usersAddress[index];
            User storage user = users[_walletAddress];
            allUsers[index] = user;
        }
        return allUsers;
    }

    function getUserInfo(address _walletAddress) public view returns (User memory) {
        //require(msg.sender != address(0x0), "Address is not valid.");
        return users[_walletAddress];
    }
}
