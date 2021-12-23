import * as dropdownService from './dropdownService';


/*****************/

export async function getUserEvents(props, _walletAddress) {
    const events = await props.project.getPastEvents('UserEvent', {
        filter: { _walletAddress: _walletAddress },
        fromBlock: 0,
        toBlock: 'latest'
    });
    if (events === undefined || events.length === 0) return [];

    let dataArray = [];
    let indexLocal = 1;
    events.map((result) => {
        const role = dropdownService.getUserRoleById(result.returnValues._user._role);
        const user = {
            index: indexLocal,
            firstname: props.web3.utils.hexToUtf8(result.returnValues._user._firstname),
            lastname: props.web3.utils.hexToUtf8(result.returnValues._user._lastname),
            role: role.value,
            walletAddress: result.returnValues._user._walletAddress,
            timestamp: new Date(result.returnValues._user._timestamp * 1000).toString(),
        };
        dataArray.push(user);
        indexLocal++;
        return false;
    });
    return dataArray;
}

export async function getProjectEvents(props, _projectAddress) {
    const events = await props.project.getPastEvents('ProjectEvent', {
        filter: { _projectAddress: _projectAddress },
        fromBlock: 0,
        toBlock: 'latest'
    });
    if (events === undefined || events.length === 0) return [];

    let dataArray = [];
    let indexLocal = 1;
    events.map((result) => {
        const status = dropdownService.getProjectStatusById(result.returnValues._project._status);
        const project = {
            index: Number(result.returnValues._project._index) + indexLocal,
            name: result.returnValues._project._name,
            status: status.value,
            ipfsFileCID: result.returnValues._project._ipfsFileCID,
            projectAddress: result.returnValues._project._projectAddress,
            signerAddress: result.returnValues._project._signerAddress,
            timestamp: new Date(result.returnValues._project._timestamp * 1000).toString(),
            signature: result.returnValues._project._signature
        };
        dataArray.push(project);
        indexLocal++;
        return false;
    });
    return dataArray;
}

export async function checkProjectInEvents(props, _projectAddress) {
    let events = await props.project.getPastEvents('ProjectEvent', {
        filter: { _projectAddress: _projectAddress },
        fromBlock: 0,
        toBlock: 'latest'
    });

    events = events.filter((event) => {
        return event.returnValues._projectAddress === _projectAddress;
    });

    return events;
}

export async function getProjectRequestEvents(props, _projectAddress) {
    const events = await props.project.getPastEvents('RequestEvent', {
        filter: { _projectAddress: _projectAddress },
        fromBlock: 0,
        toBlock: 'latest'
    });
    if (events === undefined || events.length === 0) return [];

    let dataArray = [];
    let indexLocal = 1;
    events.map((result) => {
        const projectStatus = dropdownService.getProjectStatusById(result.returnValues._request._projectStatus);
        const requestStatus = dropdownService.getRequestStatusById(result.returnValues._request._requestStatus);
        const project = {
            index: Number(result.returnValues._request._index) + indexLocal,
            title: result.returnValues._request._title,
            ticommentstle: result.returnValues._request._comments,
            projectStatus: projectStatus.value,
            requestStatus: requestStatus.value,
            projectAddress: result.returnValues._request._projectAddress,
            requestAddress: result.returnValues._request._requestAddress,
            signerAddress: result.returnValues._request._signerAddress,
            timestamp: new Date(result.returnValues._request._timestamp * 1000).toString(),
            signature: result.returnValues._request._signature
        };
        dataArray.push(project);
        indexLocal++;
        return false;
    });
    return dataArray;
}

export async function getAllRequestEvents(props) {
    const events = await props.project.getPastEvents('RequestEvent', {
        fromBlock: 0,
        toBlock: 'latest'
    });
    if (events === undefined || events.length === 0) return [];

    let dataArray = [];
    let indexLocal = 1;
    events.map((result) => {
        const projectStatus = dropdownService.getProjectStatusById(result.returnValues._request._projectStatus);
        const requestStatus = dropdownService.getRequestStatusById(result.returnValues._request._requestStatus);
        const requestType = dropdownService.getRequestTypeById(result.returnValues._request._requestType);
        const project = {
            index: indexLocal,
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
        indexLocal++;
        return false;
    });
    return dataArray;
}
