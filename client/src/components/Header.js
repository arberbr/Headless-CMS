import React from 'react';
import { Link } from 'react-router-dom';

import SearchForm from './SearchForm';

const Header = props => {
	let leftMenuItems = (
		<>
			<li>
				<Link to="/">Home</Link>
			</li>
		</>
	);

	let centerMenu = null;

	let rightMenuItems = (
		<>
			<li>
				<Link to="/login">Login</Link>
			</li>
			<li>
				<Link to="/signup">Signup</Link>
			</li>
		</>
	);

	if (props.isAuth) {
		leftMenuItems = (
			<>
				<li>
					<Link to="/">Home</Link>
				</li>
				<li>
					<Link to="/add-post">Add Post</Link>
				</li>
			</>
		);

		centerMenu = <SearchForm />;

		rightMenuItems = (
			<>
				<li>
					<Link to="/account">Account</Link>
				</li>
				<li>
					<span onClick={props.onLogout}>Logout</span>
				</li>
			</>
		);
	}

	return (
		<header className="app-header">
			<nav>
				<ul className="menu-header">{leftMenuItems}</ul>
				{centerMenu}
				<ul className="menu-header">{rightMenuItems}</ul>
			</nav>
		</header>
	);
};

export default Header;
