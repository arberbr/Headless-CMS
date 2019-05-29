import React from 'react';
import { Link } from 'react-router-dom';

import AccountData from './AccountData';

const UserPosts = props => {
	return (
		<div className="card">
			<AccountData {...props} />

			<div className="user-actions">
				<Link to="/edit-profile">edit profile</Link> -{' '}
				<Link to="/change-password">change password</Link> -{' '}
				<Link to="/user-socials">user socials</Link>
			</div>
		</div>
	);
};

export default UserPosts;
