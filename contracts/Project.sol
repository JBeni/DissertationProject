// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./User.sol";

contract Project is User {

    address projectInitiator;

    mapping(uint => S_Project) public projects;
    mapping(uint => S_Request) public companyRequests;
    mapping(uint => S_Request) public supervisorRequests;

    uint public projectsCount = 0;
    uint[] public projectIds;
    S_Project[] public allProjects;

    uint indexCompanyRequest;
    uint indexSupervisorRequest;

    struct S_Project {
        uint index;
        string name;
        string description;
        ProjectStatus projectStatus;
        string ipfsFileCID;
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

    //event CreateProject(uint _indexProject, Project.ProjectStatus _projectStatus, address _address);
    event CreateProject(string _name, string _description, ProjectStatus _status);

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

    function createProject(string memory _name, string memory _description, uint _status, string memory _ipfsFileCID) public  {
        //bytes32 _identifier = createUniqueIdentifier(_hashStringValue, msg.sender);

        projects[projectsCount].index = projectsCount;
        //projects[projectsCount].identifier = _identifier;
        projects[projectsCount].name = _name;
        projects[projectsCount].description = _description;
        projects[projectsCount].projectStatus = ProjectStatus(_status);
        projects[projectsCount].ipfsFileCID = _ipfsFileCID;

        emit CreateProject(_name, _description, ProjectStatus(_status));
        projectIds.push(projectsCount);
        allProjects.push(S_Project(projectsCount, _name, _description, ProjectStatus(_status), _ipfsFileCID));
        projectsCount++;
    }

    function getProjectInfo(uint _index)
        external
        view
        returns (S_Project memory)
    {
        return projects[_index];
    }

    function getAllProjects() public view returns(S_Project[] memory) {
        return allProjects;
    }

    function getProjectIds() external view returns (uint[] memory) {
        return projectIds;
    }

    function createUniqueIdentifier(string memory _text, address _addr) public pure returns (bytes32)  {
        return keccak256(abi.encodePacked(_text, _addr));
    }

    function createUniqueHexAddress(string memory _text, address _addr) public pure returns (address)  {
        return address(uint160(uint256(keccak256(abi.encodePacked(_text, _addr)))));
    }

    function requestProjectApprovalFromSupervisor(string memory _description, S_Project memory _project, address _subjectAddress) public {
        require(_project.projectStatus == ProjectStatus.Created, "The project is not created, the operation cannot be done.");

        S_Request storage request = supervisorRequests[indexSupervisorRequest];
        request.description = _description;
        request.status = RequestStatus.Unverified;
        request.project = _project;
        request.subjectAddress = _subjectAddress;

        emit UpdateSupervisorRequestStatus(indexSupervisorRequest, RequestStatus.Unverified, _project, _project.projectStatus, _subjectAddress);
        indexSupervisorRequest++;
    }

    function requestProjectCompleteFromSupervisor(string memory _description, S_Project memory _project, address _subjectAddress) public {
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

    function requestStartProjectToCompanyBuilder(string memory _description, S_Project memory _project, address _subjectAddress) public {
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