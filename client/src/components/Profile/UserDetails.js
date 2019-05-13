import React from 'react';
import { Link } from 'react-router-dom';

const UserPosts = props => {
	let userAvatar =
		props.user.avatar || 'http://localhost:8080/images/avatar.png';
	return (
		<div className="card">
			<h1>
				{props.user.fullname} (<Link to="/edit-profile">edit</Link>)
			</h1>
			<div className="user-details">
				<div className="user-image">
					<img src={userAvatar} alt={props.user.fullname} />
				</div>
				<div className="user-info">
					<p>
						<b>E-Mail:</b> {props.user.email}
					</p>
					<p>
						<b>Bio:</b> {props.user.bio}
					</p>
				</div>
			</div>
		</div>
	);
};

export default UserPosts;
