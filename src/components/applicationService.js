
export const initialRequestFormValues = {
    index: '',
	title: '',
	description: '',
	projectStatus: '',
	requestStatus: '',
    projectAddress: '',
    userAddress: '',
};

export const initialRequestFormValidity = {
    index: false,
	title: false,
	description: false,
	projectStatus: false,
	requestStatus: false,
    projectAddress: false,
    userAddress: false,
};

export const initialProjectRequestFormValues = {
	title: '',
	description: '',
    comments: '',
	status: '',
	requestStatus: '',
    projectAddress: '',
};

export const initialProjectRequestFormValidity = {
	title: false,
	description: false,
    comments: false,
	status: false,
	requestStatus: false,
    projectAddress: false,
};

export const initialUserFormValues = {
	isEditForm: false,
	firstname: '',
	lastname: '',
	email: '',
	role: '',
	walletAddress: '',
};

export const initialUserFormValidity = {
	firstname: false,
	lastname: false,
	email: false,
	role: false,
	walletAddress: false,
};

export const initialProjectFormValues = {
	isEditForm: false,
	name: '',
	description: '',
	status: '',
    file: {
        name: '',
        type: '',
        sizeBytes: '',
        lastModifiedDate: ''
    },
};

export const initialProjectFormValidity = {
	name: false,
	description: false,
	status: false,
    file: false,
};

export const getDefaultRequestStatus = () => {
    return { id: '0', value: 'UnApproved' };
};

export const requestStatusDropdown = [
    { id: '0', value: 'UnApproved' },
    { id: '1', value: 'Rejected' },
	{ id: '2', value: 'Approved' },
];

export function getRequestStatusById(requestStatus) {
    return requestStatusDropdown.find((element) => {
        return Number(element.id) === Number(requestStatus);
    });
}

export function getRequestStatusByValue(requestStatus) {
    return requestStatusDropdown.find((element) => {
        return element.value === requestStatus;
    });
}

export const projectStatusDropdown = [
	{ id: '0', value: 'Created' },
	{ id: '1', value: 'Approved' },
	{ id: '2', value: 'StartProject' },
	{ id: '3', value: 'FinalizationCheck' },
	{ id: '4', value: 'Completed' },
];

export function getProjectStatusById(requestStatus) {
    return projectStatusDropdown.find((element) => {
        return Number(element.id) === Number(requestStatus);
    });
}

export function getProjectStatusByValue(requestStatus) {
    return projectStatusDropdown.find((element) => {
        return element.value === requestStatus;
    });
}

export const userRoleDropdown = [
	{ id: '0', value: 'DefaultRole' },
	{ id: '1', value: 'ProjectInitiator' },
	{ id: '2', value: 'CompanyBuilder' },
	{ id: '3', value: 'ProjectSupervisor' },
];

export function getUserRoleById(role) {
    return userRoleDropdown.find((element) => {
        return Number(element.id) === Number(role);
    });
}

export function getUserRoleByValue(role) {
    return userRoleDropdown.find((element) => {
        return element.value === role;
    });
}

export async function getAllUsers(props) {
    let data = [];
    await props.project.methods.getAllUsers().call().then((result) => {
        result.map((result) => {
            let role = getUserRoleById(result['role']);
            const user = {
                username: result['username'],
                email: result['email'],
                firstname: result['firstname'],
                lastname: result['lastname'],
                role: role.value,
                walletAddress: result['walletAddress'],
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
            console.log(result);
            let status = getProjectStatusById(result['_status']);
            const project = {
                index: result['_index'],
                name: result['_name'],
                description: result['_description'],
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
            name: result['_name'],
            description: result['_description'],
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
                title: result['_title'],
                description: result['_description'],
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
    console.log(data);
    return data;
}
