// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import './ProjectManager.sol';

contract Project {

    uint index;
    string description;

    ProjectManager parentContract;

    constructor(ProjectManager _parentContract, uint _index, string memory _description) {
        parentContract = _parentContract;
        index = _index;
        description = _description;
    }
}
