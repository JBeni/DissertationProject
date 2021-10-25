
import React from 'react';
import Web3 from 'web3';

class GetWeb3 extends React.Component {
	componentDidMount() {
		this.loadBlockchainData(this.props.dispatch);
	}

	web3Loaded(connection) {
		return {
			type: 'WEB3_LOADED',
			connection,
		};
	}

	web3AccountLoaded(account) {
		return {
			type: 'WEB3_ACCOUNT_LOADED',
			account,
		};
	}

	loadWeb3 = async () => {
		if (typeof window.ethereum !== 'undefined') {
			const web3 = new Web3(window.ethereum);
			(this.web3Loaded(web3));
			return web3;
		} else {
			window.alert('Please install MetaMask');
			window.location.assign('https://metamask.io/');
		}
	};

	loadAccount = async (web3) => {
		const accounts = await web3.eth.getAccounts();
		const account = await accounts[0];
		if (typeof account !== 'undefined') {
			(this.web3AccountLoaded(account));
			return account;
		} else {
			window.alert('Please login with MetaMask');
			return null;
		}
	};

	async loadBlockchainData() {
		const web3 = await this.loadWeb3();
		const networkId = await web3.eth.net.getId();
		await this.loadAccount(web3);
	}

    render() {
        return <div></div>;
    }
}

export default GetWeb3;
