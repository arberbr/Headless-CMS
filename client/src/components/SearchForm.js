import React, { Component } from 'react';
import Swal from 'sweetalert2';
import { withRouter } from 'react-router-dom';

class SearchForm extends Component {
	state = {
		keyword: ''
	};

	onSearchFormChangeHandler = event => {
		this.setState({
			keyword: event.target.value
		});
	};

	onSearchFormSubmitHandler = event => {
		event.preventDefault();

		if (this.state.keyword.length >= 3) {
			this.props.history.push('/search/' + this.state.keyword);
			this.setState({
				keyword: ''
			});
		} else {
			Swal.fire({
				title: 'Error!',
				text: 'Search by using at least 3 characters!',
				type: 'error',
				confirmButtonText: 'Ok'
			});
		}
	};

	render() {
		return (
			<div className="search-box">
				<form
					className="search-form"
					method="POST"
					action=""
					onSubmit={event => this.onSearchFormSubmitHandler(event)}
				>
					<input
						type="text"
						name="keyword"
						id="keyword"
						value={this.state.keyword}
						placeholder="Search..."
						onChange={event =>
							this.onSearchFormChangeHandler(event)
						}
					/>
				</form>
			</div>
		);
	}
}

export default withRouter(SearchForm);
