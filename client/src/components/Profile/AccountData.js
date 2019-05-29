import React from 'react';

const AccountData = props => {
	let userGithub = props.user.socials.github ? (
		<a
			href={props.user.socials.github}
			target="_blank"
			rel="noopener noreferrer"
			title="GitHub"
		>
			<span className="fa fa-github" />
		</a>
	) : (
		''
	);

	let userWebsite = props.user.socials.website ? (
		<a
			href={props.user.socials.website}
			target="_blank"
			rel="noopener noreferrer"
			title="Website"
		>
			<span className="fa fa-globe" />
		</a>
	) : (
		''
	);

	let userLinkedIn = props.user.socials.linkedin ? (
		<a
			href={props.user.socials.linkedin}
			target="_blank"
			rel="noopener noreferrer"
			title="LinkedIn"
		>
			<span className="fa fa-linkedin" />
		</a>
	) : (
		''
	);

	let userFacebook = props.user.socials.facebook ? (
		<a
			href={props.user.socials.facebook}
			target="_blank"
			rel="noopener noreferrer"
			title="Facebook"
		>
			<span className="fa fa-facebook" />
		</a>
	) : (
		''
	);

	let userStackOverflow = props.user.socials.stackoverflow ? (
		<a
			href={props.user.socials.stackoverflow}
			target="_blank"
			rel="noopener noreferrer"
			title="StackOverflow"
		>
			<span className="fa fa-stack-overflow" />
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
		<div>
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
						{userGithub} {userWebsite} {userLinkedIn} {userFacebook}
						{userStackOverflow}
					</p>
				</div>
			</div>
		</div>
	);
};

export default AccountData;
