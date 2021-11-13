import React from 'react';
import '../Styles/AddProjectModal.css';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

export default class AddProjectModal extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			formValues: {
				Name: '',
				Description: '',
			},
			formErrors: {
				Name: '',
				Description: '',
			},
			formValidity: {
				Name: false,
				Description: false,
			},
			isSubmitting: false,
			open: false,
		};
	}

	handleClickOpen = () => {
        this.setState({
            formValues: {
                Name: '',
                Description: '',
            },
            formErrors: {
                Name: '',
                Description: '',
            },
            formValidity: {
                Name: false,
                Description: false,
            }
        });
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

		// const isName = name === 'Name';
		// const isDescription = name === 'Description';

		validity[name] = value.length > 0;
		fieldValidationErrors[name] = validity[name]
			? ''
			: `This field is required.`;

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

			this.createProject(
				formValues['Name'],
				formValues['Description']
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

	createProject = async (_name, _description) => {
		await this.props.project.methods
			.createProject(_name, _description)
			.send({ from: this.props.account });
	};

	render() {
		const { formValues, formErrors, isSubmitting, open } = this.state;

        return (
			<div className="container">
				<Button variant="outlined" onClick={this.handleClickOpen}>
					Add New Project
				</Button>

				<Dialog open={open} onClose={this.handleClose}>
					<div className="wrapper">
						<div className="title">Registration Form</div>
						<DialogContent>
							<div className="form">
								<div className="inputfield">
									<label>Name</label>
									<input
										type="text"
										className="input"
										name="Name"
										placeholder="Project Name"
										onChange={this.handleChange}
										value={formValues.Name}
										// required
									/>
								</div>
								<div className="error">{formErrors.Name}</div>

								<div className="inputfield">
									<label>Last Name</label>
									<textarea className="textarea"
                                        name="Description"
										placeholder="Project Description"
										onChange={this.handleChange}
										value={formValues.Description}
										// required
                                    ></textarea>
								</div>
								<div className="error">{formErrors.Description}</div>

								<div className="inputfield">
									<label>Password</label>
									<input type="password" className="input" />
								</div>
								<div className="inputfield">
									<label>Confirm Password</label>
									<input type="password" className="input" />
								</div>
								<div className="inputfield">
									<label>Gender</label>
									<div className="custom_select">
										<select>
											<option value="">Select</option>
											<option value="male">Male</option>
											<option value="female">Female</option>
										</select>
									</div>
								</div>
								<div className="inputfield">
									<label>Email Address</label>
									<input type="text" className="input" />
								</div>
								<div className="inputfield">
									<label>Phone Number</label>
									<input type="text" className="input" />
								</div>
								<div className="inputfield">
									<label>Address</label>
									<textarea className="textarea"></textarea>
								</div>
								<div className="inputfield">
									<label>Postal Code</label>
									<input type="text" className="input" />
								</div>
							</div>
						</DialogContent>
						<DialogActions>
							<Button onClick={this.handleClose}>Close</Button>
							<Button type="submit" onClick={this.handleSubmit}>
								{isSubmitting ? 'Please wait...' : 'Submit'}
							</Button>
						</DialogActions>
					</div>
				</Dialog>
			</div>
		);
	}
}
