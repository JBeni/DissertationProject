import React, { Component } from 'react';
import Navbar from './components/Navbar/Navbar';
import Web3 from 'web3';
import Loader from './components/Views/Loader';

// ABI Folder to Interact with Smart Contracts
import ProjectChain from './abis/ProjectChain.json';
import AdminChain from './abis/AdminChain.json';

class App extends Component {
	constructor() {
		super();
		this.state = {
			account: null,
			project: null,
            adminChain: null,
			loading: true,
			web3: null,
            unAuthorisedUser: false,
            currentUsername: null,
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
			window.alert('Project contract not deployed to detected network.');
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

        await this.checkUserRole(accounts[0], this.state.project, this.state.adminChain, web3);
	}

    async checkUserRole(_account, _project, _adminChain, _web) {
        const adminData = await _adminChain.methods.getAdminInfo().call({ from: _account }).then((response) => {
            return response;
        });

        if (_account === adminData._walletAddress) {
            this.setState({ loading: false, currentUsername: adminData._username });
            return;
        }

        const users = await _project.methods.getAllUsers().call().then((response) => {
            return response;
        });
        if (users.length > 0) {
            const userInfo = await _project.methods.getUserInfo(_account).call().then((response) => {
                return { username: response._username, walletAddress: response._walletAddress };
            });
            if (userInfo.walletAddress === _account) {
                this.setState({ loading: false, currentUsername: userInfo.username });
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
                        currentUsername={this.state.currentUsername}
						web3={this.state.web3}
					/>
				</React.Fragment>
			);
		} else {
			return <Loader unAuthorisedUser={this.state.unAuthorisedUser}></Loader>;
		}
	}
}

export default App;
