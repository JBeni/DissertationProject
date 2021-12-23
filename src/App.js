import React, { Component } from 'react';
import Navbar from './components/Navbar/Navbar';
import Web3 from 'web3';
import Loader from './components/Views/Loader';
import * as dropdownService from './components/Services/dropdownService';

// ABI Folder to Interact with Smart Contracts
import ProjectChain from './abis/ProjectChain.json';
import AdminChain from './abis/AdminChain.json';
import ServiceChain from './abis/ServiceChain.json';

class App extends Component {
	constructor() {
		super();
		this.state = {
			account: null,
			project: null,
            adminChain: null,
            serviceChain: null,
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
        const browser = await this.loadWeb3();
        if (!browser) return;
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
            return false;
        }
        return true;
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

        await this.checkAdminRole();
        await this.checkUserRole();
	}

    async checkAdminRole() {
        const adminData = await this.state.adminChain.methods.getAdminInfo().call({ from: this.state.account }).then((response) => {
            const role = dropdownService.getAdminRoleById(response._role);
            return {
                username: response._firstname + ' ' + response._lastname,
                role: role.value,
                walletAddress: response._walletAddress
            };
        }).catch((error) => {});

        if (adminData === undefined || adminData?.role === 0) {
            return;
        }

        if (this.state.account === adminData.walletAddress) {
            this.setState({ loading: false, currentUsername: adminData.username });
            const adminRole = await this.state.serviceChain.methods.getAdminRole().call({ from: this.state.account });
            if (adminData.role === adminRole) {
                this.setState({ currentUserRole: adminData.role });
            } else {
                this.setState({ unAuthorisedUser: true });
            }
            return;
        }
    }

    async checkUserRole() {
        if (this.state.currentUsername !== null && this.state.loading === false) return;

        const userInfo = await this.state.project.methods.getUserInfo(this.state.account).call({ from: this.state.account }).then((response) => {
            const role = dropdownService.getUserRoleById(response._role);
            return {
                username: this.state.web3.utils.hexToUtf8(response._firstname) + ' ' + this.state.web3.utils.hexToUtf8(response._lastname),
                role: role.value,
                walletAddress: response._walletAddress
            };
        }).catch((error) => {});
        if (userInfo === undefined) { this.setState({ unAuthorisedUser: true }); return; }

        if (userInfo.walletAddress === this.state.account) {
            this.setState({ loading: false, currentUserRole: userInfo.role, currentUsername: userInfo.username });
            return;
        }
    }

    render() {
        if (this.state.loading === false) {
            return (
				<React.Fragment>
                    <Navbar
                        account={this.state.account}
                        project={this.state.project}
                        serviceChain={this.state.serviceChain}
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
