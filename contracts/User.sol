// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract User {

    address public owner;
    mapping(address => UserData) public userInfo;

    constructor() {
        owner = msg.sender;
    }

    enum Roles {
        DefaultRole,
        ProjectInitiator,
        CompanyBuilder,
        Supervisor
    }

    struct UserData {
        bytes32 _username;
        Roles _role;
        address _userAddress;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "Address");
        _;
    }

    modifier checkUser(address _address) {
        require(_address == msg.sender, "Address");
        _;
    }

    event UserRegistered(address indexed _address, bytes32 username);

    function registerUser(bytes32 _username, uint _role, address _userAddress) public onlyOwner {
        userInfo[_userAddress]._username = _username;
        userInfo[_userAddress]._role = Roles(_role);
        userInfo[_userAddress]._userAddress = _userAddress;
        emit UserRegistered(_userAddress, _username);
    }

    function changeUserRole(uint _role, address _userAddress) public onlyOwner returns(string memory) {
        userInfo[_userAddress]._role = Roles(_role);
        return "Role Updated!";
    }

    function getUserInfo(address _userAddress) public view onlyOwner returns(UserData memory) {
        return userInfo[_userAddress];
    }
}
