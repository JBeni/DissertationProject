// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract SharedChain {
    enum RequestType { SupervisorReq, CompanyReq }
    enum RequestStatus { UnApproved, Rejected, Approved }
    enum ProjectStatus { Created, ToApprove, StartProject, FinalizationCheck, Completed }

    event ProjectEvent(
        uint _index,
        bytes32 _name,
        ProjectStatus _status,
        string _ipfsFileCID,
        address _projectAddress,
        address _userAddress,
        uint _timestamp
    );

    struct Project {
        uint _index;
        bytes32 _name;
        ProjectStatus _status;
        string _ipfsFileCID;
        address _projectAddress;
        address _userAddress;
    }

    event ProjectRequestEvent(
        uint _index,
        bytes32 _title,
        string _comments,
        ProjectStatus _status,
        RequestStatus _requestStatus,
        address _projectAddress,
        address _userAddress,
        uint _timestamp
    );

    struct ProjectRequest {
        uint _index;
        bytes32 _title;
        string _comments;
        ProjectStatus _status;
        RequestStatus _requestStatus;
        address _projectAddress;
        address _userAddress;
    }

    /****** */

    struct Request {
        uint _index;
        uint _indexProjectRequest;
        bytes32 _title;
        RequestStatus _requestStatus;
        ProjectStatus _projectStatus;
        RequestType _requestType;
        address _projectAddress;
        address _userAddress;
    }

    event RequestEvent(
        uint _index,
        uint _indexProjectRequest,
        bytes32 _title,
        RequestStatus _status,
        ProjectStatus _projectStatus,
        RequestType _requestType,
        address _projectAddress,
        address _userAddress,
        uint _timestamp
    );
}
