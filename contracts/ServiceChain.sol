// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract ServiceChain {

    struct Dropdown {
        uint id;
        string value;
    }

    Dropdown[] public requestType;
    Dropdown[] public requestStatusForm;
    Dropdown[] public requestStatus;
    Dropdown[] public projectStatus;
    Dropdown[] public userRole;

    constructor() {}

    function createDropdowns() public {
        requestType.push(Dropdown(0, 'SupervisorReq'));
        requestType.push(Dropdown(1, 'CompanyReq'));

        requestStatusForm.push(Dropdown(1, 'Rejected'));
        requestStatusForm.push(Dropdown(2, 'Approved'));

        requestStatus.push(Dropdown(0, 'UnApproved'));
        requestStatus.push(Dropdown(1, 'Rejected'));
        requestStatus.push(Dropdown(2, 'Approved'));

        projectStatus.push(Dropdown(0, 'Created'));
        projectStatus.push(Dropdown(1, 'ToApprove'));
        projectStatus.push(Dropdown(2, 'StartProject'));
        projectStatus.push(Dropdown(3, 'FinalizationCheck'));
        projectStatus.push(Dropdown(4, 'Completed'));

        userRole.push(Dropdown(0, 'DefaultRole'));
        userRole.push(Dropdown(1, 'UserProject'));
        userRole.push(Dropdown(2, 'Company'));
        userRole.push(Dropdown(3, 'Supervisor'));
    }

    /** Methods: Check if Dropdown option exists */

    function checkRequestTypeDropdown(uint _id) public view returns (bool) {
        for (uint index = 0; index < requestType.length; index++) {
            if (requestType[index].id == _id) {
                return true;
            }
        }
        return false;
    }

    function checkRequestStatusFormDropdown(uint _id) public view returns (bool) {
        for (uint index = 0; index < requestStatusForm.length; index++) {
            if (requestStatusForm[index].id == _id) {
                return true;
            }
        }
        return false;
    }

    function checkRequestStatusDropdown(uint _id) public view returns (bool) {
        for (uint index = 0; index < requestStatus.length; index++) {
            if (requestStatus[index].id == _id) {
                return true;
            }
        }
        return false;
    }

    function checkProjectStatusDropdown(uint _id) public view returns (bool) {
        for (uint index = 0; index < projectStatus.length; index++) {
            if (projectStatus[index].id == _id) {
                return true;
            }
        }
        return false;
    }

    function checkUserRoleDropdown(uint _id) public view returns (bool) {
        for (uint index = 0; index < userRole.length; index++) {
            if (userRole[index].id == _id) {
                return true;
            }
        }
        return false;
    }


    /** Get Dropdown[] Array */

    function getAllRequestTypeDropdown() public view returns (Dropdown[] memory) {
        return requestType;
    }

    function getAllRequestStatusFormDropdown() public view returns (Dropdown[] memory) {
        return requestStatusForm;
    }

    function getAllRequestStatusDropdown() public view returns (Dropdown[] memory) {
        return requestStatus;
    }

    function getAllProjectStatusDropdown() public view returns (Dropdown[] memory) {
        return projectStatus;
    }

    function getAllUserRoleDropdown() public view returns (Dropdown[] memory) {
        return userRole;
    }


    /** Return Address with value 0 */
    function getAddressZero() public pure returns(string memory) {
        return "0x0000000000000000000000000000000000000000";
    }

    /*** Methods for Dropdowns */

    function getCompletedProjectStatus() public pure returns(Dropdown memory) {
        Dropdown memory typeData;
        typeData = Dropdown(4, 'Completed');
        return typeData;
    }

    function getSupervisorRequestType() public pure returns(Dropdown memory) {
        Dropdown memory typeData;
        typeData = Dropdown(0, 'SupervisorReq');
        return typeData;
    }

    function getCompanyRequestType() public pure returns(Dropdown memory) {
        Dropdown memory typeData;
        typeData = Dropdown(1, 'CompanyReq');
        return typeData;
    }

    function getDefaultProjectStatus() public pure returns(Dropdown memory) {
        Dropdown memory typeData;
        typeData = Dropdown(0, 'Created');
        return typeData;
    }

    function getDefaultRequestStatus() public pure returns(Dropdown memory) {
        Dropdown memory typeData;
        typeData = Dropdown(0, 'UnApproved');
        return typeData;
    }

    /*** Dropdowns */

    function getRequestTypeDropdown() public pure returns(Dropdown[] memory) {
        Dropdown[] memory data = new Dropdown[](2);
        data[0] = Dropdown(0, 'SupervisorReq');
        data[1] = Dropdown(1, 'CompanyReq');
        return data;
    }

    function getRequestStatusFormDropdown() public pure returns(Dropdown[] memory) {
        Dropdown[] memory data = new Dropdown[](2);
        data[0] = Dropdown(1, 'Rejected');
        data[1] = Dropdown(2, 'Approved');
        return data;
    }

    function getRequestStatusDropdown() public pure returns(Dropdown[] memory) {
        Dropdown[] memory data = new Dropdown[](3);
        data[0] = Dropdown(0, 'UnApproved');
        data[1] = Dropdown(1, 'Rejected');
        data[2] = Dropdown(2, 'Approved');
        return data;
    }

    function getProjectStatusDropdown() public pure returns(Dropdown[] memory) {
        Dropdown[] memory data = new Dropdown[](5);
        data[0] = Dropdown(0, 'Created');
        data[1] = Dropdown(1, 'ToApprove');
        data[2] = Dropdown(2, 'StartProject');
        data[3] = Dropdown(3, 'FinalizationCheck');
        data[4] = Dropdown(4, 'Completed');
        return data;
    }

    function getUserRoleDropdown() public pure returns(Dropdown[] memory) {
        Dropdown[] memory data = new Dropdown[](4);
        data[0] = Dropdown(0, 'DefaultRole');
        data[1] = Dropdown(1, 'UserProject');
        data[2] = Dropdown(2, 'Company');
        data[3] = Dropdown(3, 'Supervisor');
        return data;
    }
}
