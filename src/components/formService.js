
export const initialRequestFormValues = {
    index: '',
	title: '',
    comments: '',
	projectStatus: '',
	requestStatus: '',
    projectAddress: '',
    indexProjectRequest: '',
    userAddress: '',
};

export const initialRequestFormValidity = {
    index: false,
	title: false,
    comments: false,
	projectStatus: false,
	requestStatus: false,
    projectAddress: false,
    indexProjectRequest: false,
    userAddress: false,
};

export const initialProjectRequestFormValues = {
	title: '',
    comments: '',
	status: '',
	requestStatus: '',
    projectAddress: '',
};

export const initialProjectRequestFormValidity = {
	title: false,
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
	status: '',
    file: {
        name: '',
        type: '',
        sizeBytes: '',
        lastModifiedDate: ''
    },
    ipfsFileCID: '',
};

export const initialProjectFormValidity = {
	name: false,
	status: false,
    file: false,
};

export const getDefaultProjectStatus = () => {
    return { id: '0', value: 'Created' };
}

export const getDefaultRequestStatus = () => {
    return { id: '0', value: 'UnApproved' };
};

export const requestStatusTwoDropdown = [
    { id: '1', value: 'Rejected' },
	{ id: '2', value: 'Approved' },
];

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
	{ id: '1', value: 'ToApprove' },
	{ id: '2', value: 'StartProject' },
	{ id: '3', value: 'FinalizationCheck' },
	{ id: '4', value: 'Completed' },
];

export function getProjectStatusById(projectStatus) {
    return projectStatusDropdown.find((element) => {
        return Number(element.id) === Number(projectStatus);
    });
}

export function getProjectStatusByValue(projectStatus) {
    return projectStatusDropdown.find((element) => {
        return element.value === projectStatus;
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
