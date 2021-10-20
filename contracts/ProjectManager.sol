// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import './Project.sol';

contract ProjectManager {

    struct S_Project {
        Project _project;
        bytes32 _identifier;
    }

    mapping(uint => S_Project) public projects;
    uint index;

    event CreateProject(uint _projectIndex, address _address);

    modifier onlyProjectInitiator {
        require(address(projects[0]._project) == msg.sender, "You are not a project initiator");
        _;
    }

    function createProject(string memory _description, string memory _hashStringValue) public onlyProjectInitiator {
        Project project = new Project(this, index, _description);
        bytes32 _identifier = createUniqueIdentifier(_hashStringValue, address(project));

        projects[index]._project = project;
        projects[index]._identifier = _identifier;
        emit CreateProject(index, address(project));
        index++;
    }

    function createUniqueIdentifier(string memory _text, address _addr) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_text, _addr));
    }




}
