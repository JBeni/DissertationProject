// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./UserChain.sol";

contract ProjectChain is UserChain {
    string constant HASH_STRING_VALUE = "csd?S@salas;dlA234_D.;s_as";
    address _projectInitiator;

    constructor() {
        _projectInitiator = msg.sender;
    }

    // Project Contract Data
    mapping(address => Project) public projects;
    uint public projectsCounter = 0;
    Project[] public allProjects;

    event ProjectEvent(
        uint _index,
        string _name,
        string _description,
        ProjectStatus _status,
        string _ipfsFileCID,
        address _projectAddress,
        address _projectInitiator
    );
    struct Project {
        uint _index;
        string _name;
        string _description;
        ProjectStatus _status;
        string _ipfsFileCID;
        address _projectAddress;
        address _projectInitiator;
    }

    event ProjectStatusEvent(
        uint _index,
        string _name,
        string _description,
        string _comments,
        ProjectStatus _status,
        ProjectRequestStatus _requestStatus,
        string _ipfsFileCID,
        address _projectAddress,
        address _projectInitiator,
        string signature
    );
    struct ProjectRequest {
        uint _index;
        string _name;
        string _description;
        string _comments;
        ProjectStatus _status;
        ProjectRequestStatus _requestStatus;
        string _ipfsFileCID;
        address _projectAddress;
        address _projectInitiator;
        string signature;
    }

    enum ProjectRequestStatus { UnApproved, Rejected, Approved }
    enum ProjectStatus { Created, Approved, Rejected, OnGoing, FinalizationCheck, Completed }

    modifier onlyProjectInitiator {
        require(users[_projectInitiator]._role == Roles.ProjectInitiator, "You don't have the rights for this resources.");
        require(_projectInitiator == msg.sender, "You are not a project initiator");
        _;
    }

    function createProject(string memory _name, string memory _description, uint _status, string memory _ipfsFileCID) public  {
        address _projectAddress = createUniqueHexAddress(HASH_STRING_VALUE);

        projects[_projectAddress]._index = projectsCounter;
        projects[_projectAddress]._name = _name;
        projects[_projectAddress]._description = _description;
        projects[_projectAddress]._status = ProjectStatus(_status);
        projects[_projectAddress]._ipfsFileCID = _ipfsFileCID;
        projects[_projectAddress]._projectAddress = _projectAddress;
        projects[_projectAddress]._projectInitiator = _projectInitiator;

        emit ProjectEvent(projectsCounter, _name, _description, ProjectStatus(_status), _ipfsFileCID, _projectAddress, _projectInitiator);
        allProjects.push(Project(projectsCounter, _name, _description, ProjectStatus(_status), _ipfsFileCID, _projectAddress, _projectInitiator));
        projectsCounter++;
    }

    function getProjectInfo(address _address) external view returns (Project memory) {
        return projects[_address];
    }

    function getAllProjects() public view returns(Project[] memory) {
        return allProjects;
    }

    function createUniqueHexAddress(string memory _text) public view returns (address) {
        return address(uint160(uint256(keccak256(abi.encodePacked(_text, _projectInitiator, block.timestamp)))));
    }


    // function changeProjectStatus(uint _status, address _address) public {
    //     projectsStatus[statusChangedIndex]._index = statusChangedIndex;
    //     projectsStatus[statusChangedIndex]._status = ProjectStatus(_status);
    //     projectsStatus[statusChangedIndex]._address = _address;
    //     emit ProjectStatusChanged(statusChangedIndex, ProjectStatus(_status), _address);
    //     statusChangedIndex++;
    // }







    enum RequestStatus { Unverified, Verified }
    struct Request {
        uint index;
        string description;
        RequestStatus status;
        Project project;
        address subjectAddress;
    }

    mapping(uint => Request) public companyRequests;
    mapping(uint => Request) public supervisorRequests;

    //uint public projectsCount = 0;
    //uint[] public projectIds;


    uint indexCompanyRequest;
    uint indexSupervisorRequest;

    event UpdateSupervisorRequestStatus(uint _indexRequest, RequestStatus _status, Project _project, ProjectStatus _projectStatus, address _subjectAddress);
    event UpdateCompanyRequestStatus(uint _indexRequest, RequestStatus _status, Project _project, ProjectStatus _projectStatus, address _subjectAddress);


    function requestProjectApprovalFromSupervisor(string memory _description, Project memory _project, address _subjectAddress) public {
        require(_project._status == ProjectStatus.Created, "The project is not created, the operation cannot be done.");

        Request storage request = supervisorRequests[indexSupervisorRequest];
        request.description = _description;
        request.status = RequestStatus.Unverified;
        request.project = _project;
        request.subjectAddress = _subjectAddress;

        emit UpdateSupervisorRequestStatus(indexSupervisorRequest, RequestStatus.Unverified, _project, _project._status, _subjectAddress);
        indexSupervisorRequest++;
    }

    function requestProjectCompleteFromSupervisor(string memory _description, Project memory _project, address _subjectAddress) public {
        require(
            _project._status == ProjectStatus.FinalizationCheck,
            "The project is not in the 'BeforeFinalizationCheck' status, the operation cannot be done."
        );

        Request storage request = supervisorRequests[indexSupervisorRequest];
        request.description = _description;
        request.status = RequestStatus.Unverified;
        request.project = _project;
        request.subjectAddress = _subjectAddress;

        emit UpdateSupervisorRequestStatus(indexSupervisorRequest, RequestStatus.Unverified, _project, _project._status, _subjectAddress);
        indexSupervisorRequest++;
    }

    function requestStartProjectToCompanyBuilder(string memory _description, Project memory _project, address _subjectAddress) public {
        require(_project._status == ProjectStatus.Approved, "The project is not approved, the operation cannot be done.");

        Request storage request = companyRequests[indexCompanyRequest];
        request.description = _description;
        request.status = RequestStatus.Unverified;
        request.project = _project;
        request.subjectAddress = _subjectAddress;

        emit UpdateCompanyRequestStatus(indexCompanyRequest, RequestStatus.Unverified, _project, _project._status, _subjectAddress);
        indexCompanyRequest++;
    }
}