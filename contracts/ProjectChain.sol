// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./UserChain.sol";

contract ProjectChain is UserChain {

    constructor() {}

    modifier onlyUserProject() {
        require(Roles(users[msg.sender]._role) == Roles.UserProject, "You are not the right user.");
        _;
    }

    modifier onlyUserProjectAndCompany() {
        require(
            Roles(users[msg.sender]._role) == Roles.UserProject || Roles(users[msg.sender]._role) == Roles.Company,
            "You are not the right user."
        );
        _;
    }


    mapping(address => Project) public projects;
    uint256 public projectsCounter = 0;
    address[] public projectsAddress;

    function createUniqueProjectAddress(string memory _name, uint256 _index)
        public view onlyUserProject returns (address)
    {
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
            address(0x0),
            false,
            block.timestamp,
            _signature
        );

        emit ProjectEvent(projects[_projectAddress], _projectAddress, address(0x0));
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

        emit ProjectEvent(projects[_projectAddress], _projectAddress, address(0x0));
    }

    function getProjectInfo(address _address)
        public view returns (Project memory)
    {
        if (users[msg.sender]._walletAddress != msg.sender) {
            revert("You are not the right user.");
        }
        return projects[_address];
    }

    function getProjects()
        public view onlyUserProjectAndCompany returns (Project[] memory)
    {
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


    mapping(address => Request) public requests;
    uint256 public requestsCounter = 0;
    address[] public requestsAddress;

    function createUniqueRequestAddress(string memory _title, uint256 _index)
        public view returns (address)
    {
        require(users[msg.sender]._walletAddress == msg.sender, "Address is not valid.");
        return address(uint160(uint256(keccak256(abi.encodePacked(_title, msg.sender, _index)))));
    }

    function createRequest(
        string memory _title,
        uint256 _projectStatus,
        uint256 _requestStatus,
        address _projectAddress,
        address _requestAddress,
        string memory _signature
    ) public onlyUserProjectAndCompany {
        RequestType _requestType = RequestType.SupervisorReq;
        if (ProjectStatus(_projectStatus) == ProjectStatus.StartProject) {
            _requestType = RequestType.CompanyReq;
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

    function updateSupervisorRequest(
        string memory _comments,
        uint256 _requestStatus,
        uint256 _projectStatus,
        address _projectAddress,
        address _requestAddress,
        string memory _signature
    ) public {
        require(Roles(users[msg.sender]._role) == Roles.Supervisor, "You are not the right user.");

        // Update Requests Mapping and Struct Array
        requests[_requestAddress]._comments = _comments;
        requests[_requestAddress]._requestStatus = RequestStatus(_requestStatus);
        requests[_requestAddress]._signature = _signature;
        emit RequestEvent(requests[_requestAddress], _requestAddress, _projectAddress);

        // Update Project Mapping and Struct Array
        if (RequestStatus.Approved == RequestStatus(_requestStatus)) {
            projects[_projectAddress]._status = ProjectStatus(_projectStatus);
            emit ProjectEvent(projects[_projectAddress], _projectAddress, address(0x0));
        }
    }

    function updateCompanyRequest(
        string memory _comments,
        uint256 _requestStatus,
        uint256 _projectStatus,
        address _projectAddress,
        address _requestAddress,
        string memory _signature
    ) public {
        require(Roles(users[msg.sender]._role) == Roles.Company, "You are not the right user.");

        // Update Requests Mapping and Struct Array
        requests[_requestAddress]._comments = _comments;
        requests[_requestAddress]._requestStatus = RequestStatus(_requestStatus);
        requests[_requestAddress]._signature = _signature;
        emit RequestEvent(requests[_requestAddress], _requestAddress, _projectAddress);

        // Update Project Mapping and Struct Array
        if (RequestStatus.Approved == RequestStatus(_requestStatus)) {
            projects[_projectAddress]._status = ProjectStatus(_projectStatus);
            projects[_projectAddress]._companyAddress = msg.sender;
            emit ProjectEvent(projects[_projectAddress], _projectAddress, msg.sender);
        }
    }

    function getAllRequests() public view returns (Request[] memory) {
        require(users[msg.sender]._walletAddress == msg.sender, "Address is not valid.");

        Request[] memory allRequests = new Request[](requestsCounter);
        for (uint256 index = 0; index < requestsCounter; index++) {
            address _requestAddress = requestsAddress[index];
            Request storage request = requests[_requestAddress];
            allRequests[index] = request;
        }
        return allRequests;
    }

    function getLastProjectRequest(address _projectAddress, address _requestAddress) 
        public view onlyUserProjectAndCompany returns (Request memory)
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
