
export const initialRequestFormValues = {
    index: '',
	title: '',
    comments: '',
	projectStatus: '',
	requestStatus: '',
    requestType: '',
    projectAddress: '',
    requestAddress: '',
    signerAddress: '',
    timestamp: '',
    signature: ''
};

export const initialRequestFormValidity = {
    index: false,
	title: false,
    comments: false,
	projectStatus: false,
	requestStatus: false,
    requestType: false,
    projectAddress: false,
    requestAddress: false,
    signerAddress: false,
    timestamp: false,
    signature: false
};

export const initialProjectRequestFormValues = {
	title: '',
    comments: '',
	projectStatus: '',
	requestStatus: '',
    projectAddress: '',
};

export const initialProjectRequestFormValidity = {
	title: false,
    comments: false,
	projectStatus: false,
	requestStatus: false,
    projectAddress: false,
};

export const initialUserFormValues = {
	isEditForm: false,
	firstname: '',
	lastname: '',
	role: '',
	walletAddress: '',
};

export const initialUserFormValidity = {
	firstname: false,
	lastname: false,
	role: false,
	walletAddress: false,
};

export const initialProjectFormValues = {
	isEditForm: false,
	title: '',
    name: '',
    comments: '',
    file: { name: '', type: '', size: '', lastModifiedDate: '' },
	status: '',
    requestStatus: '',
    ipfsFileCID: '',
    projectAddress: '',
    signerAddress: '',
    companyAddress: '',
    assigned: '',
    timestamp: '',
};

export const initialProjectFormValidity = {
	name: false,
	status: false,
    file: false,
    ipfsFileCID: false,
};
