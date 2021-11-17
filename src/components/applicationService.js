import { forwardRef } from 'react';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

export const materialTableIcons = {
	Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
	Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
	Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
	Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
	DetailPanel: forwardRef((props, ref) => (
		<ChevronRight {...props} ref={ref} />
	)),
	Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
	Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
	Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
	FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
	LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
	NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
	PreviousPage: forwardRef((props, ref) => (
		<ChevronLeft {...props} ref={ref} />
	)),
	ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
	Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
	SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
	ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
	ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
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
	{ id: "1", value: 'DefaultRole' },
	{ id: "2", value: 'ProjectInitiator' },
	{ id: "3", value: 'CompanyBuilder' },
	{ id: "4", value: 'ProjectSupervisor' },
];

export const projectStatusDropdown = [
	{ id: '1', value: 'Created', label: 'Created' },
	{ id: '2', value: 'Approved', label: 'Approved' },
	{ id: '3', value: 'Rejected', label: 'Rejected' },
	{ id: '4', value: 'OnGoing', label: 'OnGoing' },
	{
		id: '5',
		value: 'BeforeFinalizationCheck',
		label: 'BeforeFinalizationCheck',
	},
	{ id: '6', value: 'Completed', label: 'Completed' },
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
