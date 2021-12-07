import React, { Component } from 'react';
import Navbar from './components/Navbar/Navbar';
import Web3 from 'web3';
import Loader from './components/Views/Loader';
import * as roleService from './components/Services/roleService';

// ABI Folder to Interact with Smart Contracts
import ProjectChain from './abis/ProjectChain.json';
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
            adminChain: null,
            serviceChain: null,
            signatureChain: null,
            loggedIn: false,
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
        const adminData = await this.state.adminChain.methods.getAdminInfo().call().then((response) => {
            return response;
        });

        if (this.state.account === adminData._walletAddress) {
            this.setState({ loading: false, currentUsername: adminData._username });
            const adminRole = roleService.getAdminRole();
            if (adminData._role === adminRole) {
                this.setState({ currentUserRole: roleService.getAdminRole() });
            } else {
                this.setState({ unAuthorisedUser: true });
            }
            return;
        }

        const users = await this.state.project.methods.getAllUsers().call().then((response) => {
            return response;
        });
        if (users.length > 0) {
            const userInfo = await this.state.project.methods.getUserInfo(this.state.account).call().then((response) => {
                return { username: response._username, walletAddress: response._walletAddress };
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
                        serviceChain={this.state.serviceChain}
                        signatureChain={this.state.signatureChain}
                        currentUsername={this.state.currentUsername}
                        currentUserRole={this.state.currentUserRole}
                        loggedIn={this.state.loggedIn}
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
