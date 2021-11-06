// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract User {
    mapping(address => S_UserData) public userInfo;
    address public owner;

    struct S_UserData {
        bytes32 username;
        bytes32 email;
        bytes32 firstname;
        bytes32 lastname;
        Roles role;
        address walletAddress;
    }

    enum Roles {
        DefaultRole,
        ProjectInitiator,
        CompanyBuilder,
        ProjectSupervisor
    }

    event UserRegistered(address indexed _walletAddress, bytes32 _username, bytes32 _email, bytes32 _firstname, bytes32 _lastname, Roles _role);

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
        bytes32 _username, bytes32 _email, bytes32 _firstname,
        bytes32 _lastname, uint _role, address _walletAddress
    ) public onlyOwner {
        userInfo[_walletAddress].username = _username;
        userInfo[_walletAddress].email = _email;
        userInfo[_walletAddress].firstname = _firstname;
        userInfo[_walletAddress].lastname = _lastname;
        userInfo[_walletAddress].role = Roles(_role);
        userInfo[_walletAddress].walletAddress = _walletAddress;
        emit UserRegistered(_walletAddress, _username, _email, _firstname, _lastname, Roles(_role));
    }

    function changeUserRole(uint _role, address _walletAddress) public onlyOwner returns(bytes32) {
        userInfo[_walletAddress].role = Roles(_role);
        return "Role Updated!";
    }

    function getUserInfo(address _walletAddress) external view onlyOwner returns(S_UserData memory) {
        return userInfo[_walletAddress];
    }

    function getUser() public view onlyOwner returns(bytes32) {
        return "Beniamin";
    }
}
