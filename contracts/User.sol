// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract User {
    mapping(address => S_UserData) public userInfo;
    address public owner;
    uint256 public usersCount = 0;
    address[] public userAddresses;

    S_UserData[] public allUsers;

    struct S_UserData {
        string username;
        string email;
        string firstname;
        string lastname;
        Roles role;
        address walletAddress;
    }

    enum Roles {
        DefaultRole,
        ProjectInitiator,
        CompanyBuilder,
        ProjectSupervisor
    }

    event UserRegistered(
        address indexed _walletAddress,
        string indexed _username,
        string _email,
        string _firstname,
        string _lastname,
        Roles indexed _role
    );

    event UserChanges(
        string username,
        string firstname,
        string lastname,
        string email,
        Roles role,
        address walletAddress
    );

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
        string memory _email,
        string memory _firstname,
        string memory _lastname,
        uint256 _role,
        address _walletAddress
    ) public onlyOwner {
        userInfo[_walletAddress].username = _username;
        userInfo[_walletAddress].email = _email;
        userInfo[_walletAddress].firstname = _firstname;
        userInfo[_walletAddress].lastname = _lastname;
        userInfo[_walletAddress].role = Roles(_role);
        userInfo[_walletAddress].walletAddress = _walletAddress;
        emit UserRegistered(
            _walletAddress,
            _username,
            _email,
            _firstname,
            _lastname,
            Roles(_role)
        );
        userAddresses.push(_walletAddress);
        allUsers.push(S_UserData(_username, _email, _firstname, _lastname, Roles(_role), _walletAddress));
        usersCount++;
    }

    function changeUserRole(uint _role, address _walletAddress) public returns(string memory) {
        userInfo[_walletAddress].role = Roles(_role);
        emit UserChanges(
            userInfo[_walletAddress].username,
            userInfo[_walletAddress].firstname,
            userInfo[_walletAddress].lastname,
            userInfo[_walletAddress].email,
            userInfo[_walletAddress].role,
            userInfo[_walletAddress].walletAddress
        );
        return "Role Updated!";
    }

    function getUserAddresses() external view returns (address[] memory) {
        return userAddresses;
    }

    function getAllUsers() external view returns (S_UserData[] memory) {
        return allUsers;
    }

    function getUserInfo(address _address)
        external
        view
        returns (S_UserData memory)
    {
        return userInfo[_address];
    }
}
