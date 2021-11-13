import React from 'react';
import styled from 'styled-components';
import { NFTCard } from './NFTCard';
import { useState, useEffect } from 'react';
import { NFTModal } from './NFTModal';
import { ethers } from 'ethers';
import { AddProjectModal } from './AddProjectModal';
const axios = require('axios');

function Projects() {
	let initialNfts = [
		{
			name: 'Mario',
			symbol: 'SMWC',
			copies: 10,
			image: 'https://via.placeholder.com/150',
		},
		{
			name: 'Luigi',
			symbol: 'SMWC',
			copies: 10,
			image: 'https://via.placeholder.com/150',
		},
		{
			name: 'Yoshi',
			symbol: 'SMWC',
			copies: 10,
			image: 'https://via.placeholder.com/150',
		},
		{
			name: 'Donkey Kong',
			symbol: 'SMWC',
			copies: 10,
			image: 'https://via.placeholder.com/150',
		},
		{
			name: 'Mario',
			symbol: 'SMWC',
			copies: 10,
			image: 'https://via.placeholder.com/150',
		},
		{
			name: 'Luigi',
			symbol: 'SMWC',
			copies: 10,
			image: 'https://via.placeholder.com/150',
		},
		{
			name: 'Yoshi',
			symbol: 'SMWC',
			copies: 10,
			image: 'https://via.placeholder.com/150',
		},
		{
			name: 'Donkey Kong',
			symbol: 'SMWC',
			copies: 10,
			image: 'https://via.placeholder.com/150',
		},
	];

	const [open, setOpen] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [selectedNft, setSelectedNft] = useState();
	const [nfts, setNfts] = useState(initialNfts);

	const openModal = () => {
		setShowModal((prev) => !prev);
	};

	function handleClickOpen() {
		setOpen({ open: true });
	}

	const handleClose = (event, reason) => {
		if (reason === 'backdropClick') {
			return false;
		}
		setOpen({ open: false });
	};

	useEffect(() => {
		(async () => {
			// const address = await connect();
			// if (address) {
			// 	getNfts(address);
			// }
		})();
	}, []);

	function toggleModal(i) {
		if (i >= 0) {
			setSelectedNft(nfts[i]);
		}
		setShowModal(!showModal);
	}

	async function getMetadataFromIpfs(tokenURI) {
		let metadata = await axios.get(tokenURI);
		return metadata.data;
	}

	async function getNfts(address) {
		const rpc = 'https://rpc-mumbai.maticvigil.com/'; // Alchemy
		const ethersProvider = new ethers.providers.JsonRpcProvider(rpc);

		let abi = [
			'function symbol() public view returns(string memory)',
			'function tokenCount() public view returns(uint256)',
			'function uri(uint256 _tokenId) public view returns(string memory)',
			'function balanceOfBatch(address[] accounts, uint256[] ids) public view returns(uint256[])',
		];

		let nftCollection = new ethers.Contract(
			'0x3E61Da0499AF0ED9eF2BDDe18F6ae5998af14f68',
			abi,
			ethersProvider
		);

		let numberOfNfts = (await nftCollection.tokenCount()).toNumber();
		let collectionSymbol = await nftCollection.symbol();

		let accounts = Array(numberOfNfts).fill(address);
		let ids = Array.from({ length: numberOfNfts }, (_, i) => i + 1);
		let copies = await nftCollection.balanceOfBatch(accounts, ids);

		let tempArray = [];
		let baseUrl = '';

		for (let i = 1; i <= numberOfNfts; i++) {
			if (i === 1) {
				let tokenURI = await nftCollection.uri(i);
				baseUrl = tokenURI.replace(/\d+.json/, '');
				let metadata = await getMetadataFromIpfs(tokenURI);
				metadata.symbol = collectionSymbol;
				metadata.copies = copies[i - 1];
				tempArray.push(metadata);
			} else {
				let metadata = await getMetadataFromIpfs(baseUrl + `${i}.json`);
				metadata.symbol = collectionSymbol;
				metadata.copies = copies[i - 1];
				tempArray.push(metadata);
			}
		}
		setNfts(tempArray);
	}

	const inputRefs = React.useRef([React.createRef(), React.createRef()]);

	const [data, setData] = React.useState({});

	const handleChange = (name, value) => {
		setData((prev) => ({ ...prev, [name]: value }));
	};

	const submitForm = (e) => {
		e.preventDefault();
		let isValid = true;
		for (let i = 0; i < inputRefs.current.length; i++) {
			const valid = inputRefs.current[i].current.validate();
			console.log(valid);
			if (!valid) {
				isValid = false;
			}
		}

		if (!isValid) {
			return;
		}
	};

	return (
		<div className="App">
			<Container>
				<Button onClick={openModal}>I'm a modal</Button>
				<AddProjectModal showModal={showModal} setShowModal={setShowModal} />
			</Container>

			<br />
			<br />
			<br />
			<br />

			<Container>
				<Title> Super Mario World Collection </Title>
				<Subtitle> The rarest and best of Super Mario World </Subtitle>
				{/* <Grid>
					{nfts.map((nft, i) => (
						<NFTCard nft={nft} key={i} toggleModal={() => toggleModal(i)} />
					))}
				</Grid> */}
			</Container>
			{/* {showModal && (
				<NFTModal nft={selectedNft} toggleModal={() => toggleModal()} />
			)} */}
		</div>
	);
}

const Button = styled.button`
	min-width: 100px;
	padding: 16px 32px;
	border-radius: 4px;
	border: none;
	background: #141414;
	color: #fff;
	font-size: 24px;
	cursor: pointer;
`;

const Title = styled.h1`
	margin: 0;
	text-align: center;
`;

const Subtitle = styled.h4`
	color: gray;
	margin-top: 0;
	text-align: center;
`;

const Container = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 70%;
	max-width: 1200px;
	margin: auto;
	margin-top: 100px;
`;

const Grid = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr;
	row-gap: 40px;

	@media (max-width: 1200px) {
		grid-template-columns: 1fr 1fr 1fr;
	}

	@media (max-width: 900px) {
		grid-template-columns: 1fr 1fr;
	}

	@media (max-width: 600px) {
		grid-template-columns: 1fr;
	}
`;

export default Projects;
