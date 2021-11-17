
import { roleDropdownOptions } from './Users/AddUserModal';

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
