
import * as dropdownService from '../Services/dropdownService';

/*****************    *******/

export async function getAllUsers(props) {
    let dataArray = [];
    await props.userChain.methods.getAllUsers().call({ from: props.account }).then((result) => {
        result.map((result) => {
            const role = dropdownService.getUserRoleById(result._role);
            const user = {
                firstname: props.web3.utils.hexToUtf8(result._firstname),
                lastname: props.web3.utils.hexToUtf8(result._lastname),
                role: role.value,
                walletAddress: result._walletAddress,
                timestamp: result._timestamp
            };
            dataArray.push(user);
            return false;
        });
    }).catch(function (error) {});
    return dataArray;
}

export async function getUserInfo(props) {
    return await props.userChain.methods.getUserInfo(props.account).call({ from: props.account }).then((result) => {
        const role = dropdownService.getUserRoleById(result._role);
        const user = {
            firstname: props.web3.utils.hexToUtf8(result._firstname),
            lastname: props.web3.utils.hexToUtf8(result._lastname),
            role: role.value,
            walletAddress: result._walletAddress,
            timestamp: result._timestamp
        };
        return user;
    }).catch(function (error) {});
}

export async function getAllProjects(props) {
    let dataArray = [];
    await props.project.methods.getAllProjects().call({ from: props.account }).then((result) => {
        result.map((result) => {
            const status = dropdownService.getProjectStatusById(result._status);
            const project = {
                index: Number(result._index),
                name: result._name,
                status: status.value,
                ipfsFileCID: result._ipfsFileCID,
                projectAddress: result._projectAddress,
                signerAddress: result._signerAddress,
                timestamp: result._timestamp
            };
            dataArray.push(project);
            return false;
        });
    }).catch(function (error) {});
    return dataArray;
}

export async function getProjectInfo(props, projectAddress) {
    return await props.project.methods.getProjectInfo(projectAddress).call({ from: props.account }).then((result) => {
        const status = dropdownService.getProjectStatusById(result._status);
        const project = {
            index: Number(result._index),
            name: result._name,
            status: status.value,
            ipfsFileCID: result._ipfsFileCID,
            projectAddress: result._projectAddress,
            signerAddress: result._signerAddress,
            timestamp: result._timestamp
        };
        return project;
    }).catch(function (error) {});
}

export async function getProjectRequests(props, _projectAddress) {
    const allProjectRequest = await props.project.methods.getProjectRequests(_projectAddress).call({ from: props.account }).then((result) => {
        return result;
    }).catch(function (error) {});

    let dataArray = [];
    allProjectRequest.map((result) => {
        if (_projectAddress === result._projectAddress) {
            const status = dropdownService.getProjectStatusById(result._status);
            const requestStatus = dropdownService.getRequestStatusById(result._requestStatus);
            const project = {
                index: Number(result._index),
                title: result._title,
                comments: result._comments,
                status: status.value,
                requestStatus: requestStatus.value,
                projectAddress: result._projectAddress,
                signerAddress: result._signerAddress,
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
    const allRequests = await props.project.methods.getAllRequests().call({ from: props.account }).then((result) => {
        return result;
    }).catch(function (error) {});

    let dataArray = [];
    allRequests.map((result) => {
        const requestStatus = dropdownService.getRequestStatusById(result._requestStatus);
        const unApproveStatus = dropdownService.getDefaultRequestStatus();
        const requestType = dropdownService.getSupervisorRequestType(result._requestType);

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



export async function getAllRequests(props) {
    const allRequests = await props.project.methods.getAllRequests().call({ from: props.account }).then((result) => {
        return result;
    }).catch(function (error) {});

    let dataArray = [];
    allRequests.map((result) => {
        const requestStatus = dropdownService.getRequestStatusById(result._requestStatus);
        const unApproveStatus = dropdownService.getDefaultRequestStatus();

        if (requestStatus.value !== unApproveStatus.value) {
            const requestType = dropdownService.getSupervisorRequestType(result._requestType);
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
                timestamp: result._timestamp,
            };
            dataArray.push(project);
        }
        return false;
    });
    return dataArray;
}




export async function createUniqueRequestAddress(props, _title, _index) {
    const response = await props.project.methods.createUniqueProjectRequestAddress(_title, _index).call({ from: props.account })
        .catch(function (error) {});
    return response;
}

export async function createUniqueProjectAddress(props, _name, _index) {
    const response = await props.project.methods.createUniqueProjectAddress(_name, _index).call({ from: props.account })
        .catch(function (error) {});
    return response;
}
