import React, { Component } from 'react';
import Swal from 'sweetalert2';

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
		const graphqlQuery = {
			query: `
				query FetchUserSocials($id: ID!) {
					user(id: $id) {
						socials {
							github
							website
							linkedin
							facebook
							stackoverflow
						}
					}
				}
			`,
			variables: {
				id: this.props.userId
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
					throw new Error('Could not fetch User Social Profiles!');
				}

				console.log(resData);

				this.setState({
					github: resData.data.user.socials.github,
					website: resData.data.user.socials.website,
					linkedin: resData.data.user.socials.linkedin,
					facebook: resData.data.user.socials.facebook,
					stackoverflow: resData.data.user.socials.stackoverflow
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

	submitHandler = (event, userSocials) => {
		event.preventDefault();

		const graphqlQuery = {
			query: `
				mutation UpdateUserSocials($userId: ID!, $github: String, $website: String, $linkedin: String, $facebook: String, $stackoverflow: String) {
					updateUserSocials(userId: $userId, userSocials: {
						github: $github,
						website: $website,
						linkedin: $linkedin,
						facebook: $facebook,
						stackoverflow: $stackoverflow
					})
					
				}
			`,
			variables: {
				userId: this.props.userId,
				github: userSocials.github,
				website: userSocials.website,
				linkedin: userSocials.linkedin,
				facebook: userSocials.facebook,
				stackoverflow: userSocials.stackoverflow
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
					throw new Error('Could not update User Social Profiles!');
				}

				Swal.fire({
					title: 'Success!',
					text: 'User Social Profiles updated!',
					type: 'success',
					confirmButtonText: 'Ok'
				}).then(() => {
					this.props.history.replace('/account');
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
