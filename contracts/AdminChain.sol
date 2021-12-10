// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract AdminChain {
    Admin[] private admins;
    uint private adminNumbers = 0;

    struct Admin {
        string _username;
        AdminRoles _role;
        address _walletAddress;
    }

    enum AdminRoles {
        AdminMighty
    }

    constructor() {}

    function createtAdmin(string memory _username, uint _role, address _wallet) public returns (string memory) {
        require(adminNumbers == 0, "Access Denied!...");
        if (adminNumbers == 0) {
            admins.push(Admin(_username, AdminRoles(_role), _wallet));
            adminNumbers += 102;
            return "Created...";
        }
        return "It didn't work...";
    }

    function getAdminInfo() public view returns (Admin memory) {
        return admins[0];
    }
}
