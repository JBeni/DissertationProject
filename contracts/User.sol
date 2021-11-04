// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract User {

    mapping(address => S_UserData) public userInfo;
    address public owner;

    struct S_UserData {
        bytes32 username;
        Roles role;
        address userAddress;
    }

    enum Roles {
        DefaultRole,
        ProjectInitiator,
        CompanyBuilder,
        ProjectSupervisor
    }

    event UserRegistered(address indexed _address, bytes32 _username);

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

    function registerUser(bytes32 _username, uint _role, address _userAddress) public onlyOwner {
        userInfo[_userAddress].username = _username;
        userInfo[_userAddress].role = Roles(_role);
        userInfo[_userAddress].userAddress = _userAddress;
        emit UserRegistered(_userAddress, _username);
    }

    function changeUserRole(uint _role, address _userAddress) public onlyOwner returns(string memory) {
        userInfo[_userAddress].role = Roles(_role);
        return "Role Updated!";
    }

    function getUserInfo(address _userAddress) external view onlyOwner returns(S_UserData memory) {
        return userInfo[_userAddress];
    }

    function getUser() public view onlyOwner returns(string memory) {
        return "Beniamin";
    }
}
