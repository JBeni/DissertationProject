import * as dropdownService from '../Services/dropdownService';

// Useful but not used anymore in the project

export const verifyTestSignature = async (props, _projectAddress, _signerAddress, _signature) => {
    const v = '0x' + _signature.slice(130, 132).toString();
    const r = _signature.slice(0, 66).toString();
    const s = '0x' + _signature.slice(66, 130).toString();
    const messageHash = props.web3.eth.accounts.hashMessage(_projectAddress);

    const verificationOutput = await props.signatureChain.methods
        .verifySignature(_signerAddress, messageHash, v, r, s)
        .call({ from: this.props.account });

    if (verificationOutput) {
        alert('Signer Address is verified successfully!');
    } else {
        alert('Signer Address is not verified!');
    }
}

export async function getCompanyRequests(props) {
    const allRequests = await props.project.methods.getAllRequests().call({ from: props.account }).then((result) => {
        return result;
    }).catch(function (error) {});

    let dataArray = [];
    allRequests.map((result) => {
        const requestStatus = dropdownService.getRequestStatusById(result._requestStatus);
        const unApproveStatus = dropdownService.getDefaultRequestStatus();
        const requestType = dropdownService.getCompanyRequestType(result._requestType);

        if (requestStatus.value === unApproveStatus.value) {
            if (Number(result._requestType) === Number(requestType.id)) {
                const projectStatus = dropdownService.getProjectStatusById(result._projectStatus);
                const project = {
                    index: Number(result._index),
                    title: result._title,
                    comments: result._comments,
                    projectStatus: projectStatus.value,
                    requestStatus: requestStatus.value,
                    requestType: requestType.value,
                    projectAddress: result._projectAddress,
                    indexProjectRequest: Number(result._indexProjectRequest),
                    signerAddress: result._signerAddress,
                    requestAddress: result._requestAddress,
                    timestamp: result._timestamp
                };
                dataArray.push(project);
            }
        }
        return false;
    });
    return dataArray;
}

export async function getRequestEvents(props, _requestAddress) {
    const events = await props.project.getPastEvents('RequestEvent', {
        filter: { _requestAddress: _requestAddress },
        fromBlock: 0,
        toBlock: 'latest'
    });
    if (events === undefined || events.length === 0) return [];

    let dataArray = [];
    events.map((result) => {
        const projectStatus = dropdownService.getProjectStatusById(result.returnValues._request._projectStatus);
        const requestStatus = dropdownService.getRequestStatusById(result.returnValues._request._requestStatus);
        const requestType = dropdownService.getRequestTypeById(result.returnValues._request._requestType);
        const project = {
            index: Number(result.returnValues._request._index),
            title: result.returnValues._request._title,
            projectStatus: projectStatus.value,
            requestStatus: requestStatus.value,
            requestType: requestType.value,
            projectAddress: result.returnValues._request._projectAddress,
            requestAddress: result.returnValues._request._requestAddress,
            signerAddress: result.returnValues._request._signerAddress,
            timestamp: new Date(result.returnValues._request._timestamp * 1000).toString(),
            signature: result.returnValues._request._signature
        };
        dataArray.push(project);
        return false;
    });
    return dataArray;
}

export async function getSupervisorRequestEvents(props, _requestAddress) {
    const events = await props.project.getPastEvents('RequestEvent', {
        filter: { _requestAddress: _requestAddress },
        fromBlock: 0,
        toBlock: 'latest'
    });
    if (events === undefined || events.length === 0) return [];

    let dataArray = [];
    events.map((result) => {
        const projectStatus = dropdownService.getProjectStatusById(result.returnValues._request._projectStatus);
        const requestStatus = dropdownService.getRequestStatusById(result.returnValues._request._requestStatus);
        const requestType = dropdownService.getRequestTypeById(result.returnValues._request._requestType);
        const project = {
            index: Number(result.returnValues._request._index),
            title: result.returnValues._request._title,
            projectStatus: projectStatus.value,
            requestStatus: requestStatus.value,
            requestType: requestType.value,
            projectAddress: result.returnValues._request._projectAddress,
            requestAddress: result.returnValues._request._requestAddress,
            signerAddress: result.returnValues._request._signerAddress,
            timestamp: new Date(result.returnValues._request._timestamp * 1000).toString(),
            signature: result.returnValues._request._signature
        };
        dataArray.push(project);
        return false;
    });
    return dataArray;
}

export async function getAllProjectEvents(props) {
    const events = await props.project.getPastEvents('ProjectEvent', {
        fromBlock: 0,
        toBlock: 'latest'
    });
    if (events === undefined || events.length === 0) return [];

    let dataArray = [];
    events.map((result) => {
        const status = dropdownService.getProjectStatusById(result.returnValues._project._status);
        const project = {
            index: Number(result.returnValues._project._index),
            name: result.returnValues._project._name,
            status: status.value,
            ipfsFileCID: result.returnValues._project._ipfsFileCID,
            projectAddress: result.returnValues._project._projectAddress,
            signerAddress: result.returnValues._project._signerAddress,
            timestamp: new Date(result.returnValues._project._timestamp * 1000).toString(),
            signature: result.returnValues._project._signature
        };
        dataArray.push(project);
        return false;
    });
    return dataArray;
}

export async function getAllUserEvents(props) {
    const events = await props.userChain.getPastEvents('UserEvent', {
        fromBlock: 0,
        toBlock: 'latest'
    });
    if (events === undefined || events.length === 0) return [];

    let dataArray = [];
    events.map((result) => {
        const role = dropdownService.getUserRoleById(result.returnValues._user._role);
        const user = {
            index: Number(result.returnValues._user._index),
            firstname: props.web3.utils.hexToUtf8(result.returnValues._user._firstname),
            lastname: props.web3.utils.hexToUtf8(result.returnValues._user._lastname),
            role: role.value,
            walletAddress: result.returnValues._user._walletAddress,
            timestamp: new Date(result.returnValues._user._timestamp * 1000).toString(),
        };
        dataArray.push(user);
        return false;
    });
    return dataArray;
}
