// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./SharedChain.sol";

contract CompanyChain is SharedChain {
    address _companyAddress;

    mapping(uint => Request) public requestsCompany;
    uint public requestsCompanyCounter = 0;
    Request[] public allCompanyRequests;

    constructor() {
        _companyAddress = msg.sender;
    }

    modifier onlyCompany {
        require(_companyAddress == msg.sender, "You are not a company builder");
        _;
    }
/*
    function createRequestCompany(
        bytes32 _title,
        uint _requestStatus,
        uint _projectStatus,
        address _projectAddress
    ) public {
        requestsCompany[requestsCompanyCounter]._index = requestsCompanyCounter;
        requestsCompany[requestsCompanyCounter]._title = _title;
        requestsCompany[requestsCompanyCounter]._requestStatus = RequestStatus(_requestStatus);
        requestsCompany[requestsCompanyCounter]._projectStatus = ProjectStatus(_projectStatus);
        requestsCompany[requestsCompanyCounter]._projectAddress = _projectAddress;
        // change to companyAddress
        requestsCompany[requestsCompanyCounter]._userAddress = _companyAddress;

        emit RequestEvent(requestsCompanyCounter, _title, RequestStatus(_requestStatus), ProjectStatus(_projectStatus), _projectAddress, _companyAddress, block.timestamp);
        allCompanyRequests.push(Request(requestsCompanyCounter, _title,  RequestStatus(_requestStatus), ProjectStatus(_projectStatus), _projectAddress, _companyAddress));
        requestsCompanyCounter++;
    }

    function updateRequestCompany(uint _requestStatus, uint _index) public {
        requestsCompany[_index]._requestStatus = RequestStatus(_requestStatus);
        //uint index = requestsCompany[_index]._index;
        //allCompanyRequests[index]._requestStatus = RequestStatus(_requestStatus);
    }

    function getAllRequestsCompany() public view returns(Request[] memory) {
        return allCompanyRequests;
    }
*/
}
