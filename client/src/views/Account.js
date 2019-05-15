import React, { Component } from 'react';
import Swal from 'sweetalert2';

import UserDetails from '../components/Profile/UserDetails';
import UserPosts from '../components/Profile/UserPosts';

class Account extends Component {
	state = {
		fullname: '',
		email: '',
		posts: [],
		bio: '',
		avatar: ''
	};

	componentDidMount() {
		if (!this.props.userId) return;
		this.loadUserPosts();
	}

	onPostDeleteHandler = postId => {
		let graphqlQuery = {
			query: `
				mutation DeletePost($postId: ID!) {
					deletePost(postId: $postId)
				}
			`,
			variables: {
				postId: postId
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
					throw new Error('Deleting Post failed!');
				}
				this.loadUserPosts();
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

	loadUserPosts = () => {
		let graphqlQuery = {
			query: `
				query FetchUser($id: ID!) {
					user(id: $id) {
						fullname
						email
						posts {
							_id
							title
						}
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
					throw new Error('Fetching user data failed!');
				}

				this.setState({
					fullname: resData.data.user.fullname,
					email: resData.data.user.email,
					posts: resData.data.user.posts,
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

	render() {
		return (
			<div className="page-account">
				<UserDetails user={this.state} />
				<UserPosts
					posts={this.state}
					postDeleteHandler={this.onPostDeleteHandler}
					postEditHandler={this.onPostEditHandler}
				/>
			</div>
		);
	}
}

export default Account;
