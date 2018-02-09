import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Search from '../Search.jsx';
import {SearchArea, SearchBox} from '../SearchArea.jsx';
import Nav from '../Nav.jsx';
import SideBar from '../SideBar.jsx'; 
import Meal from './meals/Meal.jsx';
import Tracker from './tracker/Tracker.jsx';

import Login from './Login.jsx';
import Register from './Register.jsx';

/**
	::UserApp - Wraps the entire user area of website. Always displayes top bar, sidebar(which changes dynamically depending on state), and a main content area that represents the current page of the app and renders a different component depending on the route.
	
	TODO: in sidebar, render each checkedItem in a row(2 items per row) in a slightly lighter colored div and with a remove/X button to remove from selected items. So user can remove selected items at any point and so user feels the checkedItems persisting throughout the app, not just on the search page.
**/
class UserApp extends React.Component {
	constructor(props) {
		super(props);
		console.log("USER:", window.user);
		this.state = {
			searchItems: [],
			searchNutrients: [],
			searchNutNames: [],
			query: this.getQueryFromPath(this.props.location.pathname.split('/')),
			checkedItems: (window.user) ? window.user.checkedItems : [],
			selectedMeal: null,
			user: window.user
		}
		this.isMealSelected = false;
	}
	
  

  
	
	componentWillUpdate(nextProps, nextState) {
		if (this.state.checkedItems != nextState.checkedItems) {
			this.updateCheckedItems(nextState.checkedItems);
		}
	}
	
	updateCheckedItems(chkdItems) {
		console.log("updating checked items!", chkdItems);
		fetch('../../user/updateCheckedItems', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(chkdItems)
		})
		.then((response) => response.json())
		.then((res) => {
			console.log("user/updateCheckedItems SUCCESS. response: ", res);
		}).catch((err) => {
			console.log("updateCheckedItems ERROR:", err);
		});
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
				<Nav user={this.state.user} history={this.props.history} setQueryHandler={this.setQuery.bind(this)} loginRedirect={this.loginRedirect.bind(this)} />
				<div className="container-fixed fill-height no-gap">
					<div className="row row-leftFix min-height-fill">

						<div className="col-sm-2 p-0">
							<SideBar 
							 	query={this.state.query} 
							 	setQueryHandler={this.setQuery.bind(this)}
								history={this.props.history} 
								
								checkedItems={this.state.checkedItems} 
								checkItemHandler={this.checkItemHandler.bind(this)}
								plusEnabled={(this.state.checkedItems.length > 0)} 
								
								trackerAddHandler={this.trackerAddItemsHandler.bind(this)} 
								plannerAddHandler={this.plannerAddItemsHandler.bind(this)} 
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
										searchItems={this.state.searchItems}
										searchNutrients={this.state.searchNutrients}
										searchNutNames={this.state.searchNutNames}
										searchUpdateHandler={this.searchUpdateHandler.bind(this)}
										pathQuery={this.getQueryFromPath(this.props.location.pathname.split('/'))}
										setQueryHandler={this.setQuery.bind(this)}
										
