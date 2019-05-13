import React from 'react';
import { Link } from 'react-router-dom';

const PostItem = props => {
	return (
		<div className="card-post-item">
			<h2>
				<Link to={props.post._id}>{props.post.title}</Link>
			</h2>
			<p>{props.post.excerpt}</p>
			<p>{props.post.user.fullname}</p>
		</div>
	);
};

export default PostItem;
