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


    struct User {
        bytes32 _firstname;
        bytes32 _lastname;
        Roles _role;
        address _walletAddress;
        uint256 _timestamp;
    }
    event UserEvent(
        User _user,
        address indexed _walletAddress
    );


    struct Project {
        uint256 _index;
        string _name;
        ProjectStatus _status;
        string _ipfsFileCID;
        address _projectAddress;
        address _signerAddress;
        address _companyAddress;
        bool _assigned;
        uint256 _timestamp;
        string _signature;
    }
    event ProjectEvent(
        Project _project,
        address indexed _projectAddress,
        address indexed _companyAddress
    );


    struct Request {
        uint256 _index;
        string _title;
        string _comments;
        ProjectStatus _projectStatus;
        RequestStatus _requestStatus;
        RequestType _requestType;
        address _projectAddress;
        address _requestAddress;
        address _signerAddress;
        uint256 _timestamp;
        string _signature;
    }
    event RequestEvent(
        Request _request,
        address indexed _requestAddress,
        address indexed _projectAddress
    );
}
