
export const initialProjectRequestFormValues = {
	title: '',
	description: '',
	status: '',
	requestStatus: '',
};

export const initialProjectRequestFormValidity = {
	title: false,
	description: false,
	status: false,
	requestStatus: false,
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

export const userRoleDropdown = [
	{ id: '0', value: 'DefaultRole' },
	{ id: '1', value: 'ProjectInitiator' },
	{ id: '2', value: 'CompanyBuilder' },
	{ id: '3', value: 'ProjectSupervisor' },
];

export const projectStatusDropdown = [
	{ id: '0', value: 'Created' },
	{ id: '1', value: 'Approved' },
	{ id: '2', value: 'Rejected' },
	{ id: '3', value: 'OnGoing' },
	{ id: '4', value: 'FinalizationCheck' },
	{ id: '5', value: 'Completed' },
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
            console.log(result);
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
            let status = getProjectStatusById(result['status']);
            const project = {
                index: result['index'],
                name: result['name'],
                description: result['description'],
                status: status.value,
                ipfsFileCID: result['ipfsFileCID']
            };
            data.push(project);
            return false;
        });
    }).catch(function (error) {
        console.log(error);
    });
    return data;
}
