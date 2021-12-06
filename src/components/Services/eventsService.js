import { getUserRoleById, getProjectStatusById } from '../Services/dropdownService';
import { getRequestStatusById } from './dropdownService';


/** User Events Methods */

export async function getAllUserEvents(props) {
    let events = await props.project.getPastEvents('UserEvent', {
        fromBlock: 0,
        toBlock: 'latest'
    });
    if (events === undefined || events.length === 0) return [];

    let data = [];
    events.map((result) => {
        let role = getUserRoleById(result.returnValues._role);
        const user = {
            index: Number(result.returnValues._index),
            username: result.returnValues._username,
            email: props.web3.utils.hexToUtf8(result.returnValues._email),
            firstname: props.web3.utils.hexToUtf8(result.returnValues._firstname),
            lastname: props.web3.utils.hexToUtf8(result.returnValues._lastname),
            role: role.value,
            walletAddress: result.returnValues._walletAddress,
            timestamp: new Date(result.returnValues._timestamp * 1000).toString()
        };
        data.push(user);
        return false;
    });
    return data;
}

export async function getUserEvents(props, _walletAddress) {
    let events = await props.project.getPastEvents('UserEvent', {
        filter: { _walletAddress: _walletAddress },
        fromBlock: 0,
        toBlock: 'latest'
    });
    if (events === undefined || events.length === 0) return [];

    let data = [];
    let indexLocal = 1;
    events.map((result) => {
        let role = getUserRoleById(result.returnValues._role);
        const user = {
            index: Number(result.returnValues._index) + indexLocal,
            username: result.returnValues._username,
            email: props.web3.utils.hexToUtf8(result.returnValues._email),
            firstname: props.web3.utils.hexToUtf8(result.returnValues._firstname),
            lastname: props.web3.utils.hexToUtf8(result.returnValues._lastname),
            role: role.value,
            walletAddress: result.returnValues._walletAddress,
            timestamp: new Date(result.returnValues._timestamp * 1000).toString()
        };
        data.push(user);
        indexLocal++;
        return false;
    });
    return data;
}


/** Project Events Methods */

export async function getAllProjectEvents(props) {
    let events = await props.project.getPastEvents('ProjectEvent', {
        fromBlock: 0,
        toBlock: 'latest'
    });
    if (events === undefined || events.length === 0) return [];

    let data = [];
    events.map((result) => {
        let status = getProjectStatusById(result.returnValues._project._status);
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
        data.push(project);
        return false;
    });

    console.log(data);
    return data;
}

export async function getProjectEvents(props, _projectAddress) {
    let events = await props.project.getPastEvents('ProjectEvent', {
        filter: { _projectAddress: _projectAddress },
        fromBlock: 0,
        toBlock: 'latest'
    });
    if (events === undefined || events.length === 0) return [];

    let data = [];
    let indexLocal = 1;
    events.map((result) => {
        let status = getProjectStatusById(result.returnValues._project._status);
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
        data.push(project);
        indexLocal++;
        return false;
    });
    return data;
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
    let events = await props.project.getPastEvents('ProjectRequestEvent', {
        filter: { _projectAddress: _projectAddress },
        fromBlock: 0,
        toBlock: 'latest'
    });
    if (events === undefined || events.length === 0) return [];

    let data = [];
    let indexLocal = 1;
    events.map((result) => {
        let projectStatus = getProjectStatusById(result.returnValues._projectRequest._status);
        let requestStatus = getRequestStatusById(result.returnValues._projectRequest._requestStatus);
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
        data.push(project);
        indexLocal++;
        return false;
    });
    return data;
}
