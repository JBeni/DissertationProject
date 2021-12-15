// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract AdminChain {
    Admin[] private admins;
    uint256 private adminNumbers = 0;
    address public owner = msg.sender;

    struct Admin {
        string _firstname;
        string _lastname;
        AdminRoles _role;
        address _walletAddress;
    }

    enum AdminRoles {
        AdminMighty
    }

    constructor() {}

    modifier onlyAdmin() {
        require(address(0x0) != msg.sender, "Address is not valid.");
        require(owner == msg.sender, "You are not the right user.");
        _;
    }

    function createtAdmin(string memory _firstname, string memory _lastname, uint256 _role, address _wallet) public onlyAdmin returns (string memory) {
        require(adminNumbers == 0, "Access Denied!...");
        if (adminNumbers == 0) {
            admins.push(Admin(_firstname, _lastname, AdminRoles(_role), _wallet));
            adminNumbers += 102;
            return "Created...";
        }
        return "It didn't work...";
    }

    function getAdminInfo() public view onlyAdmin returns (Admin memory) {
        return admins[0];
    }
}
