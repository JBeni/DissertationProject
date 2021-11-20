// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./ProjectChain.sol";

contract CompanyChain is ProjectChain {

    address _companyAddress;

    event ApproveProjectRequestByCompany(ProjectStatus _status, Project _project, address _subjectAddress);
    event RejectProjectRequestByCompany(string _description, ProjectStatus _status, Project _project, address _subjectAddress);
    event BeforeFinalizationProjectRequestByCompany(ProjectStatus _status, Project _project, address _subjectAddress);

    constructor() {
        _companyAddress = msg.sender;
    }

    modifier onlyCompany {
        require(_companyAddress == msg.sender, "You are not a company builder");
        _;
    }

    // Add some contrainst / verification TOOO DOOO -> LATER

/*
    function setProjectRequestToOnGoingStatus(Project memory _project) public onlyCompany {
        _project._status = ProjectStatus.OnGoing;
        emit ApproveProjectRequestByCompany(ProjectStatus.OnGoing, _project, _companyAddress);
    }

    function setProjectRequestToRejectStatus(string memory _description, Project memory _project) public onlyCompany {
        _project._status = ProjectStatus.Rejected;
        emit RejectProjectRequestByCompany(_description, ProjectStatus.Rejected, _project, _companyAddress);
    }

    function setProjectRequestToBeforeFinalizationStatus(Project memory _project)  public onlyCompany {
        _project._status = ProjectStatus.FinalizationCheck;
        emit BeforeFinalizationProjectRequestByCompany(ProjectStatus.FinalizationCheck, _project, _companyAddress);
    }
*/

}
