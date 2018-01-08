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
			query: this.props.location.pathname.split('/'),
			checkedItems: []
		}
	}
	render() {
		return (
			<div className="app-wrapper">
				<Nav />

				<div className="container-fixed h-100 no-gap">
					<div className="row">

						<div className="col-sm-2 p-0">
							<SideBar newMealHandler={this.newMealHandler.bind(this)} checkedItems={this.state.checkedItems}/>
						</div>

						
							<SearchArea query={this.state.query[this.state.query.length - 1]} message={this.props.location.pathname} checkItemHandler={this.checkItemHandler.bind(this)}/> 

					</div>
				</div>

			</div>
		)
	}
	
	newMealHandler(e) {
		console.log("new meal click"); 
		console.log(e.target);
		console.log("this = ", this);
		
		fetch('../../user/meals/new', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
      },
			body: JSON.stringify({items: this.state.checkedItems})
		})
		.then((resp) => resp.json())
		.then((res) => {
			console.log("getItemInfos response:", res);
		}).catch((err) => {
			console.log("catch error:", err);
		});
		this.props.history.push("../../user/meals/new");
	}
	
	checkItemHandler(e) {
		var ndb = e.target.id.split("-")[2]; 
		if (e.target.checked) {
			this.setState({
				checkedItems: this.state.checkedItems.concat(ndb)
			});
		} else {
			this.setState({
				checkedItems: this.state.checkedItems.map((i) => {
					if (i != ndb)
						return i;
				})
			});
		}
		console.log("checked Items = ", this.state.checkedItems);
	}
}


export default Search;
