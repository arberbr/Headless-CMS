import React, { Component } from 'react';
import Swal from 'sweetalert2';

import validateEmail from '../utils/validateEmail';

class EditProfile extends Component {
	state = {
		fullname: '',
		email: '',
		bio: '',
		github: '',
		website: ''
	};

	componentDidMount() {
		this.loadUserData();
	}

	loadUserData = () => {
		const graphqlQuery = {
			query: `
				query FetchUser($id: ID!) {
					user(id: $id) {
						_id
						fullname
						email
						bio
						github
						website
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
				'Content-Type': 'application/json',
				Authorization: this.props.token
			},
			body: JSON.stringify(graphqlQuery)
		})
			.then(res => {
				return res.json();
			})
			.then(resData => {
				if (resData.errors) {
					throw new Error('Fetching user data failed!');
				}
				this.setState({
					fullname: resData.data.user.fullname,
					email: resData.data.user.email,
					bio: resData.data.user.bio,
					github: resData.data.user.github,
					website: resData.data.user.website
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

	submitHandler = (event, userData) => {
		event.preventDefault();

		if (!validateEmail(userData.email)) {
			Swal.fire({
				title: 'Error!',
				text: 'Enter a valid E-Mail address!',
				type: 'error',
				confirmButtonText: 'Ok'
			});
			return;
		}

		const graphqlQuery = {
			query: `
				mutation UpdateUser($userId: ID!, $fullname: String!, $email: String!, $bio: String, $github: String, $website: String) {
					updateUser(userId: $userId, userInput: {
						fullname: $fullname,
						email: $email,
						bio: $bio,
						github: $github,
						website: $website
					}) {
						fullname
						email
					}
				}
			`,
			variables: {
				userId: this.props.userId,
				fullname: userData.fullname,
				email: userData.email,
				bio: userData.bio,
				github: userData.github,
				website: userData.website
			}
		};

		fetch(process.env.REACT_APP_BACKEND_URI, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: this.props.token
			},
			body: JSON.stringify(graphqlQuery)
		})
			.then(res => {
				return res.json();
			})
			.then(resData => {
				if (resData.errors) {
					throw new Error('Failed to update user!');
				}
				Swal.fire({
					title: 'Success!',
					text: 'User updated!',
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
					<h1>Edit Profile</h1>
					<form
						method="POST"
						action=""
						onSubmit={event =>
							this.submitHandler(event, {
								fullname: this.state.fullname,
								email: this.state.email,
								bio: this.state.bio,
								github: this.state.github,
								website: this.state.website
							})
						}
					>
						<div>
							<label htmlFor="fullname">
								Fullname <span className="required">*</span>
							</label>
							<input
								type="text"
								name="fullname"
								id="fullname"
								required
								defaultValue={this.state.fullname}
								onChange={event =>
									this.handleInputChanger(event, 'fullname')
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
								defaultValue={this.state.email}
								onChange={event =>
									this.handleInputChanger(event, 'email')
								}
							/>
						</div>
						<div>
							<label htmlFor="bio">Bio</label>
							<textarea
								name="bio"
								id="bio"
								value={this.state.bio}
								onChange={event =>
									this.handleInputChanger(event, 'bio')
								}
							/>
						</div>
						<div>
							<label htmlFor="github">Github</label>
							<input
								type="url"
								name="github"
								id="github"
								placeholder="https://github.com/<username>"
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
								placeholder="https://example.com"
								defaultValue={this.state.website}
								onChange={event =>
									this.handleInputChanger(event, 'website')
								}
							/>
						</div>
						<button type="submit">Update User</button>
					</form>
				</div>
			</div>
		);
	}
}

export default EditProfile;
