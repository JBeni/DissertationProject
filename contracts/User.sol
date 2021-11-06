// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract User {
    mapping(uint256 => S_UserData) public userInfo;
    address public owner;
    uint256 public usersCount = 0;
    uint256[] public userIds;

    struct S_UserData {
        uint256 index;
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

    event UserRegistered(
        address indexed _walletAddress,
        bytes32 _username,
        bytes32 _email,
        bytes32 _firstname,
        bytes32 _lastname,
        Roles _role
    );

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "You are not an owner");
        _;
    }

    modifier checkUser(address _address) {
        //require(_address == msg.sender, "Address");
        _;
    }

    function registerUser(
        bytes32 _username,
        bytes32 _email,
        bytes32 _firstname,
        bytes32 _lastname,
        uint256 _role,
        address _walletAddress
    ) public onlyOwner {
        userInfo[usersCount].index = usersCount;
        userInfo[usersCount].username = _username;
        userInfo[usersCount].username = _username;
        userInfo[usersCount].email = _email;
        userInfo[usersCount].firstname = _firstname;
        userInfo[usersCount].lastname = _lastname;
        userInfo[usersCount].role = Roles(_role);
        userInfo[usersCount].walletAddress = _walletAddress;
        emit UserRegistered(
            _walletAddress,
            _username,
            _email,
            _firstname,
            _lastname,
            Roles(_role)
        );
        userIds.push(usersCount);
        usersCount++;
    }

    // function changeUserRole(uint _role, address _walletAddress) public onlyOwner returns(string memory) {
    //     userInfo[_walletAddress].role = Roles(_role);
    //     return "Role Updated!";
    // }

    function getUserIds() external view returns (uint256[] memory) {
        return userIds;
    }

    function getUserInfo(uint256 _index)
        external
        view
        returns (S_UserData memory)
    {
        return userInfo[_index];
    }
}
