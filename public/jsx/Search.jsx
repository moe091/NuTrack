import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';

import {SearchArea, SearchBox} from './SearchArea.jsx';
import Nav from './Nav.jsx';
import SideBar from './SideBar.jsx';

class Search extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			query: this.props.location.pathname.split('/')
		}
	}
	render() {
		return (
			<div className="app-wrapper">
				<Nav />

				<div className="container-fixed h-100 no-gap">
					<div className="row">

						<div className="col-sm-2">
							<SideBar />
						</div>

						<div className="col-sm-9">
							<SearchArea query={this.state.query[this.state.query.length - 1]} message={this.props.location.pathname}/>
						</div>

					</div>
				</div>

			</div>
		)
	}
}


export default Search;
