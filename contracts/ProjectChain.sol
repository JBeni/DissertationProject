// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./UserChain.sol";
import "./SharedChain.sol";

contract ProjectChain is UserChain {
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

    function createUniqueProjectAddress() public returns (address) {
        _indexUniqueAddress++;
        return address(uint160(uint256(keccak256(abi.encodePacked(PROJECT_HASH_VALUE, _projectInitiator, _indexUniqueAddress)))));
    }

    function createProject(address _projectAddress, bytes32 _name, uint _status, string memory _ipfsFileCID, string memory _signature) public {
        projects[_projectAddress] = Project(
            projectsCounter, _name, ProjectStatus(_status),
            _ipfsFileCID, _projectAddress,
            _projectInitiator, block.timestamp, _signature
        );

        emit ProjectEvent(
            projectsCounter, _name, ProjectStatus(_status),
            _ipfsFileCID, _projectAddress, _projectInitiator,
            block.timestamp, _signature
        );
        projectsAddress.push(_projectAddress);
        projectsCounter++;
    }

    function getProjectInfo(address _address) public view returns (Project memory) {
        return projects[_address];
    }

    function getAllProjects() public view returns(Project[] memory) {
        Project[] memory allProjects = new Project[](projectsCounter);
        for (uint index = 0; index < projectsCounter; index++) {
            address _projectAddress = projectsAddress[index];
            Project storage project = projects[_projectAddress];
            allProjects[index] = project;
        }
        return allProjects;
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
        address _projectAddress, address _projectReqAddress, string memory _signature
    ) public {
        projectRequests[projectRequestsCounter] = ProjectRequest(
            projectRequestsCounter, _title, '', ProjectStatus(_status),
            RequestStatus(_requestStatus), _projectAddress,
            _projectInitiator, _projectReqAddress, block.timestamp, _signature
        );

        filterRequests(projectRequestsCounter, _title, _requestStatus, _status, _projectAddress, _projectReqAddress);

        emit ProjectRequestEvent(
            projectRequestsCounter, _title, '',
            ProjectStatus(_status), RequestStatus(_requestStatus),
            _projectAddress, _projectInitiator,
            _projectReqAddress, block.timestamp, _signature
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

    function getAllProjectRequests() public view returns(ProjectRequest[] memory) {
        ProjectRequest[] memory allProjectRequests = new ProjectRequest[](projectRequestsCounter);
        for (uint index = 0; index < projectsCounter; index++) {
            ProjectRequest storage projectReq = projectRequests[index];
            allProjectRequests[index] = projectReq;
        }
        return allProjectRequests;
    }

    function getLastProjectRequest(address _projectAddress) public view returns(ProjectRequest memory) {
        ProjectRequest memory request;
        if (projectRequestsCounter > 0) {
            for (uint index = projectRequestsCounter - 1; index >= 0; index--) {
                if (_projectAddress == projectRequests[index]._projectAddress) {
                    request = ProjectRequest(
                        projectRequests[index]._index,
                        projectRequests[index]._title,
                        projectRequests[index]._comments,
                        projectRequests[index]._status,
                        projectRequests[index]._requestStatus,
                        projectRequests[index]._projectAddress,
                        projectRequests[index]._userAddress,
                        projectRequests[index]._requestAddress,
                        block.timestamp,
                        projectRequests[index]._signature
                    );
                    return request;
                }
            }
        }
        return request;
    }


    /**  DATA FOR SUPERVISOR && COMPANY  */

    mapping(uint => Request) public requests;
    uint public requestsCounter = 0;
    address[] public requestsAddress;

    function createRequest(
        uint _indexProjectRequest,
        bytes32 _title,
        uint _requestStatus,
        uint _projectStatus,
        RequestType _requestType,
        address _projectAddress,
        address _requestAddress
    ) internal {
        requests[requestsCounter] = Request(
            requestsCounter, _indexProjectRequest, _title,
            RequestStatus(_requestStatus), ProjectStatus(_projectStatus),
            _requestType, _projectAddress, _projectInitiator,
            _requestAddress, block.timestamp, ''
        );

        emit RequestEvent(
            requestsCounter, _indexProjectRequest, _title,
            RequestStatus(_requestStatus), ProjectStatus(_projectStatus),
            _requestType, _projectAddress, _projectInitiator,
            _requestAddress, block.timestamp, ''
        );
        requestsAddress.push(_requestAddress);
        requestsCounter++;
    }

    function updateRequest(
        uint _index,
        uint _indexProjectRequest,
        string memory _comments,
        uint _requestStatus,
        uint _projectStatus,
        address _projectAddress,
        string memory _signature
    ) public {
        // Update request status in the Requests Mapping and Struct Array
        requests[_index]._requestStatus = RequestStatus(_requestStatus);
        requests[_index]._signature = _signature;

        //uint index = requests[_index]._index;
        //allRequests[index]._requestStatus = RequestStatus(_requestStatus);
        //allRequests[index]._signature = _signature;

        // Update project request status in the Project Requests Mapping and Struct Array
        projectRequests[_indexProjectRequest]._comments = _comments;
        projectRequests[_indexProjectRequest]._requestStatus = RequestStatus(_requestStatus);

        // Update ProjectStatus to the requested status - Porject Mapping and Struct Array
        projects[_projectAddress]._status = ProjectStatus(_projectStatus);


        // !!!!! OBSERVATION
        //emit changes for both project request mapping and request mapping
    }

    function getAllRequests() public view returns(Request[] memory) {
        Request[] memory allRequests = new Request[](requestsCounter);
        for (uint index = 0; index < requestsCounter; index++) {
            Request storage request = requests[index];
            allRequests[index] = request;
        }
        return allRequests;
    }
}
