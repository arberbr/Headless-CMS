import React, { Component } from 'react';
import ReactPasswordStrength from 'react-password-strength';

class SignUp extends Component {
	state = {
		username: '',
		email: '',
		fullname: '',
		password: '',
		passwordScore: '',
		passwordValid: false
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

	render() {
		return (
			<div className="page-register">
				<div className="form">
					<form
						method="POST"
						action=""
						onSubmit={event =>
							this.props.onSignup(event, {
								username: this.state.username,
								email: this.state.email,
								fullname: this.state.fullname,
								password: this.state.password,
								passwordValid: this.state.passwordValid,
								passwordScore: this.state.passwordScore
							})
						}
					>
						<div>
							<label htmlFor="username">
								Username <span className="required">*</span>
							</label>
							<input
								type="text"
								name="username"
								id="username"
								required
								onChange={event =>
									this.handleInputChanger(event, 'username')
								}
							/>
						</div>
						<div>
							<label htmlFor="email">
								E-Mail <span className="required">*</span>
							</label>
							<input
								type="email"
								name="email"
								id="email"
								required
								onChange={event =>
									this.handleInputChanger(event, 'email')
								}
							/>
						</div>
						<div>
							<label htmlFor="fullname">
								Your Name <span className="required">*</span>
							</label>
							<input
								type="text"
								name="fullname"
								id="fullname"
								required
								onChange={event =>
									this.handleInputChanger(event, 'fullname')
								}
							/>
						</div>
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
						<button type="submit">Signup</button>
					</form>
				</div>
			</div>
		);
	}
}

export default SignUp;
