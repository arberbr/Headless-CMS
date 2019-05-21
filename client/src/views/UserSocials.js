import React, { Component } from 'react';

class UserSocials extends Component {
	state = {
		github: '',
		website: '',
		linkedin: '',
		facebook: '',
		stackoverflow: ''
	};

	componentDidMount() {
		this.loadUserSocials();
	}

	loadUserSocials = () => {
		console.log('fired');
	};

	submitHandler = (event, userSocials) => {
		event.preventDefault();

		console.log('clicked');
	};

	handleInputChanger = (event, element) => {
		this.setState({
			[element]: event.target.value
		});
	};

	render() {
		return (
			<div className="page-account">
				<div className="card">
					<h1>User Socials</h1>
					<form
						method="POST"
						action=""
						onSubmit={event =>
							this.submitHandler(event, {
								github: this.state.github,
								website: this.state.website,
								linkedin: this.state.linkedin,
								facebook: this.state.facebook,
								stackoverflow: this.state.stackoverflow
							})
						}
					>
						<div>
							<label htmlFor="github">Github</label>
							<input
								type="url"
								name="github"
								id="github"
								required
								defaultValue={this.state.github}
								onChange={event =>
									this.handleInputChanger(event, 'github')
								}
							/>
						</div>

						<div>
							<label htmlFor="website">Website</label>
							<input
								type="url"
								name="website"
								id="website"
								required
								defaultValue={this.state.website}
								onChange={event =>
									this.handleInputChanger(event, 'website')
								}
							/>
						</div>
						<div>
							<label htmlFor="linkedin">LinkedIn</label>
							<input
								type="url"
								name="linkedin"
								id="linkedin"
								required
								defaultValue={this.state.linkedin}
								onChange={event =>
									this.handleInputChanger(event, 'linkedin')
								}
							/>
						</div>
						<div>
							<label htmlFor="facebook">Facebook</label>
							<input
								type="url"
								name="facebook"
								id="facebook"
								required
								defaultValue={this.state.facebook}
								onChange={event =>
									this.handleInputChanger(event, 'facebook')
								}
							/>
						</div>
						<div>
							<label htmlFor="stackoverflow">StackOverflow</label>
							<input
								type="url"
								name="stackoverflow"
								id="stackoverflow"
								required
								defaultValue={this.state.stackoverflow}
								onChange={event =>
									this.handleInputChanger(
										event,
										'stackoverflow'
									)
								}
							/>
						</div>
						<button type="submit">Update User Socials</button>
					</form>
				</div>
			</div>
		);
	}
}

export default UserSocials;
