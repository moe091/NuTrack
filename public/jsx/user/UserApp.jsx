import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Search from '../Search.jsx';
import {SearchArea, SearchBox} from '../SearchArea.jsx';
import Nav from '../Nav.jsx';
import SideBar from '../SideBar.jsx';
import NewMeal from './NewMeal.jsx';

class UserApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			query: this.props.location.pathname.split('/'),
			checkedItems: []
		}
	}
	
	search(param) {
		console.log("USER APP SEARCH", param);
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

							<Route path='/user/meals/new' render={() => {
								return (
									<NewMeal checkedItems={this.state.checkedItems} />
								)
							}} />
							
							<Route path='/user/search' render={() => {
								return (
									<SearchArea searchHandler={this.search.bind(this)} newMealHandler={this.newMealHandler.bind(this)} checkItemHandler={this.checkItemHandler.bind(this)} query={this.state.query[this.state.query.length - 1]} /> 	
								)
							}}
							 />
							 
							

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
			var newArr = []
			this.state.checkedItems.map((i) => {
				if (i != null && i != ndb) {
					console.log("not null:", i);
					newArr.push(i);
				} else {
					console.log("null: ", i);
				}
			});
			console.log("newArr:", newArr);
			this.setState({
				checkedItems: newArr
			})
		}
		console.log("checked Items = ", this.state.checkedItems);
	}
}


export default UserApp;
