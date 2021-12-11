// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract ServiceChain {

    struct Dropdown {
        uint256 id;
        string value;
    }

    Dropdown[] public requestType;
    Dropdown[] public requestStatusForm;
    Dropdown[] public requestStatus;
    Dropdown[] public projectStatus;
    Dropdown[] public userRole;

    constructor() {}

    modifier onlyOwner() {
        require(address(0x0) == msg.sender, "The address is not valid.");
        _;
    }

    function getAddressZeroValue() public pure returns (string memory) {
        return "0x0000000000000000000000000000000000000000";
    }

    function getAdminRole() public pure returns (string memory) {
        return "AdminMighty";
    }

    function getDefaultRole() public pure returns (string memory) {
        return "DefaultRole";
    }

    function getUserProjectRole() public pure returns (string memory) {
        return "UserProject";
    }

    function getCompanyRole() public pure returns (string memory) {
        return "Company";
    }

    function getSupervisorRole() public pure returns (string memory) {
        return "Supervisor";
    }


    // function createDropdowns() public onlyOwner {
    //     requestType.push(Dropdown(0, 'SupervisorReq'));
    //     requestType.push(Dropdown(1, 'CompanyReq'));

    //     requestStatusForm.push(Dropdown(1, 'Rejected'));
    //     requestStatusForm.push(Dropdown(2, 'Approved'));

    //     requestStatus.push(Dropdown(0, 'UnApproved'));
    //     requestStatus.push(Dropdown(1, 'Rejected'));
    //     requestStatus.push(Dropdown(2, 'Approved'));

    //     projectStatus.push(Dropdown(0, 'Created'));
    //     projectStatus.push(Dropdown(1, 'ToApprove'));
    //     projectStatus.push(Dropdown(2, 'StartProject'));
    //     projectStatus.push(Dropdown(3, 'FinalizationCheck'));
    //     projectStatus.push(Dropdown(4, 'Completed'));

    //     userRole.push(Dropdown(0, 'DefaultRole'));
    //     userRole.push(Dropdown(1, 'UserProject'));
    //     userRole.push(Dropdown(2, 'Company'));
    //     userRole.push(Dropdown(3, 'Supervisor'));
    // }

    /** Methods: Check if Dropdown option exists */

    // function checkRequestTypeDropdown(uint256 _id) public view onlyOwner returns (bool) {
    //     for (uint256 index = 0; index < requestType.length; index++) {
    //         if (requestType[index].id == _id) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }

    // function checkRequestStatusFormDropdown(uint256 _id) public view onlyOwner returns (bool) {
    //     for (uint256 index = 0; index < requestStatusForm.length; index++) {
    //         if (requestStatusForm[index].id == _id) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }

    // function checkRequestStatusDropdown(uint256 _id) public view onlyOwner returns (bool) {
    //     for (uint256 index = 0; index < requestStatus.length; index++) {
    //         if (requestStatus[index].id == _id) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }

    // function checkProjectStatusDropdown(uint256 _id) public view onlyOwner returns (bool) {
    //     for (uint256 index = 0; index < projectStatus.length; index++) {
    //         if (projectStatus[index].id == _id) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }

    // function checkUserRoleDropdown(uint256 _id) public view onlyOwner returns (bool) {
    //     for (uint256 index = 0; index < userRole.length; index++) {
    //         if (userRole[index].id == _id) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }

    /** Get Dropdown[] Array */

    // function getAllRequestTypeDropdown() public view onlyOwner returns (Dropdown[] memory) {
    //     return requestType;
    // }

    // function getAllRequestStatusFormDropdown() public view onlyOwner returns (Dropdown[] memory) {
    //     return requestStatusForm;
    // }

    // function getAllRequestStatusDropdown() public view onlyOwner returns (Dropdown[] memory) {
    //     return requestStatus;
    // }

    // function getAllProjectStatusDropdown() public view onlyOwner returns (Dropdown[] memory) {
    //     return projectStatus;
    // }

    // function getAllUserRoleDropdown() public view onlyOwner returns (Dropdown[] memory) {
    //     return userRole;
    // }


    /*** Methods for Dropdowns */

    // function getCompletedProjectStatus() public view onlyOwner returns(Dropdown memory) {
    //     Dropdown memory typeData;
    //     typeData = Dropdown(4, 'Completed');
    //     return typeData;
    // }

    // function getSupervisorRequestType() public view onlyOwner returns(Dropdown memory) {
    //     Dropdown memory typeData;
    //     typeData = Dropdown(0, 'SupervisorReq');
    //     return typeData;
    // }

    // function getCompanyRequestType() public view onlyOwner returns(Dropdown memory) {
    //     Dropdown memory typeData;
    //     typeData = Dropdown(1, 'CompanyReq');
    //     return typeData;
    // }

    // function getDefaultProjectStatus() public view onlyOwner returns(Dropdown memory) {
    //     Dropdown memory typeData;
    //     typeData = Dropdown(0, 'Created');
    //     return typeData;
    // }

    // function getDefaultRequestStatus() public view onlyOwner returns(Dropdown memory) {
    //     Dropdown memory typeData;
    //     typeData = Dropdown(0, 'UnApproved');
    //     return typeData;
    // }

    /*** Dropdowns */

    // function getRequestTypeDropdown() public view onlyOwner returns(Dropdown[] memory) {
    //     Dropdown[] memory data = new Dropdown[](2);
    //     data[0] = Dropdown(0, 'SupervisorReq');
    //     data[1] = Dropdown(1, 'CompanyReq');
    //     return data;
    // }

    // function getRequestStatusFormDropdown() public view onlyOwner returns(Dropdown[] memory) {
    //     Dropdown[] memory data = new Dropdown[](2);
    //     data[0] = Dropdown(1, 'Rejected');
    //     data[1] = Dropdown(2, 'Approved');
    //     return data;
    // }

    // function getRequestStatusDropdown() public view onlyOwner returns(Dropdown[] memory) {
    //     Dropdown[] memory data = new Dropdown[](3);
    //     data[0] = Dropdown(0, 'UnApproved');
    //     data[1] = Dropdown(1, 'Rejected');
    //     data[2] = Dropdown(2, 'Approved');
    //     return data;
    // }

    // function getProjectStatusDropdown() public view onlyOwner returns(Dropdown[] memory) {
    //     Dropdown[] memory data = new Dropdown[](5);
    //     data[0] = Dropdown(0, 'Created');
    //     data[1] = Dropdown(1, 'ToApprove');
    //     data[2] = Dropdown(2, 'StartProject');
    //     data[3] = Dropdown(3, 'FinalizationCheck');
    //     data[4] = Dropdown(4, 'Completed');
    //     return data;
    // }

    // function getUserRoleDropdown() public view onlyOwner returns(Dropdown[] memory) {
    //     Dropdown[] memory data = new Dropdown[](4);
    //     data[0] = Dropdown(0, 'DefaultRole');
    //     data[1] = Dropdown(1, 'UserProject');
    //     data[2] = Dropdown(2, 'Company');
    //     data[3] = Dropdown(3, 'Supervisor');
    //     return data;
    // }
}
