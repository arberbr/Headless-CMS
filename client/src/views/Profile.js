import React, { Component } from 'react';
import Swal from 'sweetalert2';

import AccountData from '../components/Profile/AccountData';

import formatDate from '../utils/formatDate';

class Profile extends Component {
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
		joined: '',
		finishedLoading: false
	};

	componentDidMount() {
		const username = this.props.match.params.username;
		this.loadUserData(username);
	}

	loadUserData = username => {
		const graphqlQuery = {
			query: `
                query FetchUserByUsername($username: String!) {
                    fetchUserByUsername(username: $username) {
                        username
                        fullname
                        email
                        bio
                        avatar
                        work
                        location
                        createdAt
                        posts {
                            _id
                            slug
                            title
                        }
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
				username: username
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
					username: resData.data.fetchUserByUsername.username,
					fullname: resData.data.fetchUserByUsername.fullname,
					email: resData.data.fetchUserByUsername.email,
					bio: resData.data.fetchUserByUsername.bio,
					avatar: resData.data.fetchUserByUsername.avatar,
					work: resData.data.fetchUserByUsername.work,
					location: resData.data.fetchUserByUsername.location,
					joined: formatDate(
						resData.data.fetchUserByUsername.createdAt
					),
					posts: resData.data.fetchUserByUsername.posts,
					socials: resData.data.fetchUserByUsername.socials,
					finishedLoading: true
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
		let accountData = '';
		if (this.state.finishedLoading) {
			accountData = <AccountData user={this.state} />;
		}
		return (
			<div className="page-profile">
				<div className="card">{accountData}</div>
			</div>
		);
	}
}

export default Profile;
