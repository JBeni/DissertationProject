import { getUserRoleById } from './dropdownService';

export async function getAllUserEvents(props) {
    let events = await props.project.getPastEvents('UserEvent', {
        fromBlock: 0,
        toBlock: 'latest'
    });

    let data = [];
    events.map((result) => {
        let role = getUserRoleById(result.returnValues._role);
        const user = {
            index: Number(result.returnValues._index),
            username: result.returnValues._username,
            email: props.web3.utils.hexToUtf8(result.returnValues._email),
            firstname: props.web3.utils.hexToUtf8(result.returnValues._firstname),
            lastname: props.web3.utils.hexToUtf8(result.returnValues._lastname),
            role: role.value,
            walletAddress: result.returnValues._walletAddress,
            timestamp: new Date(result.returnValues._timestamp * 1000).toString()
        };
        data.push(user);
        return false;
    });
    return data;
}

export async function getUserEvents(props, _userAddress) {
    let events = await props.project.getPastEvents('UserEvent', {
        filter: { _walletAddress: _userAddress },
        fromBlock: 0,
        toBlock: 'latest'
    });

    let data = [];
    let indexLocal = 1;
    events.map((result) => {
        let role = getUserRoleById(result.returnValues._role);
        const user = {
            index: Number(result.returnValues._index) + indexLocal,
            username: result.returnValues._username,
            email: props.web3.utils.hexToUtf8(result.returnValues._email),
            firstname: props.web3.utils.hexToUtf8(result.returnValues._firstname),
            lastname: props.web3.utils.hexToUtf8(result.returnValues._lastname),
            role: role.value,
            walletAddress: result.returnValues._walletAddress,
            timestamp: new Date(result.returnValues._timestamp * 1000).toString()
        };
        data.push(user);
        indexLocal++;
        return false;
    });
    return data;
}
