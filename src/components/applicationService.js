
import { getUserRoleById, getProjectStatusById, getRequestStatusById } from './formService';

export async function getAllUsers(props) {
    let data = [];
    await props.project.methods.getAllUsers().call().then((result) => {
        result.map((result) => {
            let role = getUserRoleById(result['_role']);
            const user = {
                username: result['_username'],
                email: props.web3.utils.hexToUtf8(result['_email']),
                firstname: props.web3.utils.hexToUtf8(result['_firstname']),
                lastname: props.web3.utils.hexToUtf8(result['_lastname']),
                role: role.value,
                walletAddress: result['_walletAddress'],
            };
            data.push(user);
            return false;
        });
    }).catch(function (error) {
        console.log(error);
    });
    return data;
}

export async function getAllProjects(props) {
    let data = [];
    await props.project.methods.getAllProjects().call().then((result) => {
        result.map((result) => {
            let status = getProjectStatusById(result['_status']);
            const project = {
                index: result['_index'],
                name: props.web3.utils.hexToUtf8(result['_name']),
                status: status.value,
                ipfsFileCID: result['_ipfsFileCID'],
                projectAddress: result['_projectAddress'],
                userAddress: result['_userAddress'],
            };
            data.push(project);
            return false;
        });
    }).catch(function (error) {
        console.log(error);
    });
    return data;
}

export async function getProjectInfo(props, projectAddress) {
    return await props.project.methods.getProjectInfo(projectAddress).call().then((result) => {
        let status = getProjectStatusById(result['_status']);
        const project = {
            index: result['_index'],
            name: props.web3.utils.hexToUtf8(result['_name']),
            status: status.value,
            ipfsFileCID: result['_ipfsFileCID'],
            projectAddress: result['_projectAddress'],
            userAddress: result['_userAddress'],
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

    let data = [];
    allProjectRequest.map((result) => {
        if (projectAddress === result['_projectAddress']) {
            let status = getProjectStatusById(result['_status']);
            let requestStatus = getRequestStatusById(result['_requestStatus']);
            const project = {
                index: result['_index'],
                title: props.web3.utils.hexToUtf8(result['_title']),
                comments: result['_comments'],
                status: status.value,
                requestStatus: requestStatus.value,
                projectAddress: result['_projectAddress'],
                userAddress: result['_userAddress'],
            };
            data.push(project);
        }
        return false;
    });
    return data;
}


/********  Methods for Supervisor and Company  ***********/

export async function getAllRequests(props) {
    let allRequests = await props.project.methods.getAllRequests().call().then((result) => {
        return result;
    }).catch(function (error) {
        console.log(error);
    });

    console.log(allRequests);

    let data = [];
    // allRequests.map((result) => {
    //     if (projectAddress === result['_projectAddress']) {
    //         let status = getProjectStatusById(result['_status']);
    //         let requestStatus = getRequestStatusById(result['_requestStatus']);
    //         const project = {
    //             index: result['_index'],
    //             title: result['_title'],
    //             description: result['_description'],
    //             comments: result['_comments'],
    //             status: status.value,
    //             requestStatus: requestStatus.value,
    //             projectAddress: result['_projectAddress'],
    //             userAddress: result['_userAddress'],
    //         };
    //         data.push(project);
    //     }
    //     return false;
    // });
    return data;
}




