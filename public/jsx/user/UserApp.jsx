import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Search from '../Search.jsx';
import {SearchArea, SearchBox} from '../SearchArea.jsx';
import Nav from '../Nav.jsx';
import SideBar from '../SideBar.jsx'; 
import Meal from './meals/Meal.jsx';
import Tracker from './tracker/Tracker.jsx';

/**
	
	TODO: in sidebar, render each checkedItem in a row(2 items per row) in a slightly lighter colored div and with a remove/X button to remove from selected items. So user can remove selected items at any point and so user feels the checkedItems persisting throughout the app, not just on the search page.
**/
class UserApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			query: this.props.location.pathname.split('/'),
			checkedItems: [],
			selectedMeal: null
		}
		this.isMealSelected = false;
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
								trackerAddHandler={this.trackerAddItemsHandler.bind(this)} 
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
										isMealSelected={this.isMealSelected}
									/>
								)	
							}}
							/>
							 
							

					</div>
				</div>

			</div>
		) 
	}
	
	
	/**
		Tracker Add Handler - For SideBar/when items from search are selected(instead of an already created meal).
		
		Since a specific meal isn't selected, user must create a meal out of the given items in order to add them to tracker. Set this.isMealSelected to false, so that isMealSelected can be passed on to the Tracker > TrackerAdd components, and TrackerAdd knows to display the MealBuilder component to build a new meal before allowing the user to add to tracker, instead of just adding the currently selected meal
	**/
	trackerAddItemsHandler() {
		this.isMealSelected = false;
		console.log('meal selected false callback. this=', this);
		if (this.state.checkedItems.length > 0) {
			this.props.history.push("../../user/tracker/add");
		} else {
			console.warn("trackerAddItemsHandler (SideBar's TrackerAdd callback) was called when checkedItems was empty!. this=", this);
		}
	}
	
	/**
		Tracker Add Handler - For ShowMeal or ShowMeals component, when a specific meal is selected and being added.
	**/
	trackerAddHandler(meal) {
		console.log("TRACKER ADD: ", this.state.checkedItems);
		console.log("meal", meal);
		if (meal != null) {
			this.isMealSelected = true;
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
