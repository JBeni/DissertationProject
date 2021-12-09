import * as dropdownService from './dropdownService';

/** User Events Methods */

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
            username: result.returnValues._user._username,
            email: props.web3.utils.hexToUtf8(result.returnValues._user._email),
            firstname: props.web3.utils.hexToUtf8(result.returnValues._user._firstname),
            lastname: props.web3.utils.hexToUtf8(result.returnValues._user._lastname),
            role: role.value,
            walletAddress: result.returnValues._user._walletAddress,
            timestamp: new Date(result.returnValues._user._timestamp * 1000).toString(),
            signature: result.returnValues._user._signature
        };
        dataArray.push(user);
        return false;
    });
    return dataArray;
}

export async function getUserEvents(props, _walletAddress) {
    const events = await props.userChain.getPastEvents('UserEvent', {
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
            index: Number(result.returnValues._index) + indexLocal,
            username: result.returnValues._user._username,
            email: props.web3.utils.hexToUtf8(result.returnValues._user._email),
            firstname: props.web3.utils.hexToUtf8(result.returnValues._user._firstname),
            lastname: props.web3.utils.hexToUtf8(result.returnValues._user._lastname),
            role: role.value,
            walletAddress: result.returnValues._user._walletAddress,
            timestamp: new Date(result.returnValues._user._timestamp * 1000).toString(),
            signature: result.returnValues._user._signature
        };
        dataArray.push(user);
        indexLocal++;
        return false;
    });
    return dataArray;
}


/** Project Events Methods */

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
    const events = await props.project.getPastEvents('ProjectRequestEvent', {
        filter: { _projectAddress: _projectAddress },
        fromBlock: 0,
        toBlock: 'latest'
    });
    if (events === undefined || events.length === 0) return [];

    let dataArray = [];
    let indexLocal = 1;
    events.map((result) => {
        const projectStatus = dropdownService.getProjectStatusById(result.returnValues._projectRequest._status);
        const requestStatus = dropdownService.getRequestStatusById(result.returnValues._projectRequest._requestStatus);
        const project = {
            index: Number(result.returnValues._projectRequest._index) + indexLocal,
            title: result.returnValues._projectRequest._title,
            ticommentstle: result.returnValues._projectRequest._comments,
            status: projectStatus.value,
            requestStatus: requestStatus.value,
            projectAddress: result.returnValues._projectRequest._projectAddress,
            requestAddress: result.returnValues._projectRequest._requestAddress,
            signerAddress: result.returnValues._projectRequest._signerAddress,
            timestamp: new Date(result.returnValues._projectRequest._timestamp * 1000).toString(),
            signature: result.returnValues._projectRequest._signature
        };
        dataArray.push(project);
        indexLocal++;
        return false;
    });
    return dataArray;
}


/*** REQUEST METHODS */

export async function getRequestEvents(props, _requestAddress) {
    const events = await props.project.getPastEvents('RequestEvent', {
        filter: { _requestAddress: _requestAddress },
        fromBlock: 0,
        toBlock: 'latest'
    });
    if (events === undefined || events.length === 0) return [];

    console.log(events)

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
