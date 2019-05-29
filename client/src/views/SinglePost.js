import React, { Component } from 'react';
import Swal from 'sweetalert2';

import timeToRead from '../utils/timeToRead';
import formatDate from '../utils/formatDate';

class SinglePost extends Component {
	state = {
		title: '',
		excerpt: '',
		content: '',
		image: '',
		userFullName: '',
		userBio: '',
		userAvatar: '',
		createdAt: '',
		socials: {
			github: '',
			website: '',
			linkedin: '',
			facebook: '',
			stackoverflow: ''
		}
	};

	componentDidMount() {
		const postSlug = this.props.match.params.postSlug;
		if (!postSlug) return;

		const graphqlQuery = {
			query: `
                query FetchPost($postSlug: String!) {
                    post(postSlug: $postSlug) {
                        _id
                        title
                        content
						image
						slug
                        user {
							fullname
							bio
							avatar
							socials {
								github
								website
								linkedin
								facebook
								stackoverflow
							}
                        }
                        createdAt
                    }
                }
            `,
			variables: {
				postSlug: postSlug
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
					throw new Error('Fetching Post Failed!');
				}

				const formattedDate = formatDate(resData.data.post.createdAt);
				if (!formattedDate) {
					throw new Error('Could not format date!');
				}

				this.setState({
					title: resData.data.post.title,
					excerpt: resData.data.post.excerpt,
					content: resData.data.post.content,
					image: resData.data.post.image,
					createdAt: formattedDate,
					userFullName: resData.data.post.user.fullname,
					userBio: resData.data.post.user.bio,
					userAvatar: resData.data.post.user.avatar,
					socials:
						resData.data.post.user.socials || this.state.socials
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
	}

	render() {
		let userGithub = this.state.socials.github ? (
			<a
				href={this.state.socials.github}
				target="_blank"
				rel="noopener noreferrer"
				title="GitHub"
			>
				<span className="fa fa-github" />
			</a>
		) : (
			''
		);

		let userWebsite = this.state.socials.website ? (
			<a
				href={this.state.socials.website}
				target="_blank"
				rel="noopener noreferrer"
				title="Website"
			>
				<span className="fa fa-globe" />
			</a>
		) : (
			''
		);

		let userLinkedIn = this.state.socials.linkedin ? (
			<a
				href={this.state.socials.linkedin}
				target="_blank"
				rel="noopener noreferrer"
				title="LinkedIn"
			>
				<span className="fa fa-linkedin" />
			</a>
		) : (
			''
		);

		let userFacebook = this.state.socials.facebook ? (
			<a
				href={this.state.socials.facebook}
				target="_blank"
				rel="noopener noreferrer"
				title="Facebook"
			>
				<span className="fa fa-facebook" />
			</a>
		) : (
			''
		);

		let userStackOverflow = this.state.socials.stackoverflow ? (
			<a
				href={this.state.socials.stackoverflow}
				target="_blank"
				rel="noopener noreferrer"
				title="StackOverflow"
			>
				<span className="fa fa-stack-overflow" />
			</a>
		) : (
			''
		);

		return (
			<div className="page-single-post">
				<div className="card-post">
					<img
						src={this.state.image}
						alt={this.state.title}
						className="single-post-image"
					/>
					<div className="post-content">
						<h1>{this.state.title}</h1>
						<div className="post-meta">
							{`Published: ${this.state.createdAt} by ${
								this.state.userFullName
							} - ${timeToRead(this.state.content)}`}
						</div>
						<div
							dangerouslySetInnerHTML={{
								__html: this.state.content
							}}
						/>
					</div>
					<div className="post-author-box">
						<div className="post-author-image">
							<img
								className="post-author-avatar"
								src={this.state.userAvatar}
								alt={this.state.userFullName}
							/>
						</div>
						<div className="post-author-info">
							<h4>{this.state.userFullName}</h4>
							<p>{this.state.userBio}</p>
							<p className="user-socials">
								{userGithub} {userWebsite} {userLinkedIn}{' '}
								{userFacebook} {userStackOverflow}
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default SinglePost;