										setQuery={this.setQuery.bind(this)}
										checkItemHandler={this.checkItemHandler.bind(this)} 
										query={this.state.query} 
										checkedItems={this.state.checkedItems}
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
										plannerAddHandler={this.plannerAddHandler.bind(this)}
										meal={this.state.selectedMeal}
										isMealSelected={this.isMealSelected}
										type="tracker"
									/>
								)	
							}}
							/>
							
							 
							<Route path='/user/planner' render={() => {
								return (
									<Tracker 
										history={this.props.history} 
										checkedItems={this.state.checkedItems} 
										trackerAddHandler={this.trackerAddHandler.bind(this)}
										plannerAddHandler={this.plannerAddHandler.bind(this)}
										meal={this.state.selectedMeal}
										isMealSelected={this.isMealSelected}
										type="planner"
									/>
								)	
							}}
							/>
							
							<Route path='/users/login' render={() => {
								return (
									<Login loginSuccess={this.loginSuccess.bind(this)} />
								)
							}}
							/>
							
							<Route path='/users/register' render={() => {
								return (
									<Register loginSuccess={this.loginSuccess.bind(this)} />
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
	
	plannerAddItemsHandler() {
		this.isMealSelected = false;
		if (this.state.checkedItems.length > 0) {
			this.props.history.push("../../user/planner/add");
		} else {
			console.warn("plannerAddItemsHandler (SideBar's PlannerAdd callback) was called when checkedItems was empty!. this=", this);
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
	
	plannerAddHandler(meal) {
		if (meal != null) {
			this.isMealSelected = true;
			this.setState({
				selectedMeal: meal
			});
			this.props.history.push("../../user/planner/add");
		}
	}
	
	//simply updates route, will trigger a re-render in which UserApp will render the <TrackerShow> component in the main area
	
	
	
	/**
		Callback function that is called whenever a food product item is selected/checked, e.g by the user clicking the checkbox next to an item in the search results page. 
		-Only works as a callback from an input event on an html element, extracting the ndbno of selected item from the elements id tag
		
		TODO: refactor this function, instead of taking the html element as a parameter and calculating the ndbno from the elements id, just accept the ndbno. Components calling this function will manually extract/find the ndbno of the item being selected and pass that in when calling this function, instead of just setting this func as the callback for input events on html elements
	**/
	checkItemHandler(item) {
		//call isNdbChecked on items ndb, if it already exists in checkedItems then itemIndex will be set to the items index in checkedItems, if not it will be set to -1
		var itemIndex = this.isNdbChecked(item.ndb);
		//if itemIndex equals -1 then the item wasn't 'checkedBefore', so set to false. otherwise set to true
		var checkedBefore = (itemIndex < 0) ? false : true
		var isCheckedNow = item.checked
		item = {name: item.name, ndb: item.ndb};
		
		
		if (isCheckedNow) { 
			
			if (!checkedBefore) { //wasn't checked, is now, so add to newArr
				var newArr = this.state.checkedItems.concat(item);
			} else { //ndb is checked now, and it was already checked(somehow)??
				console.warn("wasn't checked, still isn't?", this.state.checkedItems);
				console.warn("newly checked item:", item);
			}
			
		} else {
			
			if (checkedBefore) { //isn't checked, but was, so remove item
				//reomve itemIndex from checkedItems, set to newArr
				var newArr = 
					this.state.checkedItems
					.slice(0, itemIndex)
					.concat(
						this.state.checkedItems.slice(itemIndex + 1, this.state.checkedItems.length)
					);
			} else {//ndb wasn't checked, and it's not now. this shouldn't be called
				console.warn("was checked, still is?", this.state.checkedItems);
				console.warn("newly checked item:", item);
				console.warn("itemIndex = " + itemIndex);
			}
			
			
		}
		
		//if newArr was set, checkedItems has changed. update state
		if (newArr != null) {
			this.setState({
				checkedItems: newArr
			});
		} else {
			console.warn("Something was checked but nothing changed, what happened? Look above for details");
		}
		
	}
	
	//returns -1 if ndb isn't already in checkedItems, returns index of item if it is in array
	isNdbChecked(ndb) {
		console.log("ndbCheck: ndb = " + ndb);
		for (var i = 0; i < this.state.checkedItems.length; i++) {
			console.log("checking against " + this.state.checkedItems[i].ndb);
			if (this.state.checkedItems[i].ndb == ndb) {
				console.log("MATCH");
				return i;
			}
		}
		return -1;
	}
	
	
	getQueryFromPath(path) {
		console.log("setQuery() path=", path);
		
		if (path[1] == "user" && path[2] == "search") {
			console.log('setting query:', path[3]);
			return path[3];
		}
		console.log('returning null');
		return null;
	}
	
	setQuery(q) {
		console.log("set query. q=", q);
		console.log("HISTORY: ", this.props.history.location.pathname.split("/")[2]);
		if (this.props.history.location.pathname.split("/")[2] != "search") {
			console.log("pushing history: ", q);
			this.props.history.push("/user/search/" + q);
		} else {
			if (this.state.query != q) {
				console.log("update query:");
				this.setState({
					query: q,
					searchNutrients: [],
					searchItems: []
				});
			} else {
				console.log("QUERY SAME AS BEFORE");
			}
		}
	}
	
	
	//search callback to update search component all at once
	searchUpdateHandler(newResults) {
		console.log("searchUpdateHandler:", newResults);
		this.setState({
			searchItems: newResults.items,
			searchNutrients: newResults.nutrients,
			searchNutNames: newResults.nutNames
		})
	}
	
	
	loginRedirect() {
		this.props.history.push("/users/login");
	}
	
	loginSuccess(user) {
		console.log("loginSuccess route. user:", user);
		this.setState({
			user: user
		});
		this.props.history.goBack(2);
	}
	  
	
}


export default UserApp;









