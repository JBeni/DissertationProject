import React from 'react';
import '../Styles/Register.css';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

export const roleDropdownOptions = [
	{ id: "1", value: 'DefaultRole', label: 'DefaultRole' },
	{ id: "2", value: 'ProjectInitiator', label: 'ProjectInitiator' },
	{ id: "3", value: 'CompanyBuilder', label: 'CompanyBuilder' },
	{ id: "4", value: 'ProjectSupervisor', label: 'ProjectSupervisor' },
];

export default class AddUserModal extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			formValues: {
				FirstName: '',
				LastName: '',
				Email: '',
				Role: '',
				WalletAddress: '',
			},
			formErrors: {
				FirstName: '',
				LastName: '',
				Email: '',
				Role: '',
				WalletAddress: '',
			},
			formValidity: {
				FirstName: false,
				LastName: false,
				Email: false,
				Role: false,
				WalletAddress: false,
			},
			isSubmitting: false,
			open: false,
			selectedOption: '',
            isEdit: false,
		};
	}

	handleClickOpen = () => {
        console.log(this.props.userData);
        if (this.props.userData === undefined) {
            this.setState({
                formValues: {
                    FirstName: '',
                    LastName: '',
                    Email: '',
                    Role: '',
                    WalletAddress: '',
                },
                formErrors: {
                    FirstName: '',
                    LastName: '',
                    Email: '',
                    Role: '',
                    WalletAddress: '',
                },
                formValidity: {
                    FirstName: false,
                    LastName: false,
                    Email: false,
                    Role: false,
                    WalletAddress: false,
                },
                selectedOption: '',
                isEdit: false,
            });
        } else {
            this.setState({ isEdit: true });
        }
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

	handleValidation = (target) => {
		const { name, value } = target;
		const fieldValidationErrors = this.state.formErrors;
		const validity = this.state.formValidity;

		const isEmail = name === 'Email';
		const isWalletAddress = name === 'WalletAddress';
		const emailTest = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
		const walletTest = /^(0x)?[0-9a-f]{40}$/i;

		validity[name] = value.length > 0;
		fieldValidationErrors[name] = validity[name]
			? ''
			: `This field is required.`;

		if (validity[name]) {
			if (isEmail) {
				validity[name] = emailTest.test(value);
				fieldValidationErrors[name] = validity[name]
					? ''
					: `This field should be a valid email address`;
			}
			if (isWalletAddress) {
				validity[name] = walletTest.test(value);
				fieldValidationErrors[name] = validity[name]
					? ''
					: `This field should be a valid wallet address`;
			}
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
				formValues['Role'],
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
        await this.props.project.methods
			.registerUser(
                _username,
                _email,
                _firstname,
                _lastname,
                Number(role),
                walletAddress
			)
			.send({ from: this.props.account });
	};

	render() {
		const { formValues, formErrors, isSubmitting, open } = this.state;

		return (
			<div>
                <Button variant="outlined" onClick={this.handleClickOpen}>
					Add New User
				</Button>

				<Dialog
					open={open}
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
												required
                                                disabled = {(this.state.isEdit) ? "disabled" : ""}
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
												required
                                                disabled = {(this.state.isEdit) ? "disabled" : ""}
											/>
											<div className="error">{formErrors.LastName}</div>
										</div>

										<div>
											<select
                                                name="Role"
												className="input-field react-select"
												onChange={this.handleChange}
												value={formValues.Role}
											>
                                                <option key={0} value="">
                                                    Select an option...
                                                </option>
                                                {roleDropdownOptions.map((item) => (
                                                    <option key={item.id} value={item.id}>
                                                        {item.value}
                                                    </option>
                                                ))}
                                                </select>
											<div className="react-select-error">
												{formErrors.Role}
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
												required
                                                disabled = {(this.state.isEdit) ? "disabled" : ""}
											/>
											<div className="error">{formErrors.Email}</div>
										</div>

										<div className="input-field">
											<i className="fas fa-lock"></i>
											<input
												type="text"
												name="WalletAddress"
												placeholder="Wallet Address"
												onChange={this.handleChange}
												value={formValues.WalletAddress}
												required
                                                disabled = {(this.state.isEdit) ? "disabled" : ""}
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
