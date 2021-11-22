
/***    Methods for Dropdowns */

export const getSupervisorRequestType = () => {
    return { id: '0', value: 'SupervisorReq' };
}

export const getCompanyRequestType = () => {
    return { id: '1', value: 'CompanyReq' };
}

export const getDefaultProjectStatus = () => {
    return { id: '0', value: 'Created' };
}

export const getDefaultRequestStatus = () => {
    return { id: '0', value: 'UnApproved' };
}

export function getRequestTypeById(requestType) {
    return requestTypeDropdown.find((element) => {
        return Number(element.id) === Number(requestType);
    });
}

export function getRequestTypeByValue(requestType) {
    return requestTypeDropdown.find((element) => {
        return element.value === requestType;
    });
}

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

/** Dropdowns */

export const requestTypeDropdown = [
    { id: '0', value: 'SupervisorReq' },
	{ id: '1', value: 'CompanyReq' },
];

export const requestStatusDropdownTwoOptions = [
    { id: '1', value: 'Rejected' },
	{ id: '2', value: 'Approved' },
];

export const requestStatusDropdown = [
    { id: '0', value: 'UnApproved' },
    { id: '1', value: 'Rejected' },
	{ id: '2', value: 'Approved' },
];

export const projectStatusDropdown = [
	{ id: '0', value: 'Created' },
	{ id: '1', value: 'ToApprove' },
	{ id: '2', value: 'StartProject' },
	{ id: '3', value: 'FinalizationCheck' },
	{ id: '4', value: 'Completed' },
];

export const userRoleDropdown = [
	{ id: '0', value: 'DefaultRole' },
	{ id: '1', value: 'ProjectInitiator' },
	{ id: '2', value: 'CompanyBuilder' },
	{ id: '3', value: 'ProjectSupervisor' },
];
