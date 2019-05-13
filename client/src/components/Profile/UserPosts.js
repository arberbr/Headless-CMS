import React from 'react';
import { Link } from 'react-router-dom';

const UserPosts = props => {
	let userPost = props.posts.posts.map(post => {
		return (
			<li key={post._id} className="horizontal-list">
				<div>
					<Link to={post._id}>{post.title}</Link>
				</div>
				<div>
					<span
						role="img"
						onClick={() => props.postEditHandler(post._id)}
						aria-labelledby="Edit Post"
					>
						&#128221;
					</span>
					<span
						role="img"
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
			<ul>{userPost.length ? userPost : 'Write your post Post!'}</ul>
		</div>
	);
};

export default UserPosts;
