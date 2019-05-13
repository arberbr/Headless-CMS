import React, { Component } from 'react';

class Login extends Component {
	state = {
		email: '',
		password: ''
	};

	handleInputChanger = (event, element) => {
		this.setState({
			[element]: event.target.value
		});
	};

	render() {
		return (
			<div className="page-login">
				<div className="form">
					<form
						method="POST"
						action=""
						onSubmit={event =>
							this.props.onLogin(event, {
								email: this.state.email,
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
						<button type="submit">Login</button>
					</form>
				</div>
			</div>
		);
	}
}

export default Login;
