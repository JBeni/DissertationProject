
export const initialProjectRequestFormValues = {
	title: '',
	description: '',
	projectStatus: '',
	requestStatus: '',
};

export const initialProjectRequestFormValidity = {
	title: false,
	description: false,
	requestStatus: false,
	projectStatus: false,
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

export const roleDropdownOptions = [
	{ id: '0', value: 'DefaultRole' },
	{ id: '1', value: 'ProjectInitiator' },
	{ id: '2', value: 'CompanyBuilder' },
	{ id: '3', value: 'ProjectSupervisor' },
];

export const projectStatusDropdown = [
	{ id: '0', value: 'Created', label: 'Created' },
	{ id: '1', value: 'Approved', label: 'Approved' },
	{ id: '2', value: 'Rejected', label: 'Rejected' },
	{ id: '3', value: 'OnGoing', label: 'OnGoing' },
	{
		id: '4',
		value: 'BeforeFinalizationCheck',
		label: 'BeforeFinalizationCheck',
	},
	{ id: '5', value: 'Completed', label: 'Completed' },
];


export async function getAllUsers(props) {
    let data = [];
    await props.project.methods.getAllUsers().call().then((result) => {
        result.map((result) => {
            let role = roleDropdownOptions.find((element) => {
                return Number(element.id) === Number(result['role']);
            });
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
            let status = projectStatusDropdown.find((element) => {
                return Number(element.id) === Number(result['projectStatus']);
            });
            const project = {
                index: result['index'],
                name: result['name'],
                description: result['description'],
                projectStatus: status.value,
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
