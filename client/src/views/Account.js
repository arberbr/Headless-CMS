import React, { Component } from 'react';
import Swal from 'sweetalert2';

import UserDetails from '../components/Profile/UserDetails';
import UserPosts from '../components/Profile/UserPosts';

import formatDate from '../utils/formatDate';

class Account extends Component {
	state = {
		fullname: '',
		email: '',
		posts: [],
		bio: '',
		avatar: '',
		work: '',
		location: '',
		socials: {
			github: '',
			website: '',
			linkedin: '',
			facebook: '',
			stackoverflow: ''
		},
		joined: ''
	};

	componentDidMount() {
		this.loadUserData();
	}

	loadUserData = () => {
		let graphqlQuery = {
			query: `
				query FetchUser($id: ID!) {
					user(id: $id) {
						createdAt
						fullname
						email
						posts {
							_id
							title
							slug
						}
						bio
						avatar
						work
						location
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
					throw new Error('Fetching user data failed!');
				}

				this.setState({
					fullname: resData.data.user.fullname,
					email: resData.data.user.email,
					posts: resData.data.user.posts,
					bio: resData.data.user.bio,
					avatar: resData.data.user.avatar,
					socials: resData.data.user.socials || this.state.socials,
					work: resData.data.user.work,
					location: resData.data.user.location,
					joined: formatDate(resData.data.user.createdAt)
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

	onPostDeleteHandler = postId => {
		Swal.fire({
			title: 'Are you sure?',
			text: 'You will not be able to recover this post!',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Yes, delete it!',
			cancelButtonText: 'No, keep it!'
		}).then(result => {
			if (result.value) {
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
						Swal.fire(
							'Success!',
							'Your post has been deleted!',
							'success'
						).then(() => {
							this.loadUserPosts();
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
			} else if (result.dismiss === Swal.DismissReason.cancel) {
				Swal.fire('Information!', 'Your post is safe :)', 'info');
			}
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
