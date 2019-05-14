import React, { Component } from 'react';
import Swal from 'sweetalert2';

class SinglePost extends Component {
	state = {
		title: '',
		excerpt: '',
		content: '',
		image: '',
		user: '',
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
                        }
                        createdAt
                    }
                }
            `,
			variables: {
				postId: postId
			}
		};

		fetch('http://localhost:8080/graphql', {
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
					user: resData.data.post.user.fullname
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
				<div className="card">
					<img
						src={this.state.image}
						alt={this.state.title}
						className="single-post-image"
					/>
					<h1>{this.state.title}</h1>
					<div
						className="post-content"
						dangerouslySetInnerHTML={{ __html: this.state.content }}
					/>
					<br />
					<span>
						Published: {this.state.createdAt} by {this.state.user}
					</span>
				</div>
			</div>
		);
	}
}

export default SinglePost;
