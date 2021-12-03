
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
        size: '',
        lastModifiedDate: ''
    },
    ipfsFileCID: '',
};

export const initialProjectFormValidity = {
	name: false,
	status: false,
    file: false,
    ipfsFileCID: false,
};
