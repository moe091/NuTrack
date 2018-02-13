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
- (Web App Idea) -
Crowdsourcing anecdotal information...
e.g. Have many different sections, and for each section a bunch of different topics.
	Section: Software Dev, Topic: What projects were in your portfolio when you got hired?
	Tags: Development Job, First Development Job, Developer Portfolio, Developer Projects, etc.
	users will all post responses, containing text, links, and images, giving their own anecdotal exeperiences, either for themselves or someone they know(and it will be noted in their post if it is about themselves or someone else). Responses can be up/down-voted and reported(for being fake, or whatever else).
	
	Users get some kind of points for posting experiences and getting upvotes. Posts should be backed up with whatever 'evidence' can be provided, and users are supposed to upvote based off of whether they think the experience is true and how helpful it was(as oppossed to whether or not it was what they want to hear, which could encourage fake reports for upvotes).
	
	Users could use the site to get an idea for different things that there isn't usually data for, that can only be based on anecdotal evidence. There will be a lot of evidence/anecdotes in one place and people can quickly gather a general impression of a topic.


------------------
TODO - Front End:
	- Fix TrackerAdd/MealBuilder:  when date is changed on TrackerAdd and component updates, and items(instead of a meal) are selected - causing the MealBuilder to display - the Serving amounts for each item gets reset when component re-renders. The sliders stay in the same position but the # of servings displayed goes back to 1. 
	- Add UserHome component: Display Nutrient Totals for past 7 days. Display Meals so far for current day. Display 3 most recently created meals in a row. Display A row of 'recent searches'(as links, clicking them takes you to search results for that query). Show Planner for the day
	- Show Meal Options on hover in Tracker/Planner
		- Remove Meal From Tracker button
		- NutrientTable display
		- Items List
		- Items list is 2-or-3 by X grid on bottom left, remove meal button is on bottom right. Nutrient Table is across the top
		- On Mobile, make tapping the item bring up the menu(since mobile can't hover), and tapping it again or tapping anywhere else on page closes menu.
		
	
	- empty checkedItems after creating a new meal?
	
		
	- View Item component, Display full info about item(Full list of nutrients, NutrientTable with info for just that item, ingredients list, manufacturer, etc).
	- Edit Meal component - add/remove items. change serving amounts. Rename. When done, click 'Save(will overwrite old meal and replace it on Tracker)' or 'Create New(keep old meal and create a new one with changes)'
	- Create custom items: for items not in database, add a create item component. Items created by user will be stored in that users model under 'custom items' - and all user created items will be stored in a new model 'CustomItems' that will be searched with each search query and combined with USDA search results. CustomItems will have a "User Created Item!" warning so users know it's not an 'official' item and data may be incorrect.
	
	
	
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
			<div className="app-wrapper container-fixed">
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
									<Login loginSuccess={this.loginSuccess.bind(this)} history={this.props.history} />
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
		console.log("oldpath:", this.props.history.location.pathname);
		if (this.props.history.location.pathname == "/users/register") {
			console.log("pushing /registration");
			this.props.history.push("/users/login/registration");
		} else {
			console.log("pushing reg");
			this.props.history.push("/users/login");
		}
	}
	
	loginSuccess(user, redirect) {
		console.log("loginSuccess route. user:", user);
		this.setState({
			user: user
		});
		if (redirect == null) {
			this.props.history.goBack(2);
		} else {
			this.props.history.push(redirect);
		}
	}
	  
	
}


export default UserApp;









