// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./UserChain.sol";
import "./SharedChain.sol";

contract ProjectChain is UserChain, SharedChain {
    bytes32 constant PROJECT_HASH_VALUE = "csd?S@salas;dlA234_D.;s_as";
    bytes32 constant REQUEST_HASH_VALUE = "csd?.!?*salas;dlA.;s_as";

    address _projectInitiator;
    uint _indexUniqueAddress = 0;

    constructor() {
        _projectInitiator = msg.sender;
    }

    modifier onlyProjectInitiator {
        require(users[_projectInitiator]._role == Roles.ProjectInitiator, "You don't have the rights for this resources.");
        require(_projectInitiator == msg.sender, "You are not a project initiator");
        _;
    }


    /**  PROJECT INITIATOR  */

    mapping(address => Project) public projects;
    uint public projectsCounter = 0;
    address[] public projectsAddress;

    function createUniqueProjectAddress(bytes32 _text, uint _index) public view returns (address) {
        return address(uint160(uint256(keccak256(abi.encodePacked(_text, _projectInitiator, _index)))));
    }

    function createProject(bytes32 _name, uint _status, string memory _ipfsFileCID, bytes32 _signature) public {
        address _projectAddress = createUniqueProjectAddress(PROJECT_HASH_VALUE, projectsCounter);

        projects[_projectAddress]._index = projectsCounter;
        projects[_projectAddress]._name = _name;
        projects[_projectAddress]._status = ProjectStatus(_status);
        projects[_projectAddress]._ipfsFileCID = _ipfsFileCID;
        projects[_projectAddress]._projectAddress = _projectAddress;
        projects[_projectAddress]._userAddress = _projectInitiator;
        projects[_projectAddress]._timestamp = block.timestamp;
        projects[_projectAddress]._signature = _signature;

        emit ProjectEvent(
            projectsCounter,
            _name,
            ProjectStatus(_status),
            _ipfsFileCID,
            _projectAddress,
            _projectInitiator,
            block.timestamp,
            _signature
        );
        projectsAddress.push(_projectAddress);
        projectsCounter++;
    }

    function getProjectInfo(address _address) public view returns (Project memory) {
        return projects[_address];
    }

    function getAllProjects() public view returns(address[] memory) {
        return projectsAddress;
    }


    /**  Project Requests  */

    mapping(uint => ProjectRequest) public projectRequests;
    uint public projectRequestsCounter = 0;
    address[] public projectRequestsAddress;

    function createUniqueProjectRequestAddress() public returns (address) {
        _indexUniqueAddress++;
        return address(uint160(uint256(keccak256(abi.encodePacked(REQUEST_HASH_VALUE, _projectInitiator, _indexUniqueAddress)))));
    }

    function createProjectRequest(
        bytes32 _title, uint _status, uint _requestStatus,
        address _projectAddress, address _projectReqAddress, bytes32 _signature
    ) public {
        projectRequests[projectRequestsCounter]._index = projectRequestsCounter;
        projectRequests[projectRequestsCounter]._title = _title;
        projectRequests[projectRequestsCounter]._comments = '';
        projectRequests[projectRequestsCounter]._status = ProjectStatus(_status);
        projectRequests[projectRequestsCounter]._requestStatus = RequestStatus(_requestStatus);
        projectRequests[projectRequestsCounter]._projectAddress = _projectAddress;
        projectRequests[projectRequestsCounter]._userAddress = _projectInitiator;
        projectRequests[projectRequestsCounter]._requestAddress = _projectReqAddress;
        projectRequests[projectRequestsCounter]._timestamp = block.timestamp;
        projectRequests[projectRequestsCounter]._signature = _signature;

        filterRequests(projectRequestsCounter, _title, _requestStatus, _status, _projectAddress, _projectReqAddress);

        emit ProjectRequestEvent(
            projectRequestsCounter,
            _title,
            '',
            ProjectStatus(_status),
            RequestStatus(_requestStatus),
            _projectAddress,
            _projectInitiator,
            _projectReqAddress,
            block.timestamp,
            _signature
        );
        projectRequestsAddress.push(_projectReqAddress);
        projectRequestsCounter++;
    }

    function filterRequests(
        uint _indexProjectRequest,
        bytes32 _title,
        uint _requestStatus,
        uint _projectStatus,
        address _projectAddress,
        address _requestAddress
    ) internal {
        RequestType _requestType;
        if (
            ProjectStatus(_projectStatus) == ProjectStatus.ToApprove ||
            ProjectStatus(_projectStatus) == ProjectStatus.FinalizationCheck ||
            ProjectStatus(_projectStatus) == ProjectStatus.Completed
        ) {
            _requestType = RequestType.SupervisorReq;
        } else if (ProjectStatus(_projectStatus) == ProjectStatus.StartProject) {
            _requestType = RequestType.CompanyReq;
        }
        createRequest(_indexProjectRequest, _title, _requestStatus, _projectStatus, _requestType, _projectAddress, _requestAddress);
    }

    function getAllProjectRequests() external view returns(address[] memory) {
        return projectRequestsAddress;
    }
/*
    function getLastProjectRequest(address _projectAddress) external view returns(ProjectRequest memory) {
        ProjectRequest memory request;
        if (projectRequestsCounter > 0) {
            for (uint index = projectRequestsCounter - 1; index >= 0; index--) {
                if (_projectAddress == projectRequests[index]._projectAddress) {
                    request._index = projectRequests[index]._index;
                    request._title = projectRequests[index]._title;
                    request._comments = projectRequests[index]._comments;
                    request._status = projectRequests[index]._status;
                    request._requestStatus = projectRequests[index]._requestStatus;
                    request._projectAddress = projectRequests[index]._projectAddress;
                    request._userAddress = projectRequests[index]._userAddress;
                    request._requestAddress = projectRequests[index]._requestAddress;
                    request._timestamp = block.timestamp;
                    return request;
                }
            }
        }
        return request;
    }
*/


    /**  DATA FOR SUPERVISOR && COMPANY  */

    mapping(uint => Request) public requests;
    uint public requestsCounter = 0;
    address[] public allRequests;

    function createRequest(
        uint _indexProjectRequest,
        bytes32 _title,
        uint _requestStatus,
        uint _projectStatus,
        RequestType _requestType,
        address _projectAddress,
        address _requestAddress
    ) internal {
        requests[requestsCounter]._index = requestsCounter;
        requests[requestsCounter]._indexProjectRequest = _indexProjectRequest;
        requests[requestsCounter]._title = _title;
        requests[requestsCounter]._requestStatus = RequestStatus(_requestStatus);
        requests[requestsCounter]._projectStatus = ProjectStatus(_projectStatus);
        requests[requestsCounter]._requestType = _requestType;
        requests[requestsCounter]._projectAddress = _projectAddress;
        // change to supervisorAddress
        requests[requestsCounter]._userAddress = _projectInitiator;
        requests[requestsCounter]._requestAddress = _requestAddress;
        requests[requestsCounter]._timestamp = block.timestamp;
        requests[requestsCounter]._signature = '';

        emit RequestEvent(
            requestsCounter,
            _indexProjectRequest,
            _title,
            RequestStatus(_requestStatus),
            ProjectStatus(_projectStatus),
            _requestType, _projectAddress,
            _projectInitiator,
            _requestAddress,
            block.timestamp,
            ''
        );
        allRequests.push(_requestAddress);
        requestsCounter++;
    }

    function updateRequest(
        uint _index,
        string memory _comments,
        uint _requestStatus,
        uint _indexProjectRequest,
        uint _projectStatus,
        address _projectAddress,
        bytes32 _signature
    ) public {
        // Update request status in the Requests Mapping and Struct Array
        requests[_index]._requestStatus = RequestStatus(_requestStatus);
        requests[_index]._signature = _signature;

        uint index = requests[_index]._index;
        //allRequests[index]._requestStatus = RequestStatus(_requestStatus);
        //allRequests[index]._signature = _signature;

        // Update project request status in the Project Requests Mapping and Struct Array
        projectRequests[_indexProjectRequest]._comments = _comments;
        projectRequests[_indexProjectRequest]._requestStatus = RequestStatus(_requestStatus);

        // Update ProjectStatus to the requested status - Porject Mapping and Struct Array
        projects[_projectAddress]._status = ProjectStatus(_projectStatus);
    }

    // function getAllRequests() public view returns(Request[] memory) {
    //     return allRequests;
    // }
}
