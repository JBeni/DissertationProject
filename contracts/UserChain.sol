// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import './SharedChain.sol';

contract UserChain is SharedChain {
    address public owner;

    mapping(address => User) public users;
    address[] public usersAddress;
    uint256 public usersCounter = 0;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "You are not an owner");
        _;
    }

    modifier checkUser(address _address) {
        require(_address == msg.sender, "Address");
        _;
    }

    function registerUser(
        string memory _username,
        bytes32 _email,
        bytes32 _firstname,
        bytes32 _lastname,
        uint256 _role,
        address _walletAddress
    ) public onlyOwner {
        users[_walletAddress] = User(
            usersCounter, _username, _email, _firstname, _lastname,
            Roles(_role), _walletAddress, block.timestamp
        );

        emit UserEvent(
            usersCounter, _username, _email, _firstname,
            _lastname, Roles(_role), _walletAddress, block.timestamp
        );
        usersAddress.push(_walletAddress);
        usersCounter++;
    }

    function changeUserRole(uint _role, address _walletAddress) public {
        users[_walletAddress]._role = Roles(_role);

        emit UserEvent(
            users[_walletAddress]._index, users[_walletAddress]._username,
            users[_walletAddress]._email, users[_walletAddress]._firstname,
            users[_walletAddress]._lastname, Roles(_role), _walletAddress, block.timestamp
        );
    }

    function getAllUsers() public view returns(User[] memory) {
        User[] memory allUsers = new User[](usersCounter);
        for (uint index = 0; index < usersCounter; index++) {
            address _walletAddress = usersAddress[index];
            User storage user = users[_walletAddress];
            allUsers[index] = user;
        }
        return allUsers;
    }

    function getUserInfo(address _walletAddress) public view returns (User memory) {
        return users[_walletAddress];
    }
}
