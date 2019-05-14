import React, { Component } from 'react';
import Swal from 'sweetalert2';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

class EditPost extends Component {
	state = {
		title: '',
		excerpt: '',
		content: '',
		image: '',
		editorState: ''
	};

	componentDidMount() {
		const postId = this.props.match.params.postId;
		this.loadPost(postId);
	}

	onEditorStateChange = editorState => {
		this.setState({
			editorState: editorState,
			content: draftToHtml(convertToRaw(editorState.getCurrentContent()))
		});
	};

	loadPost = postId => {
		let graphqlQuery = {
			query: `
				query FetchPost($postId: ID!) {
					post(postId: $postId) {
						_id
                        title
                        excerpt
						content
						image
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
					throw new Error('Fetching Post failed!');
				}

				this.setState({
					title: resData.data.post.title,
					excerpt: resData.data.post.excerpt,
					content: resData.data.post.content,
					image: resData.data.post.image
					// editorState: resData.data.post.content
				});

				const contentBlock = htmlToDraft(resData.data.post.content);
				if (contentBlock) {
					const contentState = ContentState.createFromBlockArray(
						contentBlock.contentBlocks
					);
					const editorState = EditorState.createWithContent(
						contentState
					);
					this.setState({
						editorState: editorState
					});
				}
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
		data.append('upload_preset', 'sickfits');
		const res = await fetch(
			'https://api.cloudinary.com/v1_1/ab-sickfits/image/upload',
			{
				method: 'POST',
				body: data
			}
		);
		const file = await res.json();
		this.setState({
			image: file.secure_url
		});
	};

	updatePostHandler = (event, postData) => {
		event.preventDefault();

		const graphqlQuery = {
			query: `
				mutation UpdatePost($postId: ID!, $title: String!, $excerpt: String, $content: String!, $image: String) {
					updatePost(postId: $postId, postInput: {
      					title: $title,
     	 				excerpt: $excerpt,
                        content: $content,
                        image: $image
    				}) {
						_id
						title
  					}
				}
			`,
			variables: {
				postId: this.props.match.params.postId,
				title: postData.title,
				excerpt: postData.excerpt,
				content: postData.content,
				image: postData.image
			}
		};

		if (this.state.image) {
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
						throw new Error('Post update failed!');
					}
					Swal.fire({
						title: 'Success!',
						text: 'Post updated!',
						type: 'success',
						confirmButtonText: 'Ok'
					}).then(() => {
						this.props.history.replace('/account');
					});
				})
				.catch(err => {
					Swal.fire({
						title: 'Error!',
						text: err.message,
						type: 'error',
						confirmButtonText: 'Ok'
					});
				});
		} else {
			Swal.fire({
				title: 'Warning!',
				text: 'Image is still being uploaded!',
				type: 'info',
				confirmButtonText: 'Ok'
			});
		}
	};

	render() {
		let btnState = this.state.image ? '' : 'disabled';
		return (
			<div className="page-edit-post">
				<div className="card">
					<h1>Edit Post</h1>
					<form
						method="POST"
						action=""
						onSubmit={event =>
							this.updatePostHandler(event, {
								title: this.state.title,
								content: this.state.content,
								excerpt: this.state.excerpt,
								image: this.state.image
							})
						}
					>
						<div>
							<label htmlFor="title">
								Title <span className="required">*</span>
							</label>
							<input
								type="text"
								name="title"
								id="title"
								required
								value={this.state.title}
								onChange={event =>
									this.handleInputChanger(event, 'title')
								}
							/>
						</div>
						<div>
							<label htmlFor="excerpt">Excerpt</label>
							<textarea
								name="excerpt"
								id="excerpt"
								value={this.state.excerpt}
								onChange={event =>
									this.handleInputChanger(event, 'excerpt')
								}
							/>
						</div>
						<div>
							<label htmlFor="content">
								Content <span className="required">*</span>
							</label>
							<Editor
								editorState={this.state.editorState}
								onEditorStateChange={this.onEditorStateChange}
							/>
						</div>
						<div>
							<label htmlFor="image">Image</label>
							<input
								type="file"
								name="image"
								id="image"
								onChange={event => this.handleFilePicker(event)}
							/>
						</div>
						<button type="submit" disabled={btnState}>
							Update Post
						</button>
					</form>
				</div>
			</div>
		);
	}
}

export default EditPost;
