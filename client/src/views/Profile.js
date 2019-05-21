import React, { Component } from "react";
import Swal from "sweetalert2";

class Profile extends Component {
	state = {
		username: "",
		fullname: "",
		email: "",
		bio: "",
		avatar: "",
		work: "",
		location: "",
		joined: "",
		posts: [],
		socials: ""
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
			method: "POST",
			headers: {
				Authorization: this.props.token,
				"Content-Type": "application/json"
			},
			body: JSON.stringify(graphqlQuery)
		})
			.then(res => {
				return res.json();
			})
			.then(resData => {
				if (resData.errors) {
					throw new Error("Fetching user data failed!");
				}

				console.log(resData);

				this.setState({
					username: resData.data.fetchUserByUsername.username,
					fullname: resData.data.fetchUserByUsername.fullname,
					email: resData.data.fetchUserByUsername.email,
					bio: resData.data.fetchUserByUsername.bio,
					avatar: resData.data.fetchUserByUsername.avatar,
					work: resData.data.fetchUserByUsername.work,
					location: resData.data.fetchUserByUsername.location,
					joined: resData.data.fetchUserByUsername.createdAt,
					posts: resData.data.fetchUserByUsername.posts,
					socials: resData.data.fetchUserByUsername.socials
				});
			})
			.catch(error => {
				Swal.fire({
					title: "Error!",
					text: error.message,
					type: "error",
					confirmButtonText: "Ok"
				});
			});
	};

	render() {
		return (
			<div className="page-profile">
				<div className="card">
					<h1>Profile</h1>
				</div>
			</div>
		);
	}
}

export default Profile;
