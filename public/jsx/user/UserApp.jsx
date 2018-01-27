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
	::UserApp - Wraps the entire user area of website. Always displayes top bar, sidebar(which changes dynamically depending on state), and a main content area that represents the current page of the app and renders a different component depending on the route.
	
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
	
	//callback for searches, passed into components that have a search input, calls search route via Ajax then return response, allowing component calling search to either update route to search page or use the results in whatever other way is needed
	//TODO write function
	search(param) {
		console.log("USER APP SEARCH", param);
	}
	
	/**
		Renders app-wrapper div, which is basically the whole WebApp
		<Nav> across top
		<SideBar> along left of page
		<Route> - renders whatever the current component/page is based on the current route in the main section of the screen
	**/
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
		renders the <TrackerAdd> component, passing in the appropriate props. This function renders <TrackerAdd> with isMealSelected true, which just renders the component in it's ready-to-add state since it has a selected meal to add to Tracker and doesn't need to create one first
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
	
	//simply updates route, will trigger a re-render in which UserApp will render the <TrackerShow> component in the main area
	trackerShowHandler() {
		this.props.history.push("../../user/tracker/show");
	}

	//update route, causes re-render with <PlannerAdd> component in main area of page, passes in appropriate props
	plannerAddHandler(e) {
		
	}
	
	//update route, cause re-render with <ShowMeal> component in main section of page.
	showMealHandler(e) {
		console.log("SHOW MEAL HANDLER - UserApp");
		this.props.history.push("../../user/meals/show");
	}
	
	//update route, cause re-render with <NewMeal> component in main section of page
	newMealHandler(e) {
		console.log("new meal click"); 
		console.log(e.target);
		console.log("this = ", this); 
		this.props.history.push("../../user/meals/new");
	}
	
	
	/**
		Callback function that is called whenever a food product item is selected/checked, e.g by the user clicking the checkbox next to an item in the search results page. 
		-Only works as a callback from an input event on an html element, extracting the ndbno of selected item from the elements id tag
		
		TODO: refactor this function, instead of taking the html element as a parameter and calculating the ndbno from the elements id, just accept the ndbno. Components calling this function will manually extract/find the ndbno of the item being selected and pass that in when calling this function, instead of just setting this func as the callback for input events on html elements
	**/
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
