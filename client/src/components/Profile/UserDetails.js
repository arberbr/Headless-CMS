import React from 'react';
import { Link } from 'react-router-dom';

const UserPosts = props => {
	return (
		<div className="card">
			<h1>
				{props.user.fullname} (<Link to="/edit-profile">edit</Link>)
			</h1>
			<div className="user-details">
				<div className="user-image">
					<img
						src="http://localhost:8080/images/avatar.png"
						alt={props.user.fullname}
					/>
				</div>
				<div className="user-info">
					<p>E-Mail: {props.user.email}</p>
					<p>Bio: {props.user.bio}</p>
				</div>
			</div>
		</div>
	);
};

export default UserPosts;
