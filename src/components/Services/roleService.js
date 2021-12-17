
export async function getAddressZeroValue(props) {
    return await props.serviceChain.methods.getAddressZeroValue().call({ from: props.account })
        .then((response) => { return response; }).catch((error) => {});
}

export async function getAdminRole(props) {
    return await props.serviceChain.methods.getAdminRole().call({ from: props.account })
        .then((response) => { return response; }).catch((error) => {});
}

export async function getDefaultRole(props) {
    return await props.serviceChain.methods.getDefaultRole().call({ from: props.account })
        .then((response) => { return response; }).catch((error) => {});
}

export async function getUserProjectRole(props) {
    return await props.serviceChain.methods.getUserProjectRole().call({ from: props.account })
        .then((response) => { return response; }).catch((error) => {});
}

export async function getCompanyRole(props) {
    return await props.serviceChain.methods.getCompanyRole().call({ from: props.account })
        .then((response) => { return response; }).catch((error) => {});
}

export async function getSupervisorRole(props) {
    return await props.serviceChain.methods.getSupervisorRole().call({ from: props.account })
        .then((response) => { return response; }).catch((error) => {});
}
