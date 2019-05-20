import React, { Component } from 'react';
import Swal from 'sweetalert2';
import ReactPasswordStrength from 'react-password-strength';

class ChangePassword extends Component {
	state = {
		password: '',
		confirmPassword: '',
		passwordValid: false,
		passwordScore: ''
	};

	handleInputChanger = (event, element) => {
		this.setState({
			[element]: event.target.value
		});
	};

	handleChange = event => {
		this.setState({
			passwordValid: event.isValid,
			passwordScore: event.scores,
			password: event.password
		});
	};

	changePasswordHandler = (event, passwordChangeData) => {
		event.preventDefault();

		if (!passwordChangeData.passwordValid) {
			Swal.fire({
				title: 'Error!',
				text: 'Please use a hard-to-guess password!',
				type: 'error',
				confirmButtonText: 'Ok'
			});
			return;
		}

		if (
			passwordChangeData.password !== passwordChangeData.confirmPassword
		) {
			Swal.fire({
				title: 'Error!',
				text: 'Both passwords must match!',
				type: 'error',
				confirmButtonText: 'Ok'
			});
			return;
		}

		const graphqlQuery = {
			query: `
                mutation ChangePassword($newPassword: String!) {
                    changePassword(newPassword: $newPassword)
                }
            `,
			variables: {
				newPassword: passwordChangeData.password
			}
		};

		fetch(process.env.REACT_APP_BACKEND_URI, {
			method: 'POST',
			headers: {
				Authorization: this.props.token,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(graphqlQuery)
		})
			.then(res => {
				return res.json();
			})
			.then(resData => {
				if (resData.errors) {
					throw new Error('Password could not be changed!');
				}

				Swal.fire({
					title: 'Success!',
					text: 'Password changed!',
					type: 'success',
					confirmButtonText: 'Ok'
				});
			})
			.catch(error => {
				Swal.fire({
					title: 'Error!',
					text: error.message,
					type: 'error',
					confirmButtonText: 'Ok'
				});
			});
	};

	render() {
		return (
			<div className="page-change-password">
				<div className="card">
					<h1>Change Password</h1>
					<form
						method="POST"
						action=""
						onSubmit={event =>
							this.changePasswordHandler(event, {
								password: this.state.password,
								confirmPassword: this.state.confirmPassword,
								passwordValid: this.state.passwordValid
							})
						}
					>
						<div>
							<label htmlFor="password">
								Password <span className="required">*</span>
							</label>
							<ReactPasswordStrength
								className="password-strength-meter"
								minLength={8}
								minScore={3}
								scoreWords={[
									'very weak',
									'weak',
									'good',
									'strong',
									'very strong'
								]}
								changeCallback={event =>
									this.handleChange(event)
								}
								inputProps={{
									name: 'password'
								}}
							/>
						</div>
						<div>
							<label htmlFor="confirmPassword">
								Confirm Password{' '}
								<span className="required">*</span>
							</label>
							<input
								type="password"
								name="confirmPassword"
								id="confirmPassword"
								required
								onChange={event =>
									this.handleInputChanger(
										event,
										'confirmPassword'
									)
								}
							/>
						</div>
						<button type="submit">Change Password</button>
					</form>
				</div>
			</div>
		);
	}
}

export default ChangePassword;
