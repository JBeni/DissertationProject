import React, { Component } from 'react';
import Navbar from './components/Navbar/Navbar';
import Web3 from 'web3';
import Project from './abis/Project.json';
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
	}
	async componentWillMount() {
		this.loadWeb3();
		this.loadBlockChain();
	}

	async loadWeb3() {
		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum);
			await window.ethereum.enable();
		} else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider);
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
		const accounts = await web3.eth.getAccounts();
		//console.log(accounts);

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
			//console.log(this.state.project);
		} else {
			window.alert('Project contract not deployed to detected network.');
		}
	}

	render() {
		if (this.state.loading === false) {

            // this.state.project.methods
			// 	.registerUser(
			// 		'userName',
			// 		Number(1),
			// 		'0x686d54a3b6B30db5AC94f97563d061dD09b8A2B2'
			// 	)
			// 	.send({ from: this.state.account });

            this.state.project.events.UserRegistered({fromBlock: 0, toBlock: 'latest'}).on('data', event => {
                console.log(event);
            });

            // let events = this.state.project.getPastEvents('UserRegistered', {fromBlock: 0, toBlock: 'latest'});
            // console.log('from the events');
            // console.log(events);

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
