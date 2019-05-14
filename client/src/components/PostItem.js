import React from 'react';
import { Link } from 'react-router-dom';

const PostItem = props => {
	let imageTag = (
		<img
			src={props.post.image}
			alt={props.post.title}
			className="post-teaser-image"
		/>
	);
	if (!props.post.image) imageTag = null;
	return (
		<div className="card-post-item">
			{imageTag}
			<div className="post-teaser-title">
				<h2>
					<Link to={props.post._id}>{props.post.title}</Link>
				</h2>
			</div>
			<div className="post-teaser-meta">
				<p>{props.post.user.fullname}</p>
			</div>
		</div>
	);
};

export default PostItem;
