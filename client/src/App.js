import React, { Component } from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import Swal from "sweetalert2";

import validateEmail from "./utils/validateEmail";

import Header from "./components/Header";

import Login from "./views/Login";
import Signup from "./views/SignUp";

import Home from "./views/Home";
import AddPost from "./views/AddPost";
import EditPost from "./views/EditPost";
import SinglePost from "./views/SinglePost";

import Account from "./views/Account";
import Profile from "./views/Profile";
import EditProfile from "./views/EditProfile";
import UserSocials from "./views/UserSocials";
import ChangePassword from "./views/ChangePassword";

import SearchResults from "./views/SearchResults";

import "./App.css";

class App extends Component {
	state = {
		isAuth: false,
		token: null,
		userId: null
	};

	componentDidMount() {
		const token = localStorage.getItem("token");
		const expiryDate = localStorage.getItem("expiryDate");

		if (!token || !expiryDate) return;

		if (new Date(expiryDate) <= new Date()) {
			this.logoutHandler();
			return;
		}

		const userId = localStorage.getItem("userId");
		const remainingMilliseconds =
			new Date(expiryDate).getTime() - new Date().getTime();

		this.setState({ isAuth: true, token: token, userId: userId });
		this.setAutoLogout(remainingMilliseconds);
	}

	logoutHandler = () => {
		this.setState({ isAuth: false, token: null });
		localStorage.removeItem("token");
		localStorage.removeItem("expiryDate");
		localStorage.removeItem("userId");
	};

	loginHandler = (event, authData) => {
		event.preventDefault();

		if (!validateEmail(authData.email)) {
			Swal.fire({
				title: "Error!",
				text: "Enter a valid E-Mail address!",
				type: "error",
				confirmButtonText: "Ok"
			});
			return;
		}

		const graphqlLoginQuery = {
			query: `
				query UserLogin($email: String!, $password: String!) {
					login(
      					email: $email,
      					password: $password
    				) {
    					userId
    					token
  					}
				}
			`,
			variables: {
				email: authData.email,
				password: authData.password
			}
		};

		fetch(process.env.REACT_APP_BACKEND_URI, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(graphqlLoginQuery)
		})
			.then(res => {
				return res.json();
			})
			.then(resData => {
				if (resData.errors) {
					throw new Error(resData.errors[0].message);
				}

				this.setState({
					isAuth: true,
					token: resData.data.login.token,
					userId: resData.data.login.userId
				});

				localStorage.setItem("token", resData.data.login.token);
				localStorage.setItem("userId", resData.data.login.userId);

				const remainingMilliseconds = 60 * 60 * 1000;
				const expiryDate = new Date(
					new Date().getTime() + remainingMilliseconds
				);

				localStorage.setItem("expiryDate", expiryDate.toISOString());
				this.setAutoLogout(remainingMilliseconds);
			})
			.catch(error => {
				this.setState({
					isAuth: false
				});
				Swal.fire({
					title: "Error!",
					text: error.message,
					type: "error",
					confirmButtonText: "Ok"
				});
			});
	};

	signupHandler = (event, authData) => {
		event.preventDefault();

		if (!validateEmail(authData.email)) {
			Swal.fire({
				title: "Error!",
				text: "Enter a valid E-Mail address!",
				type: "error",
				confirmButtonText: "Ok"
			});
			return;
		}

		if (!authData.fullname) {
			Swal.fire({
				title: "Error!",
				text: "Enter your full name!",
				type: "error",
				confirmButtonText: "Ok"
			});
			return;
		}

		if (!authData.passwordValid) {
			Swal.fire({
				title: "Error!",
				text: "Please use a hard-to-guess password!",
				type: "error",
				confirmButtonText: "Ok"
			});
			return;
		}

		const graphqlQuery = {
			query: `
				mutation CreateUser($username: String!, $email: String!, $fullname: String!, $password: String!) {
					signup(userInput: {
						username: $username,
      					email: $email,
     	 				fullname: $fullname,
      					password: $password
    				}) {
						_id
						fullname
    					email
  					}
				}
			`,
			variables: {
				username: authData.username,
				email: authData.email,
				fullname: authData.fullname,
				password: authData.password
			}
		};

		fetch(process.env.REACT_APP_BACKEND_URI, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(graphqlQuery)
		})
			.then(res => {
				return res.json();
			})
			.then(resData => {
				if (resData.errors) {
					throw new Error("User creation failed!");
				}

				this.setState({ isAuth: false });
				Swal.fire({
					title: "Success!",
					text: "Account created!",
					type: "success",
					confirmButtonText: "Ok"
				}).then(() => {
					this.props.history.replace("/login");
				});
			})
			.catch(error => {
				this.setState({
					isAuth: false
				});

				Swal.fire({
					title: "Error!",
					text: error.message,
					type: "error",
					confirmButtonText: "Ok"
				});
			});
	};

	setAutoLogout = milliseconds => {
		setTimeout(() => {
			this.logoutHandler();
		}, milliseconds);
	};

	render() {
		let routes = (
			<Switch>
				<Route
					path="/"
					exact
					render={props => (
						<Login {...props} onLogin={this.loginHandler} />
					)}
				/>
				<Route
					path="/signup"
					exact
					render={props => (
						<Signup {...props} onSignup={this.signupHandler} />
					)}
				/>
				<Redirect to="/" />
			</Switch>
		);
		if (this.state.isAuth) {
			routes = (
				<Switch>
					<Route
						path="/"
						exact
						render={props => (
							<Home
								{...props}
								userId={this.state.userId}
								token={this.state.token}
							/>
						)}
					/>
					<Route
						path="/add-post"
						exact
						render={props => (
							<AddPost
								{...props}
								userId={this.state.userId}
								token={this.state.token}
							/>
						)}
					/>
					<Route
						path="/edit-post/:postId"
						exact
						render={props => (
							<EditPost
								{...props}
								userId={this.state.userId}
								token={this.state.token}
							/>
						)}
					/>
					<Route
						path="/account"
						exact
						render={props => (
							<Account
								{...props}
								userId={this.state.userId}
								token={this.state.token}
							/>
						)}
					/>
					<Route
						path="/edit-profile"
						exact
						render={props => (
							<EditProfile
								{...props}
								userId={this.state.userId}
								token={this.state.token}
							/>
						)}
					/>
					<Route
						path="/user-socials"
						exact
						render={props => (
							<UserSocials
								{...props}
								userId={this.state.userId}
								token={this.state.token}
							/>
						)}
					/>
					<Route
						path="/change-password"
						exact
						render={props => (
							<ChangePassword
								{...props}
								userId={this.state.userId}
								token={this.state.token}
							/>
						)}
					/>
					<Route
						path="/profile/:username"
						exact
						render={props => (
							<Profile
								{...props}
								userId={this.state.userId}
								token={this.state.token}
							/>
						)}
					/>
					<Route
						path="/search/:keyword"
						exact
						render={props => (
							<SearchResults
								{...props}
								userId={this.state.userId}
								token={this.state.token}
							/>
						)}
					/>
					<Route
						path="/:postSlug"
						render={props => (
							<SinglePost
								{...props}
								userId={this.state.userId}
								token={this.state.token}
							/>
						)}
					/>
					<Redirect to="/" />
				</Switch>
			);
		}
		return (
			<>
				<Header
					isAuth={this.state.isAuth}
					onLogout={this.logoutHandler}
				/>
				<main>
					<div className="container">{routes}</div>
				</main>
			</>
		);
	}
}

export default withRouter(App);
