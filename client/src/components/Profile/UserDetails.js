import React from "react";
import { Link } from "react-router-dom";

const UserPosts = props => {
	let userAvatar =
		props.user.avatar ||
		process.env.REACT_APP_BACKEND_ASSETS + "images/avatar.png";
	return (
		<div className="card">
			<h1>{props.user.fullname}</h1>
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
			<div className="user-actions">
				<Link to="/edit-profile">edit profile</Link> /{" "}
				<Link to="/change-password">change password</Link>
			</div>
		</div>
	);
};

export default UserPosts;
