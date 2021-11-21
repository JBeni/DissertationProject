// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract CompanyChain {
    address _companyAddress;

    constructor() {
        _companyAddress = msg.sender;
    }

    modifier onlyCompany {
        require(_companyAddress == msg.sender, "You are not a company builder");
        _;
    }
}
