// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./UserChain.sol";
import "./CompanyChain.sol";
import "./SupervisorChain.sol";

import "./SharedChain.sol";

// Put constraints on the app based on role not address......

contract ProjectChain is UserChain, SharedChain {
    string constant HASH_bytes32_VALUE = "csd?S@salas;dlA234_D.;s_as";
    address _projectInitiator;

    // Project Contract Data
    mapping(address => Project) public projects;
    uint public projectsCounter = 0;
    Project[] public allProjects;

    mapping(address => ProjectRequest) public projectRequests;
    uint public projectRequestsCounter = 0;
    ProjectRequest[] public allProjectRequests;

    constructor() {
        _projectInitiator = msg.sender;
    }

    modifier onlyProjectInitiator {
        require(users[_projectInitiator]._role == Roles.ProjectInitiator, "You don't have the rights for this resources.");
        require(_projectInitiator == msg.sender, "You are not a project initiator");
        _;
    }

    function createUniqueHexAddress(string memory _text, uint _index) public view returns (address) {
        return address(uint160(uint256(keccak256(abi.encodePacked(_text, _projectInitiator, _index)))));
    }

    function createProject(bytes32 _name, uint _status, string memory _ipfsFileCID) public {
        address _projectAddress = createUniqueHexAddress(HASH_bytes32_VALUE, projectsCounter);

        projects[_projectAddress]._index = projectsCounter;
        projects[_projectAddress]._name = _name;
        projects[_projectAddress]._status = ProjectStatus(_status);
        projects[_projectAddress]._ipfsFileCID = _ipfsFileCID;
        projects[_projectAddress]._projectAddress = _projectAddress;
        projects[_projectAddress]._userAddress = _projectInitiator;

        emit ProjectEvent(projectsCounter, _name, ProjectStatus(_status), _ipfsFileCID, _projectAddress, _projectInitiator, block.timestamp);
        allProjects.push(Project(projectsCounter, _name, ProjectStatus(_status), _ipfsFileCID, _projectAddress, _projectInitiator));
        projectsCounter++;
    }

    function getProjectInfo(address _address) public view returns (Project memory) {
        return projects[_address];
    }

    function getAllProjects() public view returns(Project[] memory) {
        return allProjects;
    }

    function createProjectRequest(
        bytes32 _title, uint _status,
        uint _requestStatus, address _projectAddress
    ) public {
        projectRequests[_projectAddress]._index = projectRequestsCounter;
        projectRequests[_projectAddress]._title = _title;
        projectRequests[_projectAddress]._comments = '';
        projectRequests[_projectAddress]._status = ProjectStatus(_status);
        projectRequests[_projectAddress]._requestStatus = RequestStatus(_requestStatus);
        projectRequests[_projectAddress]._projectAddress = _projectAddress;
        projectRequests[_projectAddress]._userAddress = _projectInitiator;

        createRequest(_title, _status, _requestStatus, _projectAddress);

        emit ProjectRequestEvent(projectRequestsCounter, _title, '', ProjectStatus(_status), RequestStatus(_requestStatus), _projectAddress, _projectInitiator, block.timestamp);
        allProjectRequests.push(ProjectRequest(projectRequestsCounter, _title, '', ProjectStatus(_status), RequestStatus(_requestStatus), _projectAddress, _projectInitiator));
        projectRequestsCounter++;
    }

    function getAllProjectRequests() external view returns(ProjectRequest[] memory) {
        return allProjectRequests;
    }

    // They will be filter after the status of the requests
    mapping(uint => Request) public requests;
    uint public requestsCounter = 0;
    Request[] public allRequests;

    function createRequest(
        bytes32 _title,
        uint _requestStatus,
        uint _projectStatus,
        address _projectAddress
    ) public {
        requests[requestsCounter]._index = requestsCounter;
        requests[requestsCounter]._title = _title;
        requests[requestsCounter]._requestStatus = RequestStatus(_requestStatus);
        requests[requestsCounter]._projectStatus = ProjectStatus(_projectStatus);
        requests[requestsCounter]._projectAddress = _projectAddress;
        // change to supervisorAddress
        requests[requestsCounter]._userAddress = _projectInitiator;

        emit RequestEvent(requestsCounter, _title, RequestStatus(_requestStatus), ProjectStatus(_projectStatus), _projectAddress, _projectInitiator, block.timestamp);
        allRequests.push(Request(requestsCounter, _title,  RequestStatus(_requestStatus), ProjectStatus(_projectStatus), _projectAddress, _projectInitiator));
        requestsCounter++;
    }

    function updateRequest(uint _requestStatus, uint _index) public {
        requests[_index]._requestStatus = RequestStatus(_requestStatus);
        uint index = requests[_index]._index;
        allRequests[index]._requestStatus = RequestStatus(_requestStatus);
    }

    function getAllRequests() public view returns(Request[] memory) {
        return allRequests;
    }

}
