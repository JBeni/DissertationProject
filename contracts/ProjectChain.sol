// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./UserChain.sol";

//
// Put constraints on the app based on role not address......
//

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

    mapping(address => ProjectRequest) public projectRequests;
    uint public projectRequestsCounter = 0;
    ProjectRequest[] public allProjectRequests;

    event ProjectEvent(
        uint _index,
        string _name,
        string _description,
        ProjectStatus _status,
        string _ipfsFileCID,
        address _projectAddress,
        address _userAddress
    );
    struct Project {
        uint _index;
        string _name;
        string _description;
        ProjectStatus _status;
        string _ipfsFileCID;
        address _projectAddress;
        address _userAddress;
    }

    event ProjectStatusEvent(
        uint _index,
        string _title,
        string _description,
        string _comments,
        ProjectStatus _status,
        RequestStatus _requestStatus,
        address _projectAddress,
        address _userAddress
    );
    struct ProjectRequest {
        uint _index;
        string _title;
        string _description;
        string _comments;
        ProjectStatus _status;
        RequestStatus _requestStatus;
        address _projectAddress;
        address _userAddress;
    }

    enum RequestStatus { UnApproved, Rejected, Approved }
    enum ProjectStatus { Created, Approved, StartProject, FinalizationCheck, Completed }

    modifier onlyProjectInitiator {
        require(users[_projectInitiator]._role == Roles.ProjectInitiator, "You don't have the rights for this resources.");
        require(_projectInitiator == msg.sender, "You are not a project initiator");
        _;
    }

    function createUniqueHexAddress(string memory _text, uint _index) public view returns (address) {
        return address(uint160(uint256(keccak256(abi.encodePacked(_text, _projectInitiator, _index)))));
    }

    function createProject(string memory _name, string memory _description, uint _status, string memory _ipfsFileCID) public {
        address _projectAddress = createUniqueHexAddress(HASH_STRING_VALUE, projectsCounter);

        projects[_projectAddress]._index = projectsCounter;
        projects[_projectAddress]._name = _name;
        projects[_projectAddress]._description = _description;
        projects[_projectAddress]._status = ProjectStatus(_status);
        projects[_projectAddress]._ipfsFileCID = _ipfsFileCID;
        projects[_projectAddress]._projectAddress = _projectAddress;
        projects[_projectAddress]._userAddress = _projectInitiator;

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

    function createProjectRequest(
        string memory _title, string memory _description, uint _status,
        uint _requestStatus, address _projectAddress
    ) public {
        projectRequests[_projectAddress]._index = projectRequestsCounter;
        projectRequests[_projectAddress]._title = _title;
        projectRequests[_projectAddress]._description = _description;
        projectRequests[_projectAddress]._comments = '';
        projectRequests[_projectAddress]._status = ProjectStatus(_status);
        projectRequests[_projectAddress]._requestStatus = RequestStatus(_requestStatus);
        projectRequests[_projectAddress]._projectAddress = _projectAddress;
        projectRequests[_projectAddress]._userAddress = _projectInitiator;

        filterProjectRequests(_title, _description, _status, _requestStatus, _projectAddress);

        emit ProjectStatusEvent(projectRequestsCounter, _title, _description, '', ProjectStatus(_status), RequestStatus(_requestStatus), _projectAddress, _projectInitiator);
        allProjectRequests.push(ProjectRequest(projectRequestsCounter, _title, _description, '', ProjectStatus(_status), RequestStatus(_requestStatus), _projectAddress, _projectInitiator));
        projectRequestsCounter++;
    }

    function getAllProjectRequests() external view returns(ProjectRequest[] memory) {
        return allProjectRequests;
    }

    function filterProjectRequests(
        string memory _title, string memory _description, uint _projectStatus,
        uint _requestStatus, address _projectAddress
    ) internal {
        if (_projectStatus == 1 || _projectStatus == 3 || _projectStatus == 4) {
            createRequestSupervisor(_title, _description, _projectStatus, _requestStatus, _projectAddress);
        } else if (_projectStatus == 2) {
            createRequestCompany(_title, _description, _projectStatus, _requestStatus, _projectAddress);
        }
    }

    /**************** ------------------------- *********************/

    struct Request {
        uint _index;
        string _title;
        string _description;
        RequestStatus _requestStatus;
        ProjectStatus _projectStatus;
        address _projectAddress;
        address _userAddress;
    }
    event RequestEvent(
        uint _index,
        string _title,
        string _description,
        RequestStatus _status,
        ProjectStatus _projectStatus,
        address _projectAddress,
        address _userAddress
    );

    // Supervisor Contract Data
    // They will be filter after the status of the requests
    mapping(uint => Request) public requestsSupervisor;
    uint public requestsSupervisorCounter = 0;
    Request[] public allSupervisorRequests;

    function createRequestSupervisor(
        string memory _title,
        string memory _description,
        uint _requestStatus,
        uint _projectStatus,
        address _projectAddress
    ) public {
        requestsSupervisor[requestsSupervisorCounter]._index = requestsSupervisorCounter;
        requestsSupervisor[requestsSupervisorCounter]._title = _title;
        requestsSupervisor[requestsSupervisorCounter]._description = _description;
        requestsSupervisor[requestsSupervisorCounter]._requestStatus = RequestStatus(_requestStatus);
        requestsSupervisor[requestsSupervisorCounter]._projectStatus = ProjectStatus(_projectStatus);
        requestsSupervisor[requestsSupervisorCounter]._projectAddress = _projectAddress;
        // change to supervisorAddress
        requestsSupervisor[requestsSupervisorCounter]._userAddress = _projectInitiator;

        emit RequestEvent(requestsSupervisorCounter, _title, _description, RequestStatus(_requestStatus), ProjectStatus(_projectStatus), _projectAddress, _projectInitiator);
        allSupervisorRequests.push(Request(requestsSupervisorCounter, _title, _description,  RequestStatus(_requestStatus), ProjectStatus(_projectStatus), _projectAddress, _projectInitiator));
        requestsSupervisorCounter++;
    }

    function updateRequestSupervisor(uint _requestStatus, uint _index) public {
        requestsSupervisor[_index]._requestStatus = RequestStatus(_requestStatus);
        uint index = requestsSupervisor[_index]._index;
        allSupervisorRequests[index]._requestStatus = RequestStatus(_requestStatus);
    }

    function getAllRequestsSupervisor() public view returns(Request[] memory) {
        return allSupervisorRequests;
    }

    // Company Contract Data
    mapping(uint => Request) public requestsCompany;
    uint public requestsCompanyCounter = 0;
    Request[] public allCompanyRequests;

    function createRequestCompany(
        string memory _title,
        string memory _description,
        uint _requestStatus,
        uint _projectStatus,
        address _projectAddress
    ) public {
        requestsCompany[requestsCompanyCounter]._index = requestsCompanyCounter;
        requestsCompany[requestsCompanyCounter]._title = _title;
        requestsCompany[requestsCompanyCounter]._description = _description;
        requestsCompany[requestsCompanyCounter]._requestStatus = RequestStatus(_requestStatus);
        requestsCompany[requestsCompanyCounter]._projectStatus = ProjectStatus(_projectStatus);
        requestsCompany[requestsCompanyCounter]._projectAddress = _projectAddress;
        // change to companyAddress
        requestsCompany[requestsCompanyCounter]._userAddress = _projectInitiator;

        emit RequestEvent(requestsCompanyCounter, _title, _description, RequestStatus(_requestStatus), ProjectStatus(_projectStatus), _projectAddress, _projectInitiator);
        allCompanyRequests.push(Request(requestsCompanyCounter, _title, _description,  RequestStatus(_requestStatus), ProjectStatus(_projectStatus), _projectAddress, _projectInitiator));
        requestsCompanyCounter++;
    }

    function updateRequestCompany(uint _requestStatus, uint _index) public {
        requestsCompany[_index]._requestStatus = RequestStatus(_requestStatus);
        uint index = requestsCompany[_index]._index;
        allCompanyRequests[index]._requestStatus = RequestStatus(_requestStatus);
    }

    function getAllRequestsCompany() public view returns(Request[] memory) {
        return allCompanyRequests;
    }




/*
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
*/

}
