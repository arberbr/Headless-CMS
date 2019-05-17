import React from 'react';
import { Link } from 'react-router-dom';

const PostItem = props => {
	let imageTag = (
		<img
			src={props.post.image}
			alt={props.post.title}
			className="card-post-teaser-image"
		/>
	);
	if (!props.post.image) imageTag = null;
	return (
		<div className="card-post-item">
			<div className="card-post-image">{imageTag}</div>
			<div className="card-post-details">
				<div className="card-post-author">
					<img
						className="card-post-author-avatar"
						src={props.post.user.avatar}
						alt={props.post.user.fullname}
					/>
				</div>
				<div className="card-post-info">
					<div className="card-post-teaser-title">
						<h2>
							<Link to={props.post.slug}>{props.post.title}</Link>
						</h2>
					</div>
					<div className="card-post-teaser-meta">
						<p>Published by: {props.post.user.fullname}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PostItem;
