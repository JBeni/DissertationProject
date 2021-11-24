
import { getUserRoleById, getProjectStatusById, getRequestStatusById, getCompanyRequestType, getSupervisorRequestType, getDefaultRequestStatus } from './dropdownService';

export async function getAllUsers(props) {
    let dataArray = [];
    await props.project.methods.getAllUsers().call().then((result) => {
        result.map((result) => {
            let role = getUserRoleById(result._role);
            const user = {
                username: result._username,
                email: props.web3.utils.hexToUtf8(result._email),
                firstname: props.web3.utils.hexToUtf8(result._firstname),
                lastname: props.web3.utils.hexToUtf8(result._lastname),
                role: role.value,
                walletAddress: result._walletAddress,
                timestamp: result._timestamp
            };
            dataArray.push(user);
            return false;
        });
    }).catch(function (error) {
        console.log(error);
    });
    return dataArray;
}

export async function getAllProjects(props) {
    let dataArray = [];
    await props.project.methods.getAllProjects().call().then((result) => {
        result.map((result) => {
            let status = getProjectStatusById(result._status);
            const project = {
                index: result._index,
                name: props.web3.utils.hexToUtf8(result._name),
                status: status.value,
                ipfsFileCID: result._ipfsFileCID,
                projectAddress: result._projectAddress,
                userAddress: result._userAddress,
                timestamp: result._timestamp
            };
            dataArray.push(project);
            return false;
        });
    }).catch(function (error) {
        console.log(error);
    });
    return dataArray;
}

export async function getProjectInfo(props, projectAddress) {
    return await props.project.methods.getProjectInfo(projectAddress).call().then((result) => {
        let status = getProjectStatusById(result._status);
        const project = {
            index: result._index,
            name: props.web3.utils.hexToUtf8(result._name),
            status: status.value,
            ipfsFileCID: result._ipfsFileCID,
            projectAddress: result._projectAddress,
            userAddress: result._userAddress,
            timestamp: result._timestamp
        };
        return project;
    }).catch(function (error) {
        console.log(error);
    });
}

export async function getAllProjectRequests(props, projectAddress) {
    let allProjectRequest = await props.project.methods.getAllProjectRequests().call().then((result) => {
        return result;
    }).catch(function (error) {
        console.log(error);
    });

    let dataArray = [];
    allProjectRequest.map((result) => {
        if (projectAddress === result._projectAddress) {
            let status = getProjectStatusById(result._status);
            let requestStatus = getRequestStatusById(result._requestStatus);
            const project = {
                index: result._index,
                title: props.web3.utils.hexToUtf8(result._title),
                comments: result._comments,
                status: status.value,
                requestStatus: requestStatus.value,
                projectAddress: result._projectAddress,
                userAddress: result._userAddress,
                requestAddress: result._requestAddress,
                timestamp: result._timestamp
            };
            dataArray.push(project);
        }
        return false;
    });
    return dataArray;
}


/********  Methods for Supervisor and Company  ***********/

export async function getSupervisorRequests(props) {
    let allRequests = await props.project.methods.getAllRequests().call().then((result) => {
        return result;
    }).catch(function (error) {
        console.log(error);
    });

    let dataArray = [];
    allRequests.map((result) => {
        let requestStatus = getRequestStatusById(result._requestStatus);
        let unApproveStatus = getDefaultRequestStatus();
        let requestType = getSupervisorRequestType(result._requestType);

        if (requestStatus.value === unApproveStatus.value) {
            if (Number(result._requestType) === Number(requestType.id)) {
                let projectStatus = getProjectStatusById(result._projectStatus);
                const project = {
                    index: result._index,
                    title: props.web3.utils.hexToUtf8(result._title),
                    comments: result._comments,
                    projectStatus: projectStatus.value,
                    requestStatus: requestStatus.value,
                    requestType: requestType.value,
                    projectAddress: result._projectAddress,
                    indexProjectRequest: result._indexProjectRequest,
                    userAddress: result._userAddress,
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

export async function getCompanyRequests(props) {
    let allRequests = await props.project.methods.getAllRequests().call().then((result) => {
        return result;
    }).catch(function (error) {
        console.log(error);
    });

    let dataArray = [];
    allRequests.map((result) => {
        let requestStatus = getRequestStatusById(result._requestStatus);
        let unApproveStatus = getDefaultRequestStatus();
        let requestType = getCompanyRequestType(result._requestType);

        if (requestStatus.value === unApproveStatus.value) {
            if (Number(result._requestType) === Number(requestType.id)) {
                let projectStatus = getProjectStatusById(result._projectStatus);
                const project = {
                    index: result._index,
                    title: props.web3.utils.hexToUtf8(result._title),
                    comments: result._comments,
                    projectStatus: projectStatus.value,
                    requestStatus: requestStatus.value,
                    requestType: requestType.value,
                    projectAddress: result._projectAddress,
                    indexProjectRequest: result._indexProjectRequest,
                    userAddress: result._userAddress,
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

export async function getAllRequests(props) {
    let allRequests = await props.project.methods.getAllRequests().call().then((result) => {
        return result;
    }).catch(function (error) {
        console.log(error);
    });

    let data = [];
    allRequests.map((result) => {
        let requestStatus = getRequestStatusById(result._requestStatus);
        let unApproveStatus = getDefaultRequestStatus();

        if (requestStatus.value !== unApproveStatus.value) {
            let requestType = getSupervisorRequestType(result._requestType);
            let projectStatus = getProjectStatusById(result._projectStatus);
            const project = {
                index: result._index,
                title: props.web3.utils.hexToUtf8(result._title),
                comments: result._comments,
                projectStatus: projectStatus.value,
                requestStatus: requestStatus.value,
                requestType: requestType.value,
                projectAddress: result._projectAddress,
                indexProjectRequest: result._indexProjectRequest,
                userAddress: result._userAddress,
                requestAddress: result._requestAddress,
                timestamp: result._timestamp
            };
            data.push(project);
        }
        return false;
    });
    return data;
}

export async function createUniqueProjectRequestAddress(props) {
    let response = await props.project.methods.createUniqueProjectRequestAddress().call()
        .catch(function (error) { console.log(error); });
    return response;
}

export async function createUniqueProjectAddress(props) {
    let response = await props.project.methods.createUniqueProjectAddress().call()
        .catch(function (error) { console.log(error); });
    return response;
}
