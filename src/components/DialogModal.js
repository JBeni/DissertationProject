import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';

import './Admin/Register.css';
import Select from 'react-select';

const options = [
	{ id: 1, value: 'DefaultRole', label: 'DefaultRole' },
	{ id: 2, value: 'ProjectInitiator', label: 'ProjectInitiator' },
	{ id: 3, value: 'CompanyBuilder', label: 'CompanyBuilder' },
	{ id: 4, value: 'ProjectSupervisor', label: 'ProjectSupervisor' },
];

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default class DialogModal extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			formValues: {
				FirstName: '',
				LastName: '',
				Email: '',
				Role: '',
				WalletAddress: '',
				RoleDropdown: '',
			},
			formErrors: {
				FirstName: '',
				LastName: '',
				Email: '',
				Role: '',
				WalletAddress: '',
				RoleDropdown: '',
			},
			formValidity: {
				FirstName: false,
				LastName: false,
				Email: false,
				Role: true,
				WalletAddress: false,
				RoleDropdown: false,
			},
			isSubmitting: false,
			open: false,
			category: '',
			selectedOption: '',
		};
	}

	handleClickOpen = () => {
		this.setState({ open: true });
	};

	handleClose = (event, reason) => {
		if (reason === 'backdropClick') {
			return false;
		}
		this.setState({ open: false });
	};

	handleChange = ({ target }) => {
		const { formValues } = this.state;
		formValues[target.name] = target.value;
		this.setState({ formValues });
		this.handleValidation(target);
	};

	handleChangeDropdown = (selectedOption) => {
        const { formValues } = this.state;
        let roleValue = selectedOption.id;
		formValues['RoleDropdown'] = roleValue;
        this.setState({ formValues });
        this.setState({ selectedOption });

        const fieldValidationErrors = this.state.formErrors;
		const validity = this.state.formValidity;
        validity['RoleDropdown'] = roleValue > 0;
		fieldValidationErrors['RoleDropdown'] = validity['RoleDropdown']
			? ''
			: `This field is required.`;
	};

	handleValidation = (target) => {
		const { name, value } = target;
		const fieldValidationErrors = this.state.formErrors;
		const validity = this.state.formValidity;

		const isFirstName = name === 'FirstName';
		const isLastName = name === 'LastName';
		const isEmail = name === 'Email';
		const isRole = name === 'Role';
		const isWalletAddress = name === 'WalletAddress';

		const emailTest = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
		const walletTest = /^(0x)?[0-9a-f]{40}$/i;

		validity[name] = value.length > 0;
		fieldValidationErrors[name] = validity[name]
			? ''
			: `This field is required.`;

		if (validity[name]) {
			// if (isFirstName) {
			// 	validity[name] = value.length >= 3;
			// 	fieldValidationErrors[name] = validity[name]
			// 		? ''
			// 		: `This field should be 3 characters minimum`;
			// }
			// if (isLastName) {
			// 	validity[name] = value.length >= 3;
			// 	fieldValidationErrors[name] = validity[name]
			// 		? ''
			// 		: `This field should be 3 characters minimum`;
			// }
			// if (isEmail) {
			// 	validity[name] = emailTest.test(value);
			// 	fieldValidationErrors[name] = validity[name]
			// 		? ''
			// 		: `This field should be a valid email address`;
			// }
			// if (isWalletAddress) {
			// 	validity[name] = walletTest.test(value);
			// 	fieldValidationErrors[name] = validity[name]
			// 		? ''
			// 		: `This field should be a valid wallet address`;
			// }
		}

		this.setState({
			formErrors: fieldValidationErrors,
			formValidity: validity,
		});
	};

	handleSubmit = (event) => {
		event.preventDefault();
		this.setState({ isSubmitting: true });
		const { formValues, formValidity } = this.state;
		if (Object.values(formValidity).every(Boolean)) {
			// alert('Form is validated! Submitting the form...');
			this.setState({ isSubmitting: false });

			this.registerUser(
				formValues['FirstName'] + ' ' + formValues['LastName'],
				formValues['Email'],
				formValues['FirstName'],
				formValues['LastName'],
				formValues['RoleDropdown'],
				formValues['WalletAddress']
			);
		} else {
			for (let key in formValues) {
				let target = {
					name: key,
					value: formValues[key],
				};
				this.handleValidation(target);
			}
			this.setState({ isSubmitting: false });
		}
	};

	registerUser = async (_username, _email, _firstname, _lastname, role, walletAddress) => {
        const username = this.props.web3.utils.padRight(this.props.web3.utils.asciiToHex(_username), 64);
        const email = this.props.web3.utils.padRight(this.props.web3.utils.asciiToHex(_email), 64);
        const firstname = this.props.web3.utils.padRight(this.props.web3.utils.asciiToHex(_firstname), 64);
        const lastname = this.props.web3.utils.padRight(this.props.web3.utils.asciiToHex(_lastname), 64);

        await this.props.project.methods
			.registerUser(
                username,
                email,
                firstname,
                lastname,
                Number(role),
                walletAddress
			)
			.send({ from: this.props.account });
	};

	render() {
		const { formValues, formErrors, isSubmitting, open, selectedOption } = this.state;

		return (
			<div>
				<Button variant="outlined" onClick={this.handleClickOpen}>
					Add New User
				</Button>

				<Dialog
					open={open}
					TransitionComponent={Transition}
					keepMounted
					onClose={this.handleClose}
				>
					<DialogContent>
						<div className="container">
							<div className="forms-container">
								<div className="signin-signup">
									<form className="sign-up-form" onSubmit={this.handleSubmit}>
										<h2 className="title">Sign up</h2>
										<div className="input-field">
											<i className="fas fa-user"></i>
											<input
												type="text"
												name="FirstName"
												placeholder="First Name"
												onChange={this.handleChange}
												value={formValues.FirstName}
												// required
											/>
											<div className="error">{formErrors.FirstName}</div>
										</div>
										<div className="input-field">
											<i className="fas fa-user"></i>
											<input
												type="text"
												name="LastName"
												placeholder="Last Name"
												onChange={this.handleChange}
												value={formValues.LastName}
												//required
											/>
											<div className="error">{formErrors.LastName}</div>
										</div>

										<div>
											<Select
                                                name="RoleDropdown"
												className="react-select"
												onChange={this.handleChangeDropdown}
												options={options}
												value={selectedOption}
											/>
											<div className="react-select-error">
												{formErrors.RoleDropdown}
											</div>
										</div>

										<div className="input-field email-class">
											<i className="fas fa-envelope"></i>
											<input
												type=""
												name="Email"
												placeholder="Email"
												onChange={this.handleChange}
												value={formValues.Email}
												//required
											/>
											<div className="error">{formErrors.Email}</div>
										</div>

										{/* <div className="input-field">
											<i className="fas fa-envelope"></i>
											<input
												type="text"
												name="Role"
												placeholder="Role"
												onChange={this.handleChange}
												value={formValues.Role}
												//required
											/>
											<div className="error">{formErrors.Role}</div>
										</div> */}

										<div className="input-field">
											<i className="fas fa-lock"></i>
											<input
												type="text"
												name="WalletAddress"
												placeholder="Wallet Address"
												onChange={this.handleChange}
												value={formValues.WalletAddress}
												// required
											/>
											<div className="error">{formErrors.WalletAddress}</div>
										</div>
										<br />
									</form>
								</div>
							</div>
						</div>
					</DialogContent>

					<DialogActions>
						<Button onClick={this.handleClose}>Close</Button>
						<Button type="submit" onClick={this.handleSubmit}>
							{isSubmitting ? 'Please wait...' : 'Submit'}
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}
