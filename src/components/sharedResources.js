
import { makeStyles } from '@material-ui/core/styles';
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

import * as toasterService from './Services//toasterService';
import fileDownload from 'js-file-download';

const axios = require('axios');

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

export const useStylesCustomStepper = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    backButton: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}));

export const useStylesForm = makeStyles((theme) => ({
	primary: {
		backgroundColor: theme.palette.primary.light,
		'& .MuiButton-label': {
			color: theme.palette.primary.main,
		},
	},
	root: {
		'& .MuiFormControl-root': {
			width: '80%',
			margin: theme.spacing(1),
		},
		minWidth: 0,
		margin: theme.spacing(0.5),
	},
	label: {
		textTransform: 'none',
	},
}));

export const useStylesLoader = makeStyles((theme) => ({
	root: {
		display: 'flex',
	},
}));


/** Request related Project */

export function setMessageNextStep(lastRequest) {
    // Approve Request was Sent
    if (Number(lastRequest._projectStatus) === 1 && Number(lastRequest._requestStatus) === 0) {
        return { currentStep: 'Approve Request was Sent', nextStep: 'Wait for Supervisor response' };
    }
    // Approve Request was Rejected
    if (Number(lastRequest._projectStatus) === 1 && Number(lastRequest._requestStatus) === 1) {
        return { currentStep: 'Approve Request was Rejected', nextStep: 'See the reason and make the adjustment' };
    }
    // Approve Request was Approved
    if (Number(lastRequest._projectStatus) === 1 && Number(lastRequest._requestStatus) === 2) {
        return { currentStep: 'Approve Request was Approved', nextStep: 'Send start project request to company.' };
    }

    // StartProject Request was Sent
    if (Number(lastRequest._projectStatus) === 2 && Number(lastRequest._requestStatus) === 0) {
        return { currentStep: 'StartProject Request was Sent', nextStep: 'Wait for Company response' };
    }
    // StartProject Request was Rejected
    if (Number(lastRequest._projectStatus) === 2 && Number(lastRequest._requestStatus) === 1) {
        return { currentStep: 'StartProject Request was Rejected', nextStep: 'See the reason and make the adjustment' };
    }
    // StartProject Request was Approved
    if (Number(lastRequest._projectStatus) === 2 && Number(lastRequest._requestStatus) === 2) {
        return { currentStep: 'StartProject Request was Approved', nextStep: 'Send check the progress before finalization request to Supervisor' };
    }

    // FinalizationCheck Request was Sent
    if (Number(lastRequest._projectStatus) === 3 && Number(lastRequest._requestStatus) === 0) {
        return { currentStep: 'FinalizationCheck Request was Sent', nextStep: 'Wait for Supervisor response' };
    }
    // FinalizationCheck Request was Rejected
    if (Number(lastRequest._projectStatus) === 3 && Number(lastRequest._requestStatus) === 1) {
        return { currentStep: 'FinalizationCheck Request was Rejected', nextStep: 'See the reason and make the adjustment' };
    }
    // FinalizationCheck Request was Approved
    if (Number(lastRequest._projectStatus) === 3 && Number(lastRequest._requestStatus) === 2) {
        return { currentStep: 'FinalizationCheck Request was Approved', nextStep: 'Send completed project request to Supervisor' };
    }

    // Completed Request was Sent
    if (Number(lastRequest._projectStatus) === 4 && Number(lastRequest._requestStatus) === 0) {
        return { currentStep: 'Completed Request was Sent', nextStep: 'Wait for Supervisor response' };
    }
    // Completed Request was Rejected
    if (Number(lastRequest._projectStatus) === 4 && Number(lastRequest._requestStatus) === 1) {
        return { currentStep: 'Completed Request was Rejected', nextStep: 'See the reason and make the adjustment' };
    }
    // Completed Request was Approved
    if (Number(lastRequest._projectStatus) === 4 && Number(lastRequest._requestStatus) === 2) {
        return { currentStep: 'Project Completed', nextStep: 'All steps completed.' };
    }
}

export function setActiveStep(lastRequest) {
    // Status with Approve Consent
    if (Number(lastRequest._projectStatus) > 0 && Number(lastRequest._requestStatus) < 2) {
        return { activeStep: Number(lastRequest._projectStatus), projectCompleted: false };
    }
    if (Number(lastRequest._projectStatus) > 0 && Number(lastRequest._projectStatus) < 4 && Number(lastRequest._requestStatus) === 2) {
        return { activeStep: Number(lastRequest._projectStatus) + 1, projectCompleted: false };
    }
    // Last Project Status
    if (Number(lastRequest._projectStatus) === 4 && Number(lastRequest._requestStatus) === 2) {
        return { activeStep: Number(lastRequest._projectStatus) + 1, projectCompleted: true };
    }
}

export function getProjectStatusSteps() {
    return [ 'Created', 'ToApprove', 'StartProject', 'FinalizationCheck', 'Completed'];
}

export async function verifySignatureEntity(props, _addressToVerify, _signerAddress, _signature) {
    const v = '0x' + _signature.slice(130, 132).toString();
    const r = _signature.slice(0, 66).toString();
    const s = '0x' + _signature.slice(66, 130).toString();
    const messageHash = props.web3.eth.accounts.hashMessage(_addressToVerify);

    const signer = await props.web3.eth.accounts.recover(messageHash, v, r, s, true);
    const verificationOutput = _signerAddress === signer ? true : false;

    if (verificationOutput) {
        alert('Signer Address is verified successfully!');
        return true;
    } else {
        alert('Signer Address is not verified!');
        return false;
    }
}

export async function testUserPrivateKey(props, _addressToVerify, _signerAddress, _signature) {
    const v = '0x' + _signature.slice(130, 132).toString();
    const r = _signature.slice(0, 66).toString();
    const s = '0x' + _signature.slice(66, 130).toString();
    const messageHash = props.web3.eth.accounts.hashMessage(_addressToVerify);

    const signer = await props.web3.eth.accounts.recover(messageHash, v, r, s, true);
    const verificationOutput = _signerAddress === signer ? true : false;

    if (verificationOutput) {
        return true;
    } else {
        alert('The Signer Private Key is not valid. Enter your real private key.');
        return false;
    }
}

export function signEntityByUser(_entityAddress, props) {
    const userPrivateKey = prompt('Please enter your private key to sign the transaction....');

    if (userPrivateKey === null) {
        toasterService.notifyToastError('Valid Private KEY required to sign the transaction.');
        return null;
    }

    try {
        return props.web3.eth.accounts.sign(_entityAddress, '0x' + userPrivateKey.trim());
    } catch (error) {
        toasterService.notifyToastError('Valid Private KEY required to sign the transaction.');
        return null;
    }
}

export function downloadIpfsFile(filename, ipfsCID) {
    const url = `https://ipfs.io/ipfs/${ipfsCID}`;
    axios.get(url, {
        responseType: 'blob',
    })
    .then((res) => {
        fileDownload(res.data, filename + ".pdf");
    }).catch((error) => {});
}
