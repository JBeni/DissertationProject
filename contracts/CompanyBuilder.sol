// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./Project.sol";

contract CompanyBuilder is Project {

    address _companyAddress;

    event ApproveProjectRequestByCompany(ProjectStatus _status, S_Project _project, address _subjectAddress);
    event RejectProjectRequestByCompany(string _description, ProjectStatus _status, S_Project _project, address _subjectAddress);
    event BeforeFinalizationProjectRequestByCompany(ProjectStatus _status, S_Project _project, address _subjectAddress);

    constructor() {
        _companyAddress = msg.sender;
    }

    modifier onlyCompany {
        require(_companyAddress == msg.sender, "You are not a company builder");
        _;
    }

    // Add some contrainst / verification TOOO DOOO -> LATER

    function setProjectRequestToOnGoingStatus(S_Project memory _project) public onlyCompany {
        _project.projectStatus = ProjectStatus.OnGoing;
        emit ApproveProjectRequestByCompany(ProjectStatus.OnGoing, _project, _companyAddress);
    }

    function setProjectRequestToRejectStatus(string memory _description, S_Project memory _project) public onlyCompany {
        _project.projectStatus = ProjectStatus.Rejected;
        emit RejectProjectRequestByCompany(_description, ProjectStatus.Rejected, _project, _companyAddress);
    }

    function setProjectRequestToBeforeFinalizationStatus(S_Project memory _project)  public onlyCompany {
        _project.projectStatus = ProjectStatus.BeforeFinalizationCheck;
        emit BeforeFinalizationProjectRequestByCompany(ProjectStatus.BeforeFinalizationCheck, _project, _companyAddress);
    }
}
