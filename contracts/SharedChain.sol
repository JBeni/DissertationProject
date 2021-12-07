// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract SharedChain {

    enum RequestType { SupervisorReq, CompanyReq }
    enum RequestStatus { UnApproved, Rejected, Approved }
    enum ProjectStatus { Created, ToApprove, StartProject, FinalizationCheck, Completed }

    enum Roles {
        DefaultRole,
        UserProject,
        Company,
        Supervisor
    }


    /******  User Data */
    struct User {
        uint _index;
        string _username;
        bytes32 _email;
        bytes32 _firstname;
        bytes32 _lastname;
        Roles _role;
        address _walletAddress;
        uint _timestamp;
        string _signature;
    }
    event UserEvent(
        User _user,
        address indexed _walletAddress
    );


    /*********  Project Related Data */
    struct Project {
        uint _index;
        string _name;
        ProjectStatus _status;
        string _ipfsFileCID;
        address _projectAddress;
        address _signerAddress;
        uint _timestamp;
        string _signature;
    }
    event ProjectEvent(
        Project _project,
        address indexed _projectAddress
    );

    struct ProjectRequest {
        uint _index;
        string _title;
        string _comments;
        ProjectStatus _status;
        RequestStatus _requestStatus;
        address _projectAddress;
        address _signerAddress;
        address _requestAddress;
        uint _timestamp;
        string _signature;
    }
    event ProjectRequestEvent(
        ProjectRequest _projectRequest,
        address indexed _projectAddress
    );

    /******** Supervisor and Company Data */
    struct Request {
        uint _index;
        uint _indexProjectRequest;
        string _title;
        RequestStatus _requestStatus;
        ProjectStatus _projectStatus;
        RequestType _requestType;
        address _projectAddress;
        address _signerAddress;
        address _requestAddress;
        uint _timestamp;
        string _signature;
    }
    event RequestEvent(
        Request _request
    );
}
