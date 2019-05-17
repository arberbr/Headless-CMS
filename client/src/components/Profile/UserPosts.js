import React from 'react';
import { Link } from 'react-router-dom';

const UserPosts = props => {
	let userPost = props.posts.posts.map(post => {
		return (
			<li key={post._id} className="horizontal-list">
				<div>
					<Link to={post.slug}>{post.title}</Link>
				</div>
				<div>
					<Link to={'/edit-post/' + post._id} className="btn-link">
						<span role="img" aria-labelledby="Edit Post">
							&#128221;
						</span>
					</Link>
					<span
						role="img"
						className="btn-link"
						onClick={() => props.postDeleteHandler(post._id)}
						aria-labelledby="Delete Post"
					>
						&#10060;
					</span>
				</div>
			</li>
		);
	});

	return (
		<div className="card">
			<h1>Your Posts</h1>
			<ul className="flex-list">
				{userPost.length ? userPost : 'Write your first post!'}
			</ul>
		</div>
	);
};

export default UserPosts;
