
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
