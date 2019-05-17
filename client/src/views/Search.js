import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

class SearchResults extends Component {
	state = {
		searchResults: []
	};

	componentDidMount() {
		this.loadSearchResults();
	}

	componentDidUpdate(prevProps, prevState) {
		if (
			prevProps.match.params.keyword !== this.props.match.params.keyword
		) {
			this.loadSearchResults();
		}
	}

	loadSearchResults = () => {
		let graphqlQuery = {
			query: `
				query SearchPosts($keyword: String!) {
  					searchPosts(keyword: $keyword) {
    					posts {
							_id
      						title
      						excerpt
							content
							slug
    					}
  					}
				}
				`,
			variables: {
				keyword: this.props.match.params.keyword
			}
		};

		fetch(process.env.REACT_APP_BACKEND_URI, {
			method: 'POST',
			headers: {
				Authorization: this.props.token,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(graphqlQuery)
		})
			.then(res => {
				return res.json();
			})
			.then(resData => {
				if (resData.errors) {
					throw new Error('Search Failed!');
				}
				this.setState({
					searchResults: resData.data.searchPosts.posts
				});
			})
			.catch(error => {
				Swal.fire({
					title: 'Error!',
					text: error.message,
					type: 'error',
					confirmButtonText: 'Ok'
				});
			});
	};

	render() {
		let renderSearchResults = (
			<div>
				<h5>No results where found!</h5>
			</div>
		);

		if (this.state.searchResults.length) {
			renderSearchResults = this.state.searchResults.map(result => {
				return (
					<div key={result._id}>
						<h5>
							<Link to={'/' + result.slug}>{result.title}</Link>
						</h5>
					</div>
				);
			});
		}

		return (
			<div className="page-search-results">
				<div className="card">
					<h1>
						Search Results for: {this.props.match.params.keyword}
					</h1>
					{renderSearchResults}
				</div>
			</div>
		);
	}
}

export default SearchResults;
