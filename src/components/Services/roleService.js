
export async function getAddressZeroValue(props) {
    return await props.serviceChain.methods.getAddressZeroValue().call();
}

export async function getAdminRole(props) {
    return await props.serviceChain.methods.getAdminRole().call();
}

export async function getDefaultRole(props) {
    return await props.serviceChain.methods.getDefaultRole().call();
}

export async function getUserProjectRole(props) {
    return await props.serviceChain.methods.getUserProjectRole().call();
}

export async function getCompanyRole(props) {
    return await props.serviceChain.methods.getCompanyRole().call();
}

export async function getSupervisorRole(props) {
    return await props.serviceChain.methods.getSupervisorRole().call();
}
