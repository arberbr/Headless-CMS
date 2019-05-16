import React, { Component } from 'react';
import Swal from 'sweetalert2';

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
		const postId = this.props.match.params.postId;
		if (!postId) return;

		const graphqlQuery = {
			query: `
                query FetchPost($postId: ID!) {
                    post(postId: $postId) {
                        _id
                        title
                        content
                        image
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
					throw new Error('Fetching Post Failed!');
				}
				this.setState({
					title: resData.data.post.title,
					excerpt: resData.data.post.excerpt,
					content: resData.data.post.content,
					image: resData.data.post.image,
					createdAt: new Date(
						resData.data.post.createdAt
					).toLocaleDateString('en-US'),
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
						<div
							dangerouslySetInnerHTML={{
								__html: this.state.content
							}}
						/>
						<br />
						<span className="post-meta">
							Published: {this.state.createdAt} by{' '}
							{this.state.userFullName}
						</span>
					</div>
					<hr />
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
