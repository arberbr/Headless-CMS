import React, { Component } from 'react';
import Swal from 'sweetalert2';

import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

class AddPost extends Component {
	state = {
		title: '',
		content: '',
		excerpt: '',
		image: '',
		editorState: EditorState.createEmpty()
	};

	componentDidMount() {
		if (!this.props.userId) return;
	}

	onEditorStateChange = editorState => {
		this.setState({
			content: draftToHtml(convertToRaw(editorState.getCurrentContent()))
		});
	};

	onPostSubmit = (event, postData) => {
		event.preventDefault();

		const graphqlQuery = {
			query: `
				mutation CreatePost($title: String!, $excerpt: String, $content: String!, $image: String) {
					createPost(postInput: {
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
						throw new Error('Post creation failed!');
					}
					Swal.fire({
						title: 'Success!',
						text: 'Post created!',
						type: 'success',
						confirmButtonText: 'Ok'
					}).then(() => {
						this.props.history.replace('/');
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

	handleInputChanger = (event, element) => {
		this.setState({
			[element]: event.target.value
		});
	};

	handleFilePicker = async event => {
		const files = event.target.files;
		const data = new FormData();
		data.append('file', files[0]);
		data.append('upload_preset', 'vzolarpr');
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

	render() {
		let btnState = this.state.image ? '' : 'disabled';

		return (
			<div className="page-add-post">
				<div className="card">
					<h1>Add Post</h1>
					<form
						method="POST"
						action=""
						onSubmit={event =>
							this.onPostSubmit(event, {
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
							Add Post
						</button>
					</form>
				</div>
			</div>
		);
	}
}

export default AddPost;
