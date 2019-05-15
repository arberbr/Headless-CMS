import React, { Component } from 'react';
import Swal from 'sweetalert2';

class EditProfile extends Component {
	state = {
		fullname: '',
		email: '',
		bio: '',
		avatar: ''
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
						avatar
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
					avatar: resData.data.user.avatar
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

		const graphqlQuery = {
			query: `
				mutation UpdateUser($userId: ID!, $fullname: String!, $email: String!, $bio: String, $avatar: String) {
					updateUser(userId: $userId, userInput: {
						fullname: $fullname,
						email: $email,
						bio: $bio,
						avatar: $avatar
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
				avatar: userData.avatar
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

	handleFilePicker = async event => {
		const files = event.target.files;
		const data = new FormData();
		data.append('file', files[0]);
		data.append('upload_preset', process.env.REACT_APP_CLOUDINARY_PRESET);
		const res = await fetch(process.env.REACT_APP_CLOUDINARY_UPLOAD, {
			method: 'POST',
			body: data
		});
		const file = await res.json();
		this.setState({
			avatar: file.secure_url
		});
	};

	render() {
		return (
			<div className="page-account">
				<div className="card">
					<h1>Editing Profile</h1>
					<form
						method="POST"
						action=""
						onSubmit={event =>
							this.submitHandler(event, {
								fullname: this.state.fullname,
								email: this.state.email,
								bio: this.state.bio,
								avatar: this.state.avatar
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
							<label htmlFor="avatar">Avatar</label>
							<input
								type="file"
								name="avatar"
								id="avatar"
								onChange={event => this.handleFilePicker(event)}
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
