// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./ProjectChain.sol";

contract Supervisor is ProjectChain {

    address _supervisorAddress;

    event ApproveProjectRequestBySupervisor(ProjectStatus _status, Project _project, address _subjectAddress);
    event RejectProjectRequestBySupervisor(string _description, ProjectStatus _status, Project _project, address _subjectAddress);
    event CompleteProjectRequestBySupervisor(ProjectStatus _status, Project _project, address _subjectAddress);

    constructor() {
        _supervisorAddress = msg.sender;
    }

    modifier onlySupervisor {
        require(_supervisorAddress == msg.sender, "You are not a supervisor");
        _;
    }

    // Add some contrainst / verification TOOO DOOO -> LATER

/*
    function setProjectRequestToApprovedStatus(Project memory _project) public onlySupervisor {
        _project._status = ProjectStatus.Approved;
        emit ApproveProjectRequestBySupervisor(ProjectStatus.Approved, _project, _supervisorAddress);
    }

    function setProjectRequestToRejectStatus(string memory _description, Project memory _project) public onlySupervisor {
        _project._status = ProjectStatus.Rejected;
        emit RejectProjectRequestBySupervisor(_description, ProjectStatus.Approved, _project, _supervisorAddress);
    }

    function setProjectRequestToCompletedStatus(Project memory _project)  public onlySupervisor {
        _project._status = ProjectStatus.Completed;
        emit CompleteProjectRequestBySupervisor(ProjectStatus.Completed, _project, _supervisorAddress);
    }
*/
}
