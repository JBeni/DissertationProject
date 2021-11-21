// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract SharedChain {

    enum RequestStatus { UnApproved, Rejected, Approved }
    enum ProjectStatus { Created, Approved, StartProject, FinalizationCheck, Completed }

    event ProjectEvent(
        uint _index,
        string _name,
        ProjectStatus _status,
        string _ipfsFileCID,
        address _projectAddress,
        address _userAddress,
        uint _timestamp
    );
    struct Project {
        uint _index;
        string _name;
        ProjectStatus _status;
        string _ipfsFileCID;
        address _projectAddress;
        address _userAddress;
    }

    event ProjectRequestEvent(
        uint _index,
        string _title,
        string _comments,
        ProjectStatus _status,
        RequestStatus _requestStatus,
        address _projectAddress,
        address _userAddress,
        uint _timestamp
    );
    struct ProjectRequest {
        uint _index;
        string _title;
        string _comments;
        ProjectStatus _status;
        RequestStatus _requestStatus;
        address _projectAddress;
        address _userAddress;
    }

    /****** */

    struct Request {
        uint _index;
        string _title;
        RequestStatus _requestStatus;
        ProjectStatus _projectStatus;
        address _projectAddress;
        address _userAddress;
    }
    event RequestEvent(
        uint _index,
        string _title,
        RequestStatus _status,
        ProjectStatus _projectStatus,
        address _projectAddress,
        address _userAddress,
        uint _timestamp
    );

}
