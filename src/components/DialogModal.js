import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import './Admin/Register.css';

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
                WalletAddress: ''
            },
            formErrors: {
                FirstName: '',
                LastName: '',
                Email: '',
                Role: '',
                WalletAddress: ''
            },
            formValidity: {
                FirstName: false,
                LastName: false,
                Email: false,
                Role: false,
                WalletAddress: false
            },
            isSubmitting: false,
            open: false
        };
    }

	handleClickOpen = () => {
		this.setState({ open: true });
	};

	handleClose = (event, reason) => {
        if (reason === "backdropClick") {
            return false;
        }
        // if (reason === "escapeKeyDown") {
        //     return false;
        // }

        // if (typeof onClose === "function") {
        //     // onClose();
        // }
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
			alert('Form is validated! Submitting the form...');
			this.setState({ isSubmitting: false });

            this.getUsername(formValues['FirstName'], 1, formValues['WalletAddress']);
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

    handleInputChange = (e) => {
        //setAddress(e.target.value);
    }

    getUsername = (userName, role, walletAddress) => {
        let data = this.props.project.methods
            .registerUser(userName, Number(role), walletAddress).send({from: this.props.account });
                // .once('receipt', async (receipt) => {
                //     console.log(receipt);
                // });
        console.log(data);
    }

    render() {
        const { formValues, formErrors, isSubmitting, open } = this.state;

        return (
            <div>
                <Button variant="outlined" onClick={ this.handleClickOpen }>
                    Add New User
                </Button>

                <Dialog
                    open={ open }
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={ this.handleClose }
                >
                    <DialogContent>
                        <div className="container">
                            <div className="forms-container">
                                <div className="signin-signup">
                                    <form className="sign-up-form" onSubmit={this.handleSubmit}>
                                        <h2 className="title">Sign up</h2>
                                        <div className="input-field">
                                            <i className="fas fa-user"></i>
                                            <input type="text" name="FirstName" placeholder="First Name" 
                                                onChange={this.handleChange}
                                                value={formValues.FirstName}
                                                // required
                                            />
                                            <div className="error">{formErrors.FirstName}</div>
                                        </div>
                                        <div className="input-field">
                                            <i className="fas fa-user"></i>
                                            <input type="text" name="LastName" placeholder="Last Name"
                                                onChange={this.handleChange}
                                                value={formValues.LastName}
                                                //required
                                            />
                                            <div className="error">{formErrors.LastName}</div>
                                        </div>
                                        <div className="input-field">
                                            <i className="fas fa-envelope"></i>
                                            <input type="" name="Email" placeholder="Email"
                                                onChange={this.handleChange}
                                                value={formValues.Email}
                                                //required
                                            />
                                            <div className="error">{formErrors.Email}</div>
                                        </div>
                                        <div className="input-field">
                                            <i className="fas fa-envelope"></i>
                                            <input type="text" name="Role" placeholder="Role"
                                                onChange={this.handleChange}
                                                value={formValues.Role}
                                                //required
                                            />
                                            <div className="error">{formErrors.Role}</div>
                                        </div>
                                        <div className="input-field">
                                            <i className="fas fa-lock"></i>
                                            <input type="text" name="WalletAddress" placeholder="Wallet Address"
                                                onChange={this.handleChange}
                                                value={formValues.WalletAddress}
                                                // required
                                            />
                                            <div className="error">{formErrors.WalletAddress}</div>
                                        </div>
                                        <br />
                                        {/* <button type="submit" disabled={isSubmitting} className="btn">
                                            {isSubmitting ? "Please wait..." : "Submit"}
                                        </button> */}
                                    </form>
                                </div>
                            </div>
                        </div>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={ this.handleClose }>Close</Button>
                        <Button type="submit" onClick={this.handleSubmit}>
                            {isSubmitting ? "Please wait..." : "Submit"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}
