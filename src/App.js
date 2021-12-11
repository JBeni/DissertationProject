import React, { Component } from 'react';
import Navbar from './components/Navbar/Navbar';
import Web3 from 'web3';
import Loader from './components/Views/Loader';
import * as roleService from './components/Services/roleService';
import * as dropdownService from './components/Services/dropdownService';

// ABI Folder to Interact with Smart Contracts
import ProjectChain from './abis/ProjectChain.json';
import UserChain from './abis/UserChain.json';
import AdminChain from './abis/AdminChain.json';
import ServiceChain from './abis/ServiceChain.json';
import SignatureChain from './abis/SignatureChain.json';

class App extends Component {
	constructor() {
		super();
		this.state = {
            openSignIn: true,
			account: null,
			project: null,
            userChain: null,
            adminChain: null,
            serviceChain: null,
            signatureChain: null,
			loading: true,
			web3: null,
            unAuthorisedUser: false,
            currentUsername: null,
            currentUserRole: null,
        };
    }

    componentDidMount() {
        this.initializeConnection();
    }

    async initializeConnection() {
        await this.loadWeb3();
		await this.loadBlockChain();
    }

    async loadWeb3() {
		if (window.ethereum) {
            window.ethereum.on('accountsChanged', function (respAccounts) {
                window.location.reload();
            });
            window.web3 = new Web3(window.ethereum);
		} else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider);
		} else {
			window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
		}
	}

    /**
     * eth.getAccounts() returns the address values in the format expected by the MetaMask
     * 
     * The eth_requestAccounts return the address with lowercase, therefore, IS NOT OKAY
     */
    async loadBlockChain() {
		const web3 = window.web3;
        const networkId = await web3.eth.net.getId();
        const accounts = await web3.eth.getAccounts();

        if (accounts.length === 0) {
            this.setState({ unAuthorisedUser: false });
            return;
        }
        this.setState({ account: accounts[0], web3: web3 });

        const networkServiceData = ServiceChain.networks[networkId];
        if (networkServiceData) {
            const serviceChain = new web3.eth.Contract(
                ServiceChain.abi,
                networkServiceData.address
            );
            this.setState({ serviceChain: serviceChain });
		} else {
			window.alert('Service Chain contract not deployed to detected network.');
		}

        const networkProjectData = ProjectChain.networks[networkId];
		if (networkProjectData) {
			const project = new web3.eth.Contract(
				ProjectChain.abi,
				networkProjectData.address
			);
            this.setState({ project: project });
		} else {
			window.alert('Project Chain contract not deployed to detected network.');
		}

        const networkUserChainData = UserChain.networks[networkId];
        if (networkUserChainData) {
            const userChain = new web3.eth.Contract(
                UserChain.abi,
                networkUserChainData.address
            );
            this.setState({ userChain: userChain });
		} else {
			window.alert('User Chain contract not deployed to detected network.');
		}

        const networkAdminData = AdminChain.networks[networkId];
        if (networkAdminData) {
            const adminChain = new web3.eth.Contract(
                AdminChain.abi,
                networkAdminData.address
            );
            this.setState({ adminChain: adminChain });
		} else {
			window.alert('Owner Chain contract not deployed to detected network.');
		}

        const networkSignatureChainData = SignatureChain.networks[networkId];
        if (networkSignatureChainData) {
            const signatureChain = new web3.eth.Contract(
                SignatureChain.abi,
                networkSignatureChainData.address
            );
            this.setState({ signatureChain: signatureChain });
		} else {
			window.alert('Signature Chain contract not deployed to detected network.');
		}

        await this.checkUserRole();
	}

    async checkUserRole() {
        const adminData = await this.state.adminChain.methods.getAdminInfo().call({ from: this.state.account }).then((response) => {
            const role = dropdownService.getAdminRoleById(response._role);
            return {
                username: response._username,
                role: role.value,
                walletAddress: response._walletAddress
            };
        });

        if (this.state.account === adminData.walletAddress) {
            this.setState({ loading: false, currentUsername: adminData.username });
            const adminRole = await this.state.serviceChain.methods.getAdminRole().call();
            if (adminData.role === adminRole) {
                this.setState({ currentUserRole: adminData.role });
            } else {
                this.setState({ unAuthorisedUser: true });
            }
            return;
        }

        const users = await this.state.userChain.methods.getAllUsers().call({ from: this.state.account }).then((response) => {
            return response;
        });
        if (users.length > 0) {
            const userInfo = await this.state.userChain.methods.getUserInfo(this.state.account).call({ from: this.state.account }).then((response) => {
                const role = dropdownService.getUserRoleById(response._role);
                return { username: response._username, role: role.value, walletAddress: response._walletAddress };
            });
            if (userInfo.walletAddress === this.state.account) {
                this.setState({ loading: false, currentUserRole: userInfo.role, currentUsername: userInfo.username });
                return;
            }
        }
        this.setState({ unAuthorisedUser: true });
    }

    render() {
        if (this.state.loading === false) {
            return (
				<React.Fragment>
                    <Navbar
                        account={this.state.account}
                        project={this.state.project}
                        userChain={this.state.userChain}
                        serviceChain={this.state.serviceChain}
                        signatureChain={this.state.signatureChain}
                        currentUsername={this.state.currentUsername}
                        currentUserRole={this.state.currentUserRole}
                        web3={this.state.web3}
                    />
				</React.Fragment>
			);
		} else {
			return (
                <>
                    <Loader unAuthorisedUser={this.state.unAuthorisedUser}></Loader>
                </>
            );
		}
	}
}

export default App;
