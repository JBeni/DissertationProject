import { projectStatusDropdown } from './Projects/DefaultModal';

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

export const roleDropdownOptions = [
	{ id: "1", value: 'DefaultRole' },
	{ id: "2", value: 'ProjectInitiator' },
	{ id: "3", value: 'CompanyBuilder' },
	{ id: "4", value: 'ProjectSupervisor' },
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

    await this.props.project.methods.getAllProjects().call().then((result) => {
        result.map((result) => {
            let status = projectStatusDropdown.find((element) => {
                return Number(element.id) === Number(result['projectStatus']);
            });
            let project = {
                index: result['index'],
                name: result['name'],
                description: result['description'],
                projectStatus: status.value,
                ipfsFileCID: result['ipfsFileCID']
            };
            this.setState({ projects: [...this.state.projects, project] });
            return false;
        });
    }).catch(function (error) {
        console.log(error);
    });
    return data;
}
