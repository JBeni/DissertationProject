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

    struct Project {
        uint _index;
        string _name;
        string _description;
        ProjectStatus _status;
        string _ipfsFileCID;
        address _address;
    }

    event CreateProject(uint _index, string _name, string _description, ProjectStatus _status, string _ipfsFileCID, address _address);


    enum ProjectRequestStatus { Unverified, Verified }
    enum RequestStatus { Unverified, Verified }
    enum ProjectStatus { Created, Approved, Rejected, OnGoing, FinalizationCheck, Completed }

    //event ProjectStatusChanged(uint256 index, ProjectStatus indexed status, address indexed projectAddress);
    //event CreateProject(uint _indexProject, Project.ProjectStatus _projectStatus, address _address);

    modifier onlyProjectInitiator {
        require(userInfo[_projectInitiator].role == Roles.ProjectInitiator, "You don't have the rights for this resources.");
        require(_projectInitiator == msg.sender, "You are not a project initiator");
        _;
    }

    function createProject(string memory _name, string memory _description, uint _status, string memory _ipfsFileCID) public  {
        address _projectAddress = createUniqueHexAddress(HASH_STRING_VALUE, _projectInitiator);

        projects[_projectAddress]._index = projectsCounter;
        projects[_projectAddress]._name = _name;
        projects[_projectAddress]._description = _description;
        projects[_projectAddress]._status = ProjectStatus(_status);
        projects[_projectAddress]._ipfsFileCID = _ipfsFileCID;
        projects[_projectAddress]._address = _projectAddress;

        emit CreateProject(projectsCounter, _name, _description, ProjectStatus(_status), _ipfsFileCID, _projectAddress);
        allProjects.push(Project(projectsCounter, _name, _description, ProjectStatus(_status), _ipfsFileCID, _projectAddress));
        projectsCounter++;
    }

    function getProjectInfo(address _address) external view returns (Project memory) {
        return projects[_address];
    }

    function getAllProjects() public view returns(Project[] memory) {
        return allProjects;
    }

    function createUniqueIdentifier(string memory _text, address _addr) public pure returns (bytes32)  {
        return keccak256(abi.encodePacked(_text, _addr));
    }

    function createUniqueHexAddress(string memory _text, address _addr) public view returns (address)  {
        return address(uint160(uint256(keccak256(abi.encodePacked(_text, _addr, block.timestamp)))));
    }



    // function changeProjectStatus(uint _status, address _address) public {
    //     projectsStatus[statusChangedIndex]._index = statusChangedIndex;
    //     projectsStatus[statusChangedIndex]._status = ProjectStatus(_status);
    //     projectsStatus[statusChangedIndex]._address = _address;
    //     emit ProjectStatusChanged(statusChangedIndex, ProjectStatus(_status), _address);
    //     statusChangedIndex++;
    // }


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