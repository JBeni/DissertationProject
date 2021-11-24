import React, { Component } from 'react';
import Navbar from './components/Navbar/Navbar';
import Web3 from 'web3';
import Loader from './components/Views/Loader';

// ABI Folder to Interact with Smart Contracts
import ProjectChain from './abis/ProjectChain.json';

class App extends Component {
	constructor() {
		super();
		this.state = {
			account: null,
			project: null,
			loading: true,
			web3: null,
            isUserInBlockchain: false,
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
            // const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

            window.ethereum.on('accountsChanged', function (accounts) {
                window.location.reload();
            });
            window.ethereum.on('disconnect', function (accounts) {
                console.log('Disconnected');
            });

            window.web3 = new Web3(window.ethereum);
		} else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider);
		} else {
			window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
		}
	}

	async loadBlockChain() {
		const web3 = window.web3;
        const networkId = await web3.eth.net.getId();
		const networkData = ProjectChain.networks[networkId];
		if (networkData) {
			const project = new web3.eth.Contract(
				ProjectChain.abi,
				networkData.address
			);

            /**
             * eth.getAccounts() returns the address values in the format expected by the MetaMask
             * 
             * The eth_requestAccounts return the address with lowercase, therefore, IS NOT OKAY
             */
            const accounts = await web3.eth.getAccounts();
			this.setState({
				project: project,
                account: accounts[0],
				web3: web3,
			});

            await this.checkUserInBlockchain(this.state.account, project, web3);
		} else {
			window.alert('Project contract not deployed to detected network.');
		}
	}

    async checkUserInBlockchain(_account, _project, _web) {
        const users = await _project.methods.getAllUsers().call().then((result) => {
            return result;
        });
        if (users.length > 0) {
            const userInfo = await _project.methods.getUserInfo(_account).call().then((result) => {
                return { username: result._username, walletAddress: result._walletAddress };
            });
            if (userInfo.walletAddress === _account) {
                this.setState({ isUserInBlockchain: true, loading: false });
            }
        }
    }

	render() {
		if (this.state.loading === false) {
            return (
				<React.Fragment>
					<Navbar
						account={this.state.account}
						project={this.state.project}
						web3={this.state.web3}
					/>
				</React.Fragment>
			);
		} else {
			return <Loader isLoading={this.state.loading} isUserInBlockchain={this.state.isUserInBlockchain}></Loader>;
		}
	}
}

export default App;
