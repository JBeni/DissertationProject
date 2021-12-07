// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./UserChain.sol";
import "./SharedChain.sol";

contract ProjectChain is UserChain {
    address _projectInitiator;

    constructor() {
        _projectInitiator = msg.sender;
    }

    modifier onlyProjectInitiator() {
        require(
            users[_projectInitiator]._role == Roles.ProjectInitiator,
            "You don't have the rights for this resources."
        );
        _;
    }

    /**  PROJECT INITIATOR  */

    mapping(address => Project) public projects;
    uint256 public projectsCounter = 0;
    address[] public projectsAddress;

    function createUniqueProjectAddress(string memory _name, uint _index) public view returns (address) {
        return address(uint160(uint256(keccak256(abi.encodePacked(_name,_projectInitiator,_index)))));
    }

    function createProject(
        address _projectAddress,
        string memory _name,
        uint256 _status,
        string memory _ipfsFileCID,
        string memory _signature
    ) public {
        projects[_projectAddress] = Project(
            projectsCounter,
            _name,
            ProjectStatus(_status),
            _ipfsFileCID,
            _projectAddress,
            _projectInitiator,
            block.timestamp,
            _signature
        );

        emit ProjectEvent(projects[_projectAddress], _projectAddress);
        projectsAddress.push(_projectAddress);
        projectsCounter++;
    }

    function updateProject(
        address _projectAddress,
        string memory _ipfsFileCID,
        string memory _signature
    ) public {
        projects[_projectAddress]._ipfsFileCID = _ipfsFileCID;
        projects[_projectAddress]._signature = _signature;

        emit ProjectEvent(projects[_projectAddress], _projectAddress);
    }

    function getProjectInfo(address _address)
        public
        view
        returns (Project memory)
    {
        return projects[_address];
    }

    function getAllProjects() public view returns (Project[] memory) {
        Project[] memory allProjects;
        if (projectsCounter == 0) return allProjects;

        allProjects = new Project[](projectsCounter);
        for (uint256 index = 0; index < projectsCounter; index++) {
            address _projectAddress = projectsAddress[index];
            Project storage project = projects[_projectAddress];
            allProjects[index] = project;
        }
        return allProjects;
    }


    /**  Project Requests  */

    mapping(uint256 => ProjectRequest) public projectRequests;
    uint256 public projectRequestsCounter = 0;
    address[] public projectRequestsAddress;

    function createUniqueProjectRequestAddress(string memory _title, uint _index) public view returns (address) {
        return address(uint160(uint256(keccak256(abi.encodePacked(_title, _projectInitiator, _index)))));
    }

    function createProjectRequest(
        string memory _title,
        uint256 _status,
        uint256 _requestStatus,
        address _projectAddress,
        address _projectReqAddress,
        string memory _signature
    ) public {
        projectRequests[projectRequestsCounter] = ProjectRequest(
            projectRequestsCounter,
            _title,
            "",
            ProjectStatus(_status),
            RequestStatus(_requestStatus),
            _projectAddress,
            _projectInitiator,
            _projectReqAddress,
            block.timestamp,
            _signature
        );

        filterRequests(
            projectRequestsCounter,
            _title,
            _requestStatus,
            _status,
            _projectAddress,
            _projectReqAddress
        );

        emit ProjectRequestEvent(projectRequests[projectRequestsCounter], _projectAddress);
        projectRequestsAddress.push(_projectReqAddress);
        projectRequestsCounter++;
    }

    function filterRequests(
        uint256 _indexProjectRequest,
        string memory _title,
        uint256 _requestStatus,
        uint256 _projectStatus,
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
        } else if (
            ProjectStatus(_projectStatus) == ProjectStatus.StartProject
        ) {
            _requestType = RequestType.CompanyReq;
        }
        createRequest(
            _indexProjectRequest,
            _title,
            _requestStatus,
            _projectStatus,
            _requestType,
            _projectAddress,
            _requestAddress
        );
    }

    function getAllProjectRequests()
        public
        view
        returns (ProjectRequest[] memory)
    {
        ProjectRequest[] memory allProjectRequests;
        if (projectRequestsCounter == 0) return allProjectRequests;

        allProjectRequests = new ProjectRequest[](projectRequestsCounter);
        for (uint256 index = 0; index < projectRequestsCounter; index++) {
            ProjectRequest storage projectReq = projectRequests[index];
            allProjectRequests[index] = projectReq;
        }
        return allProjectRequests;
    }

    function getLastProjectRequest(address _projectAddress)
        public
        view
        returns (ProjectRequest memory)
    {
        ProjectRequest memory request;
        if (projectRequestsCounter > 0) {
            for (
                uint256 index = projectRequestsCounter - 1;
                index >= 0;
                index--
            ) {
                if (_projectAddress == projectRequests[index]._projectAddress) {
                    request = ProjectRequest(
                        0, "", "",
                        projectRequests[index]._status,
                        projectRequests[index]._requestStatus,
                        projectRequests[index]._projectAddress,
                        address(0), address(0), 0, ""
                    );
                    return request;
                }
            }
        }
        return request;
    }


    /**  DATA FOR SUPERVISOR && COMPANY  */

    mapping(uint256 => Request) public requests;
    uint256 public requestsCounter = 0;

    function createRequest(
        uint256 _indexProjectRequest,
        string memory _title,
        uint256 _requestStatus,
        uint256 _projectStatus,
        RequestType _requestType,
        address _projectAddress,
        address _requestAddress
    ) internal {
        requests[requestsCounter] = Request(
            requestsCounter,
            _indexProjectRequest,
            _title,
            RequestStatus(_requestStatus),
            ProjectStatus(_projectStatus),
            _requestType,
            _projectAddress,
            _projectInitiator,
            _requestAddress,
            block.timestamp,
            ""
        );

        emit RequestEvent(requests[requestsCounter]);
        requestsCounter++;
    }

    function updateRequest(
        uint256 _index,
        uint256 _indexProjectRequest,
        string memory _comments,
        uint256 _requestStatus,
        uint256 _projectStatus,
        address _projectAddress,
        string memory _signature
    ) public {
        // Update request status in the Requests Mapping and Struct Array
        requests[_index]._requestStatus = RequestStatus(_requestStatus);
        requests[_index]._signature = _signature;

        emit RequestEvent(requests[_index]);

        // Update project request status in the Project Requests Mapping and Struct Array
        projectRequests[_indexProjectRequest]._comments = _comments;
        projectRequests[_indexProjectRequest]._requestStatus = RequestStatus(_requestStatus);
        projectRequests[_indexProjectRequest]._signature = _signature;

        emit ProjectRequestEvent(projectRequests[_indexProjectRequest], _projectAddress);

        // Update ProjectStatus to the requested status - Porject Mapping and Struct Array
        if (RequestStatus.Approved == RequestStatus(_requestStatus)) {
        projects[_projectAddress]._status = ProjectStatus(_projectStatus);
        emit ProjectEvent(projects[_projectAddress], _projectAddress);
        }
    }

    function getAllRequests() public view returns (Request[] memory) {
        Request[] memory allRequests;
        if (requestsCounter == 0) return allRequests;

        allRequests = new Request[](requestsCounter);
        for (uint256 index = 0; index < requestsCounter; index++) {
            Request storage request = requests[index];
            allRequests[index] = request;
        }
        return allRequests;
    }
}
