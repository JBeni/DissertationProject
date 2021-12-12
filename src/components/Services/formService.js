
export const initialRequestFormValues = {
    index: '',
	title: '',
    comments: '',
	projectStatus: '',
	requestStatus: '',
    projectAddress: '',
    indexProjectRequest: '',
    timestamp: '',
    signerAddress: '',
};

export const initialRequestFormValidity = {
    index: false,
	title: false,
    comments: false,
	projectStatus: false,
	requestStatus: false,
    projectAddress: false,
    indexProjectRequest: false,
    signerAddress: false,
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
