import React from 'react';
import { Link } from 'react-router-dom';

const UserPosts = props => {
	let userGithub = props.user.github ? (
		<a href={props.user.github} target="_blank" rel="noopener noreferrer">
			<span className="fa fa-github" />
		</a>
	) : (
		''
	);

	let userWebsite = props.user.website ? (
		<a href={props.user.website} target="_blank" rel="noopener noreferrer">
			<span className="fa fa-globe" />
		</a>
	) : (
		''
	);

	let userWork = props.user.work ? (
		<p>
			<b>Work:</b> {props.user.work}
		</p>
	) : (
		''
	);

	let userLocation = props.user.location ? (
		<p>
			<b>Location:</b> {props.user.location}
		</p>
	) : (
		''
	);

	return (
		<div className="card">
			<h1>{props.user.fullname}</h1>
			<div className="user-details">
				<div className="user-image">
					<img src={props.user.avatar} alt={props.user.fullname} />
				</div>
				<div className="user-info">
					<p>
						<b>E-Mail:</b> {props.user.email}
					</p>
					<p>
						<b>Bio:</b> {props.user.bio}
					</p>
					{userWork}
					{userLocation}
					<p>
						<b>Joined:</b> {props.user.joined}
					</p>
					<p className="user-socials">
						{userGithub} {userWebsite}
					</p>
				</div>
			</div>
			<div className="user-actions">
				<Link to="/edit-profile">edit profile</Link> -{' '}
				<Link to="/change-password">change password</Link> -{' '}
				<Link to="/user-socials">user socials</Link>
			</div>
		</div>
	);
};

export default UserPosts;
