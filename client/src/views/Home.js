import React, { Component } from 'react';
import Swal from 'sweetalert2';

import PostItems from '../components/PostItems';

class Home extends Component {
	state = {
		fullname: '',
		email: '',
		posts: []
	};

	componentDidMount() {
		if (!this.props.userId) return;

		let graphqlQuery = {
			query: `
				query FetchUser($id: ID!) {
					user(id: $id) {
						fullname
						email
					}
				}
			`,
			variables: {
				id: this.props.userId
			}
		};

		fetch('http://localhost:8080/graphql', {
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
					email: resData.data.user.email
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

		this.fetchPosts();
	}

	fetchPosts = () => {
		const graphqlQuery = {
			query: `
				{
  					posts {
    					posts {
      						_id
      						title
      						content
      						excerpt
							image
							user {
								fullname
							}
    					}
  					}
				}

			`
		};

		fetch('http://localhost:8080/graphql', {
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
					throw new Error('Fetching Posts Failed!');
				}

				this.setState({
					posts: resData.data.posts.posts
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
		return <PostItems postItems={this.state.posts} />;
	}
}

export default Home;
