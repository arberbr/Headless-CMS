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
		createdAt: ''
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
					userAvatar: resData.data.post.user.avatar
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
							{this.state.userBio}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default SinglePost;
