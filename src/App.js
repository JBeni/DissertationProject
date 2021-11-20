import React, { Component } from 'react';
import Navbar from './components/Navbar';
import Web3 from 'web3';
import ProjectChain from './abis/ProjectChain.json';
import Loader from './components/Views/Loader';

class App extends Component {
	constructor() {
		super();
		this.state = {
			account: null,
			project: null,
			loading: true,
			web3: null,
		};

        this.initializeConnection();
    }

    async initializeConnection() {
        await this.loadWeb3();
		await this.loadBlockChain();
    }

    async loadWeb3() {
		if (window.ethereum) {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

            // window.ethereum.on('accountsChanged', function (accounts) {
            //     console.log(accounts);
            // });

            // console.log('accounts: ' + accounts);
            // console.log('changed_account: ' + changed_account);

            this.setState({ account: accounts[0] });
			window.web3 = new Web3(window.ethereum);
			//await window.ethereum.enable();
		} else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider);
		} else {
			window.alert(
				'Non-Ethereum browser detected. You should consider trying MetaMask!'
			);
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
			this.setState({
				project: project,
				loading: false,
				web3: web3,
			});
		} else {
			window.alert('Project contract not deployed to detected network.');
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
			return <Loader></Loader>;
		}
	}
}

export default App;
