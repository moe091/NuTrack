import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Search from '../Search.jsx';
import {SearchArea, SearchBox} from '../SearchArea.jsx';
import Nav from '../Nav.jsx';
import SideBar from '../SideBar.jsx'; 
import Meal from './meals/Meal.jsx';
import Tracker from './tracker/Tracker.jsx';

class UserApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			query: this.props.location.pathname.split('/'),
			checkedItems: [],
			selectedMeal: null
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
							<SideBar 
								newMealHandler={this.newMealHandler.bind(this)} 
								checkedItems={this.state.checkedItems} 
								showMealHandler={this.showMealHandler.bind(this)} 
								plusEnabled={(this.state.checkedItems.length > 0)} 
								trackerShowHandler={this.trackerShowHandler.bind(this)}
								trackerAddHandler={this.trackerAddHandler.bind(this)} 
								plannerAddHandler={this.plannerAddHandler.bind(this)} 
							/>
						</div>
							
							<Route path="/user/meals" render={() => {
								return (
									<Meal 
										checkedItems={this.state.checkedItems} 
										history={this.props.history}
										trackerAddHandler={this.trackerAddHandler.bind(this)} plannerAddHandler={this.plannerAddHandler.bind(this)} 
									/>
								)
							}} /> 
							
							<Route path='/user/search' render={() => {
								return (
									<SearchArea 
										searchHandler={this.search.bind(this)} 
										newMealHandler={this.newMealHandler.bind(this)} checkItemHandler={this.checkItemHandler.bind(this)} 
										query={this.state.query[this.state.query.length - 1]} 
									/> 	
								)
							}}
							/>
							 
							<Route path='/user/tracker' render={() => {
								return (
									<Tracker 
										history={this.props.history} 
										checkedItems={this.state.checkedItems} 
										trackerAddHandler={this.trackerAddHandler.bind(this)}
										meal={this.state.selectedMeal}
									/>
								)	
							}}
							/>
							 
							

					</div>
				</div>

			</div>
		) 
	}
	
	trackerAddHandler(meal) {
		console.log("TRACKER ADD: ", this.state.checkedItems);
		console.log("meal", meal);
		if (meal != null) {
			this.setState({
				selectedMeal: meal
			});
			this.props.history.push("../../user/tracker/add");
		}
	}
	trackerShowHandler() {
		this.props.history.push("../../user/tracker/show");
	}

	plannerAddHandler(e) {
		
	}
	showMealHandler(e) {
		this.props.history.push("../../user/meals/show");
	}
	
	newMealHandler(e) {
		console.log("new meal click"); 
		console.log(e.target);
		console.log("this = ", this); 
		this.props.history.push("../../user/meals/new");
	}
	
	checkItemHandler(e) {
		var ndb = e.target.id.split("-")[2]; 
		if (e.target.checked) {
			this.setState({
				checkedItems: this.state.checkedItems.concat(ndb)
			});
		} else {
			var newArr = [];
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
			});
		}
		console.log("checked Items = ", this.state.checkedItems);
	}
}


export default UserApp;
