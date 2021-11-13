// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./User.sol";

contract Project is User {

    address projectInitiator;

    mapping(uint => S_Project) public projects;
    mapping(uint => S_Request) public companyRequests;
    mapping(uint => S_Request) public supervisorRequests;

    uint indexProject;
    uint indexCompanyRequest;
    uint indexSupervisorRequest;

    struct S_Project {
        uint index;
        bytes32 identifier;
        string description;
        ProjectStatus projectStatus;
    }

    struct S_Request {
        uint index;
        string description;
        RequestStatus status;
        S_Project project;
        address subjectAddress;
    }

    enum RequestStatus { Unverified, Verified }
    enum ProjectStatus { Created, Approved, Rejected, OnGoing, BeforeFinalizationCheck, Completed }

    event CreateProject(uint _indexProject, Project.ProjectStatus _projectStatus, address _address);
    event UpdateSupervisorRequestStatus(uint _indexRequest, RequestStatus _status, S_Project _project, ProjectStatus _projectStatus, address _subjectAddress);
    event UpdateCompanyRequestStatus(uint _indexRequest, RequestStatus _status, S_Project _project, ProjectStatus _projectStatus, address _subjectAddress);

    constructor() {
        projectInitiator = msg.sender;
    }

    modifier onlyProjectInitiator {
        require(userInfo[projectInitiator].role == Roles.ProjectInitiator, "You don't have the rights for this resources.");
        require(projectInitiator == msg.sender, "You are not a project initiator");
        _;
    }

    function createProject(uint _index, string memory _description, ProjectStatus _status, string memory _hashStringValue) public onlyProjectInitiator {
        bytes32 _identifier = createUniqueIdentifier(_hashStringValue, address(0));

        projects[indexProject].index = _index;
        projects[indexProject].identifier = _identifier;
        projects[indexProject].description = _description;
        projects[indexProject].projectStatus = _status;
        emit CreateProject(indexProject, ProjectStatus.Created, address(0));
        indexProject++;
    }

    function createUniqueIdentifier(string memory _text, address _addr) public pure returns (bytes32)  {
        return keccak256(abi.encodePacked(_text, _addr));
    }

    function requestProjectApprovalFromSupervisor(string memory _description, S_Project memory _project, address _subjectAddress) public onlyProjectInitiator {
        require(_project.projectStatus == ProjectStatus.Created, "The project is not created, the operation cannot be done.");

        S_Request storage request = supervisorRequests[indexSupervisorRequest];
        request.description = _description;
        request.status = RequestStatus.Unverified;
        request.project = _project;
        request.subjectAddress = _subjectAddress;

        emit UpdateSupervisorRequestStatus(indexSupervisorRequest, RequestStatus.Unverified, _project, _project.projectStatus, _subjectAddress);
        indexSupervisorRequest++;
    }

    function requestProjectCompleteFromSupervisor(string memory _description, S_Project memory _project, address _subjectAddress) public onlyProjectInitiator {
        require(
            _project.projectStatus == ProjectStatus.BeforeFinalizationCheck,
            "The project is not in the 'BeforeFinalizationCheck' status, the operation cannot be done."
        );

        S_Request storage request = supervisorRequests[indexSupervisorRequest];
        request.description = _description;
        request.status = RequestStatus.Unverified;
        request.project = _project;
        request.subjectAddress = _subjectAddress;

        emit UpdateSupervisorRequestStatus(indexSupervisorRequest, RequestStatus.Unverified, _project, _project.projectStatus, _subjectAddress);
        indexSupervisorRequest++;
    }

    function requestStartProjectToCompanyBuilder(string memory _description, S_Project memory _project, address _subjectAddress) public onlyProjectInitiator {
        require(_project.projectStatus == ProjectStatus.Approved, "The project is not approved, the operation cannot be done.");

        S_Request storage request = companyRequests[indexCompanyRequest];
        request.description = _description;
        request.status = RequestStatus.Unverified;
        request.project = _project;
        request.subjectAddress = _subjectAddress;

        emit UpdateCompanyRequestStatus(indexCompanyRequest, RequestStatus.Unverified, _project, _project.projectStatus, _subjectAddress);
        indexCompanyRequest++;
    }
}