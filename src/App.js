import React, { Component } from 'react';
import Navbar from './components/Navbar/Navbar';
import Web3 from 'web3';
import Project from './abis/Project.json';

class App extends Component {
	constructor() {
		super();
		this.state = {
			account: null,
			project: null,
			identicon: null,
			loading: true,
			web3: null,
		};
	}
	async componentWillMount() {
		this.loadWeb3();
		this.loadBlockChain();
	}

	async loadWeb3() {
		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum);
			// await window.ethereum.enable();
		} else if (window.web3) {
			// window.web3 = new Web3(window.web3.currentProvider);
		} else {
			window.alert(
				'Non-Ethereum browser detected. You should consider trying MetaMask!'
			);
		}
	}

	handleInputChange = (e) => {
		this.setState({
			[e.target.id]: e.target.value,
		});
	};

	async loadBlockChain() {
		const web3 = window.web3;

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

		this.setState({ account: accounts[0] });
		const networkId = await web3.eth.net.getId();
		const networkData = Project.networks[networkId];
		if (networkData) {
			const project = new web3.eth.Contract(
				Project.abi,
				networkData.address
			);
			this.setState({
				project: project,
				loading: false,
				web3: web3,
			});
			console.log(this.state.project);
		} else {
			window.alert('Project chain contract not deployed to detected network.');
		}
	}

    async getUsername() {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
		const networkData = Project.networks[networkId];

        const project = new web3.eth.Contract(
            Project.abi,
            networkData.address
        );
        
        // let data = await this.state.project.methods.getUserInfo(accounts[0]).call();
        // console.log(data);
    }


	render() {

        console.log(this.getUsername());

		return (
			<React.Fragment>
				<Navbar account={this.state.account} project={this.state.project} web3={this.state.web3} />
			</React.Fragment>
		);
	}
}

export default App;
