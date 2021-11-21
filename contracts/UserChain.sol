// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract UserChain {
    address public owner;

    mapping(address => User) public users;
    User[] public allUsers;
    uint256 public usersCounter = 0;

    enum Roles {
        DefaultRole,
        ProjectInitiator,
        CompanyBuilder,
        ProjectSupervisor
    }

    struct User {
        uint _index;
        string _username;
        bytes32 _email;
        bytes32 _firstname;
        bytes32 _lastname;
        Roles _role;
        address _walletAddress;
    }

    event UserEvent(
        address indexed _walletAddress,
        string indexed _username,
        bytes32 _email,
        bytes32 _firstname,
        bytes32 _lastname,
        Roles indexed _role
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
        bytes32 _email,
        bytes32 _firstname,
        bytes32 _lastname,
        uint256 _role,
        address _walletAddress
    ) public onlyOwner {
        users[_walletAddress]._index = usersCounter;
        users[_walletAddress]._username = _username;
        users[_walletAddress]._email = _email;
        users[_walletAddress]._firstname = _firstname;
        users[_walletAddress]._lastname = _lastname;
        users[_walletAddress]._role = Roles(_role);
        users[_walletAddress]._walletAddress = _walletAddress;
        emit UserEvent(
            _walletAddress,
            _username,
            _email,
            _firstname,
            _lastname,
            Roles(_role)
        );
        allUsers.push(User(usersCounter, _username, _email, _firstname, _lastname, Roles(_role), _walletAddress));
        usersCounter++;
    }

    function changeUserRole(uint _role, address _walletAddress) public {
        users[_walletAddress]._role = Roles(_role);
        uint index = users[_walletAddress]._index;
        allUsers[index]._role = Roles(_role);
        emit UserEvent(
            _walletAddress,
            users[_walletAddress]._username,
            users[_walletAddress]._email,
            users[_walletAddress]._firstname,
            users[_walletAddress]._lastname,
            Roles(_role)
        );
        /*
            for (uint index = 0; index < allUsers.length; index++) {
                if (allUsers[index]._walletAddress == _walletAddress) {
                    allUsers[index]._role = Roles(_role);
                }
            }
        */
    }

    function getAllUsers() public view returns (User[] memory) {
        return allUsers;
    }

    function getUserInfo(address _walletAddress) public view returns (User memory) {
        return users[_walletAddress];
    }
}
