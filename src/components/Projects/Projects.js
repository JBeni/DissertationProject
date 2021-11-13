import React, { useState } from 'react';
import styled from 'styled-components';
import AddProjectModal from './AddProjectModal';

export default function Projects(props) {
	const [open, setOpen] = useState(false);

	function handleClickOpen() {
		setOpen({ open: true });
	}

	const handleClose = (event, reason) => {
		if (reason === 'backdropClick') {
			return false;
		}
		setOpen({ open: false });
	};

	return (
		<div className="App">
			{/* <Container>
				<Button onClick={openModal}>I'm a modal</Button>
				<AddProjectModal showModal={showModal} setShowModal={setShowModal} />
			</Container> */}

			<br />
			<br />

            <AddProjectModal account={props.account} project={props.project} web3={props.web3} />

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
