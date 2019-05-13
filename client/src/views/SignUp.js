import React, { Component } from 'react';

class SignUp extends Component {
	state = {
		email: '',
		fullname: '',
		password: ''
	};

	handleInputChanger = (event, element) => {
		this.setState({
			[element]: event.target.value
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
								email: this.state.email,
								fullname: this.state.fullname,
								password: this.state.password
							})
						}
					>
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
							<input
								type="password"
								name="password"
								id="password"
								required
								onChange={event =>
									this.handleInputChanger(event, 'password')
								}
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
