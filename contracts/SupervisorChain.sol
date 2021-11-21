// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./SharedChain.sol";

contract SupervisorChain is SharedChain {
    address _supervisorAddress;

    // They will be filter after the status of the requests
    mapping(uint => Request) public requestsSupervisor;
    uint public requestsSupervisorCounter = 0;
    Request[] public allSupervisorRequests;

    constructor() {
        _supervisorAddress = msg.sender;
    }

    modifier onlySupervisor {
        require(_supervisorAddress == msg.sender, "You are not a supervisor");
        _;
    }

    function createRequestSupervisor(
        bytes32 _title,
        uint _requestStatus,
        uint _projectStatus,
        address _projectAddress
    ) public {
        requestsSupervisor[requestsSupervisorCounter]._index = requestsSupervisorCounter;
        requestsSupervisor[requestsSupervisorCounter]._title = _title;
        requestsSupervisor[requestsSupervisorCounter]._requestStatus = RequestStatus(_requestStatus);
        requestsSupervisor[requestsSupervisorCounter]._projectStatus = ProjectStatus(_projectStatus);
        requestsSupervisor[requestsSupervisorCounter]._projectAddress = _projectAddress;
        // change to supervisorAddress
        requestsSupervisor[requestsSupervisorCounter]._userAddress = _supervisorAddress;

        emit RequestEvent(requestsSupervisorCounter, _title, RequestStatus(_requestStatus), ProjectStatus(_projectStatus), _projectAddress, _supervisorAddress, block.timestamp);
        allSupervisorRequests.push(Request(requestsSupervisorCounter, _title,  RequestStatus(_requestStatus), ProjectStatus(_projectStatus), _projectAddress, _supervisorAddress));
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
}
