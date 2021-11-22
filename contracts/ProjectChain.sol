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

    mapping(uint => ProjectRequest) public projectRequests;
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

        emit ProjectEvent(
            projectsCounter,
            _name,
            ProjectStatus(_status),
            _ipfsFileCID,
            _projectAddress,
            _projectInitiator,
            block.timestamp
        );
        allProjects.push(Project(
            projectsCounter, _name, ProjectStatus(_status),
            _ipfsFileCID, _projectAddress, _projectInitiator
        ));
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
        projectRequests[projectRequestsCounter]._index = projectRequestsCounter;
        projectRequests[projectRequestsCounter]._title = _title;
        projectRequests[projectRequestsCounter]._comments = '';
        projectRequests[projectRequestsCounter]._status = ProjectStatus(_status);
        projectRequests[projectRequestsCounter]._requestStatus = RequestStatus(_requestStatus);
        projectRequests[projectRequestsCounter]._projectAddress = _projectAddress;
        projectRequests[projectRequestsCounter]._userAddress = _projectInitiator;

        filterRequests(projectRequestsCounter, _title, _requestStatus, _status, _projectAddress);

        emit ProjectRequestEvent(
            projectRequestsCounter,
            _title,
            '',
            ProjectStatus(_status),
            RequestStatus(_requestStatus),
            _projectAddress,
            _projectInitiator,
            block.timestamp
        );
        allProjectRequests.push(ProjectRequest(
            projectRequestsCounter, _title, '', ProjectStatus(_status),
            RequestStatus(_requestStatus), _projectAddress, _projectInitiator
        ));
        projectRequestsCounter++;
    }

    function filterRequests(
        uint _indexProjectRequest,
        bytes32 _title,
        uint _requestStatus,
        uint _projectStatus,
        address _projectAddress
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
        createRequest(_indexProjectRequest, _title, _requestStatus, _projectStatus, _requestType, _projectAddress);
    }

    function getAllProjectRequests() external view returns(ProjectRequest[] memory) {
        return allProjectRequests;
    }

    function getLastProjectRequest(address _projectAddress) external view returns(ProjectRequest memory) {
        ProjectRequest memory request;
        if (allProjectRequests.length > 0) {
            for (uint index = allProjectRequests.length - 1; index >= 0; index--) {
                if (_projectAddress == allProjectRequests[index]._projectAddress) {
                    request._index = allProjectRequests[index]._index;
                    request._title = allProjectRequests[index]._title;
                    request._comments = allProjectRequests[index]._comments;
                    request._status = allProjectRequests[index]._status;
                    request._requestStatus = allProjectRequests[index]._requestStatus;
                    request._projectAddress = allProjectRequests[index]._projectAddress;
                    request._userAddress = allProjectRequests[index]._userAddress;
                    return request;
                }
            }
        }
        return request;
    }

    function getLastProjectRequestWorked() external view returns(ProjectRequest memory) {
        //ProjectRequest memory request = allProjectRequests[0];
        //for (uint index = allProjectRequests.length - 1; index > 0; index--) {
        //}
        return allProjectRequests[0];
    }



    // They will be filter after the status of the requests
    mapping(uint => Request) public requests;
    uint public requestsCounter = 0;
    Request[] public allRequests;

    function createRequest(
        uint _indexProjectRequest,
        bytes32 _title,
        uint _requestStatus,
        uint _projectStatus,
        RequestType _requestType,
        address _projectAddress
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

        emit RequestEvent(
            requestsCounter,
            _indexProjectRequest,
            _title,
            RequestStatus(_requestStatus),
            ProjectStatus(_projectStatus),
            _requestType, _projectAddress,
            _projectInitiator,
            block.timestamp
        );
        allRequests.push(Request(
            requestsCounter, _indexProjectRequest, _title,  RequestStatus(_requestStatus),
            ProjectStatus(_projectStatus),  _requestType, _projectAddress, _projectInitiator
        ));
        requestsCounter++;
    }

    function updateRequest(
        uint _index,
        string memory _comments,
        uint _requestStatus,
        uint _indexProjectRequest,
        uint _projectStatus,
        address _projectAddress
    ) public {
        // Update request status in the Requests Mapping and Struct Array
        requests[_index]._requestStatus = RequestStatus(_requestStatus);
        uint index = requests[_index]._index;
        allRequests[index]._requestStatus = RequestStatus(_requestStatus);

        // Update project request status in the Project Requests Mapping and Struct Array
        projectRequests[_indexProjectRequest]._comments = _comments;
        projectRequests[_indexProjectRequest]._requestStatus = RequestStatus(_requestStatus);
        uint indexProjectReq = projectRequests[_indexProjectRequest]._index;
        allProjectRequests[indexProjectReq]._comments = _comments;
        allProjectRequests[indexProjectReq]._requestStatus = RequestStatus(_requestStatus);

        // Update ProjectStatus to the requested status - Porject Mapping and Struct Array
        projects[_projectAddress]._status = ProjectStatus(_projectStatus);
        uint indexProject = projects[_projectAddress]._index;
        allProjects[indexProject]._status = ProjectStatus(_projectStatus);
    }

    function getAllRequests() public view returns(Request[] memory) {
        return allRequests;
    }
}
