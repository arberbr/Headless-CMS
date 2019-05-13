import React from 'react';
import PostItem from './PostItem.js';

const PostItems = props => {
	const postsList = props.postItems.map(post => {
		return <PostItem key={post._id.toString()} post={post} />;
	});
	return postsList;
};

export default PostItems;
