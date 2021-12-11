// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./UserChain.sol";
import "./SharedChain.sol";

contract ProjectChain is SharedChain {
    UserChain userChain;

    constructor() {
        //userChain = new UserChain();
    }

    modifier onlyUserProject() {
        // User memory sessionUser = userChain.getUserInfo(msg.sender);
        // require(
        //     sessionUser._role == Roles.UserProject,
        //     "You don't have the rights for this resource."
        // );
        _;
    }

    modifier onlySupervisor() {
        // User memory sessionUser = userChain.getUserInfo(msg.sender);
        // require(
        //     sessionUser._role == Roles.Supervisor,
        //     "You don't have the rights for this resource."
        // );
        _;
    }

    modifier onlyCompany() {
        // User memory sessionUser = userChain.getUserInfo(msg.sender);
        // require(
        //     sessionUser._role == Roles.Company,
        //     "You don't have the rights for this resource."
        // );
        _;
    }


    /**  PROJECT INITIATOR  */

    mapping(address => Project) public projects;
    uint256 public projectsCounter = 0;
    address[] public projectsAddress;

    function createUniqueProjectAddress(string memory _name, uint256 _index) public view returns (address) {
        return address(uint160(uint256(keccak256(abi.encodePacked(_name, msg.sender, _index)))));
    }

    function createProject(
        address _projectAddress,
        string memory _name,
        uint256 _status,
        string memory _ipfsFileCID,
        string memory _signature
    ) public onlyUserProject {
        projects[_projectAddress] = Project(
            projectsCounter,
            _name,
            ProjectStatus(_status),
            _ipfsFileCID,
            _projectAddress,
            msg.sender,
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
    ) public onlyUserProject {
        projects[_projectAddress]._ipfsFileCID = _ipfsFileCID;
        projects[_projectAddress]._signature = _signature;

        emit ProjectEvent(projects[_projectAddress], _projectAddress);
    }

    function getProjectInfo(address _address)
        public
        view
        returns (Project memory)
    {
        //require(msg.sender != address(0x0), "Address is not valid.");
        return projects[_address];
    }

    function getUserProjects(address _signerAddress) public view returns (Project[] memory) {
        Project[] memory allProjects;
        if (projectsCounter == 0) return allProjects;

        allProjects = new Project[](projectsCounter);
        for (uint256 index = 0; index < projectsCounter; index++) {
            address _projectAddress = projectsAddress[index];
            if (_signerAddress == projects[_projectAddress]._signerAddress) {
                Project storage project = projects[_projectAddress];
                allProjects[index] = project;
            }
        }
        return allProjects;
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


    /**  Requests  */

    mapping(address => Request) public requests;
    uint256 public requestsCounter = 0;
    address[] public requestsAddress;

    function createUniqueRequestAddress(string memory _title, uint256 _index) public view returns (address) {
        return address(uint160(uint256(keccak256(abi.encodePacked(_title, msg.sender, _index)))));
    }

    function createRequest(
        string memory _title,
        uint256 _projectStatus,
        uint256 _requestStatus,
        address _projectAddress,
        address _requestAddress,
        string memory _signature
    ) public {
        //require(projects[_projectAddress]._status == ProjectStatus.Created, "Steps must follow accordingly");
        //require(ProjectStatus.ToApprove == RequestStatus.UnApproved, "");
        //require(ProjectStatus.ToApprove == RequestStatus.Rejected, "");

        RequestType _requestType;
        if (ProjectStatus(_projectStatus) == ProjectStatus.StartProject) {
            _requestType = RequestType.CompanyReq;
        } else {
            _requestType = RequestType.SupervisorReq;
        }

        requests[_requestAddress] = Request(
            requestsCounter,
            _title,
            "",
            ProjectStatus(_projectStatus),
            RequestStatus(_requestStatus),
            RequestType(_requestType),
            _projectAddress,
            _requestAddress,
            msg.sender,
            block.timestamp,
            _signature
        );

        emit RequestEvent(requests[_requestAddress], _requestAddress, _projectAddress);
        requestsAddress.push(_requestAddress);
        requestsCounter++;
    }

    function updateRequest(
        string memory _comments,
        uint256 _requestStatus,
        uint256 _projectStatus,
        address _projectAddress,
        address _requestAddress,
        string memory _signature
    ) public {
        // Update Requests Mapping and Struct Array
        requests[_requestAddress]._comments = _comments;
        requests[_requestAddress]._requestStatus = RequestStatus(_requestStatus);
        requests[_requestAddress]._signature = _signature;
        emit RequestEvent(requests[_requestAddress], _requestAddress, _projectAddress);

        // Update Project Mapping and Struct Array
        if (RequestStatus.Approved == RequestStatus(_requestStatus)) {
            projects[_projectAddress]._status = ProjectStatus(_projectStatus);
            emit ProjectEvent(projects[_projectAddress], _projectAddress);
        }
    }

    function getAllRequests() public view returns (Request[] memory) {
        Request[] memory allRequests = new Request[](requestsCounter);
        for (uint256 index = 0; index < requestsCounter; index++) {
            address _requestAddress = requestsAddress[index];
            Request storage request = requests[_requestAddress];
            allRequests[index] = request;
        }
        return allRequests;
    }

    function getProjectRequests(address _projectAddress) public view returns (Request[] memory) {
        Request[] memory allRequests;
        for (uint256 index = 0; index < requestsCounter; index++) {
            address _requestAddress = requestsAddress[index];
            Request storage request = requests[_requestAddress];
            if (_projectAddress == request._projectAddress) {
                allRequests[index] = request;
            }
        }
        return allRequests;
    }


    function getLastProjectRequest(address _projectAddress, address _requestAddress)
        public view returns (Request memory)
    {
        Request memory request;
        if (requestsCounter > 0) {
            if (requests[_requestAddress]._projectAddress == _projectAddress) {
                request = requests[_requestAddress];
            }
        }
        return request;
    }



}
