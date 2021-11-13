import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
	Grid,
	TextField,
	withStyles,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Button,
	FormHelperText,
} from '@material-ui/core';
import { useSpring, animated } from 'react-spring';
import styled from 'styled-components';
import { MdClose } from 'react-icons/md';
import useForm from './useForm';

const Background = styled.div`
	width: 100%;
	height: 100%;
	position: fixed;
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	margin-top: 150px;
`;

const ModalWrapper = styled.div`
	width: 800px;
	height: 500px;
	box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
	background: #fff;
	color: #000;
	display: grid;
	grid-template-columns: 1fr 1fr;
	position: relative;
	z-index: 10;
	border-radius: 10px;
`;

const ModalImg = styled.img`
	width: 100%;
	height: 100%;
	border-radius: 10px 0 0 10px;
	background: #000;
`;

const ModalContent = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	line-height: 1.8;
	color: #141414;

	p {
		margin-bottom: 1rem;
	}

	button {
		padding: 10px 24px;
		background: #141414;
		color: #fff;
		border: none;
	}
`;

const CloseModalButton = styled(MdClose)`
	cursor: pointer;
	position: absolute;
	top: 20px;
	right: 20px;
	width: 32px;
	height: 32px;
	padding: 0;
	z-index: 10;
`;

/********************************************/

 const initialFieldValues = {
	fullName: '',
	mobile: '',
	email: '',
	age: '',
	bloodGroup: '',
	address: '',
};

export const AddProjectModal = ({ showModal, setShowModal }) => {
	const validate = (fieldValues = values) => {
		let temp = { ...errors };
		if ('fullName' in fieldValues)
			temp.fullName = fieldValues.fullName ? '' : 'This field is required.';
		if ('mobile' in fieldValues)
			temp.mobile = fieldValues.mobile ? '' : 'This field is required.';
		if ('bloodGroup' in fieldValues)
			temp.bloodGroup = fieldValues.bloodGroup ? '' : 'This field is required.';
		if ('email' in fieldValues)
			temp.email = /^$|.+@.+..+/.test(fieldValues.email)
				? ''
				: 'Email is not valid.';
		setErrors({
			...temp,
		});

		if (fieldValues == values) return Object.values(temp).every((x) => x == '');
	};

	const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
		useForm(initialFieldValues, validate);

	//material-ui select
	const inputLabel = React.useRef(null);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (validate()) {
			const onSuccess = () => {
				resetForm();
			};
		}
	};

	const modalRef = useRef();
	const animation = useSpring({
		config: {
			duration: 250,
		},
		opacity: showModal ? 1 : 0,
		transform: showModal ? `translateY(0%)` : `translateY(-100%)`,
	});

	const closeModal = (e) => {
		if (modalRef.current === e.target) {
			setShowModal(false);
		}
	};

	const keyPress = useCallback(
		(e) => {
			if (e.key === 'Escape' && showModal) {
				setShowModal(false);
				console.log('I pressed');
			}
		},
		[setShowModal, showModal]
	);

	useEffect(() => {
		document.addEventListener('keydown', keyPress);
		return () => document.removeEventListener('keydown', keyPress);
	}, [keyPress]);

	return (
		<>
			{showModal ? (
				<Background onClick={closeModal} ref={modalRef}>
					<animated.div style={animation}>
						<ModalWrapper showModal={showModal}>
							<ModalContent>
								<form autoComplete="off" noValidate onSubmit={handleSubmit}>
									<Grid container>
										<Grid item xs={6}>
											<TextField
												name="fullName"
												variant="outlined"
												label="Full Name"
												value={values.fullName}
												onChange={handleInputChange}
												{...(errors.fullName && {
													error: true,
													helperText: errors.fullName,
												})}
											/>
											<TextField
												name="email"
												variant="outlined"
												label="Email"
												value={values.email}
												onChange={handleInputChange}
												{...(errors.email && {
													error: true,
													helperText: errors.email,
												})}
											/>
											<FormControl
												variant="outlined"
												{...(errors.bloodGroup && { error: true })}
											>
												<InputLabel ref={inputLabel}>Blood Group</InputLabel>
												<Select
													name="bloodGroup"
													value={values.bloodGroup}
													onChange={handleInputChange}
												>
													<MenuItem value="">Select Blood Group</MenuItem>
													<MenuItem value="A+">A +ve</MenuItem>
													<MenuItem value="A-">A -ve</MenuItem>
													<MenuItem value="B+">B +ve</MenuItem>
													<MenuItem value="B-">B -ve</MenuItem>
													<MenuItem value="AB+">AB +ve</MenuItem>
													<MenuItem value="AB-">AB -ve</MenuItem>
													<MenuItem value="O+">O +ve</MenuItem>
													<MenuItem value="O-">O -ve</MenuItem>
												</Select>
												{errors.bloodGroup && (
													<FormHelperText>{errors.bloodGroup}</FormHelperText>
												)}
											</FormControl>
										</Grid>
										<Grid item xs={6}>
											<TextField
												name="mobile"
												variant="outlined"
												label="Mobile"
												value={values.mobile}
												onChange={handleInputChange}
												{...(errors.mobile && {
													error: true,
													helperText: errors.mobile,
												})}
											/>
											<TextField
												name="age"
												variant="outlined"
												label="Age"
												value={values.age}
												onChange={handleInputChange}
											/>
											<TextField
												name="address"
												variant="outlined"
												label="Address"
												value={values.address}
												onChange={handleInputChange}
											/>
											<div>
												<Button
													variant="contained"
													color="primary"
													type="submit"
												>
													Submit
												</Button>
												<Button variant="contained" onClick={resetForm}>
													Reset
												</Button>
											</div>
										</Grid>
									</Grid>
								</form>
							</ModalContent>
							<CloseModalButton
								aria-label="Close modal"
								onClick={() => setShowModal((prev) => !prev)}
							/>
						</ModalWrapper>
					</animated.div>
				</Background>
			) : null}
		</>
	);
};
