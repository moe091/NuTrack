

import React from 'react';
import ReactDOM from 'react-dom';

/**
	Dynamic SideBar that will be present throughout the whole User area of the app. 
	Used to access Tracker, Planner, Meals, Search, etc pages as well as dynamically add items to meals, planner, and tracker based on the currently displayed component and its state
	
	TODO: 
		-Redesign Layout: put a container inside SideBar taking up the entire space. Each row will be a bootstrap row, with full length links being a col-9 with an empty col-3 to the right and links with a right-link/icon-link being a col-9 for the main link + a col-3 for the little icon/side button. the col-3's will be a slightly darker color than the col-9s and the col-9s will probably have a box-shadow on the right to give a 3d effect. 
		-Make Sidebar collapse, in its collapsed state it will only be the width of the icon-sized buttons. Each link will be replaced by an Icon(Tracker, Planner, Meal, Search) with an icon at the top to expand it. Add to meal/tracker/planner and create meal buttons won't be present on collapsed sidebar.
		-The top nav should be responsible for account-related navigation such as user profile/settings, logging in and out, and navigating between userApp area and homepage
		
		IDEAS:
		- for the 'Selected Items: N' label, make it display a NutrientTable on hover
**/
class SideBar extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			searchText: ""
		}
	}
	/**
		Top: checkedItems:
			label-'Selected Items'
			each item(i): 
				item[i].name		-
			;
			
			Tracker/Planner/Meal
			each type(i):
				type[i].name		+
			;
			
			LINK:
				Compare Selected Items
			; {FUTURE TASK - implement comparisons later}
	**/
	
	
	/**
		TODO:/Idea: Tracker, Meal, and Planner, split the right section into two halves(also make it a lil wider, col-4 instead of col-3). Right section will be a dropdown button icon, left section will be the +/add btn. The dropdown will cause a section to slide out under the button that displays extra info.
		
		For Meals it will display 4-6 most recent meal names as links that lead to that meals page
		
		For Tracker/Planner it will dispaly a NutrientTable for the last day/week/month/etc based on your default settings(default default is week). Or maybe have it display all 3 on top of eachother.
	**/
	render() {
		return (
			
			<div className="sidebar w-100 h-100">
				
				<label className="sidebar-search-label">Search</label>	
				<div className="sidebar-section sidebar-search-section">
					<input type="text" className="sidebar-search-text sidebar-input" value={this.state.searchText} onChange={this.searchTextInput.bind(this)} ></input>
					<button className="sidebar-search-btn sidebar-input" onClick={this.searchBtnClick.bind(this)} >
						<i className="fa fa-search sidebar-icon"></i>
					</button>
				</div>
				
					<div className="sidebar-section sidebar-main-section row m-0">
						<a onClick={this.backToSearchHandler.bind(this)} className="col-sm-12 sidebar-item-main p-1">
							Results For {this.props.query}
						</a>
					</div>
					
				
				<label>{this.props.checkedItems.length} Selected Items:</label>
				<div className="sidebar-section container-fixed sidebar-list-section">
					{
						this.props.checkedItems.map((item) => {
							return this.renderSelectedItem(item);
						})
					}
				</div>
				
				<div className="sidebar-main-group container-fixed">
					<div className="sidebar-section sidebar-main-section row m-0">
						<a onClick={this.trackerShowHandler.bind(this)} className="col-sm-9 sidebar-item-main p-1">Tracker</a>
						<a onClick={this.props.trackerAddHandler}className="col-sm-3 sidebar-item-right p-1">
							<i className="fa fa-plus sidebar-icon"></i>
						</a>
					</div>
				
					<div className="sidebar-section sidebar-main-section row m-0">
						<a onClick={this.plannerShowHandler.bind(this)} className="col-sm-9 sidebar-item-main p-1">Planner</a>
						<a onClick={this.props.plannerAddHandler} className="col-sm-3 sidebar-item-right p-1">
							<i className="fa fa-plus sidebar-icon"></i>
						</a>
					</div>
				
					<div className="sidebar-section sidebar-main-section row m-0">
						<a onClick={this.showMealHandler.bind(this)} className="col-sm-9 sidebar-item-main p-1">Meals</a>
						<a onClick={this.newMealHandler.bind(this)} className="col-sm-3 sidebar-item-right p-1">
							<i className="fa fa-plus sidebar-icon"></i>
						</a>
					</div>
				</div>
				
				
			</div>
			
			
		)
	}
	
	renderSelectedItem(item) {
		return (
		
			<div key={item.ndb} className="row sidebar-list-item m-0">
				<a className="col-sm-9 sidebar-list-item-main sidebar-item-main p-1">
					{item.name}
				</a>
				<a onClick={this.createDeselectHandler(item)}className="col-sm-3 sidebar-list-item-right sidebar-item-right p-1">
					<i className="fa fa-times sidebar-icon sidebar-list-icon"></i>
				</a>
			</div>
		
		)
	}
	
	createDeselectHandler(item) {
		//use arrow func to bind
		return (e) => {
			this.props.checkItemHandler({
				ndb: item.ndb,
				name: item.name,
				checked: false
			});
		}
	}
	
	
	searchTextInput(e) {
		this.setState({
			searchText: e.target.value
		});
	}
	
	
	backToSearchHandler() {
		console.log("back to search, query=" + this.props.query);
		this.props.history.push("../../user/search/" + this.props.query);
	}
	
	trackerShowHandler() {
		this.props.history.push("../../user/tracker/show");
	}

	//update route, causes re-render with <PlannerAdd> component in main area of page, passes in appropriate props
	plannerShowHandler(e) {
		this.props.history.push("../../user/planner/show");
	}
	
	//update route, cause re-render with <ShowMeal> component in main section of page.
	showMealHandler(e) {
		this.props.history.push("../../user/meals/show");
	}
	
	//update route, cause re-render with <NewMeal> component in main section of page
	newMealHandler(e) {
		this.props.history.push("../../user/meals/new");
	}
	
	searchBtnClick(e) {
		this.props.setQueryHandler(this.state.searchText);
	}
	
}

export default SideBar;



/** 
	__________________OLD SIDEBAR__________________
	
	<div className="sidebar">
	
				<div className="sidebar-spacer"></div>

				<div className={"sidebar-label text-center " + ((this.props.checkedItems.length > 0) ? "sidebar-mid" : "sidebar-faded")} >
					{this.props.checkedItems.length + " items selected"}
				</div>
				<div className="sidebar-rowGroup">
					<a onClick={this.props.trackerShowHandler} className="sidebar-link"><div className="sidebar-segment"> <i className="fa fa-tasks sidebar-icon" aria-hidden="true"></i> Tracker</div></a>
					<a onClick={this.props.trackerAddHandler} className="sidebar-link right-link"><div className="sidebar-segment right-segment"><i className={"fa fa-plus sidebar-icon right-icon" + (this.props.plusEnabled ? '' : ' icon-disabled')}></i></div></a> 
				</div>

				<div className="sidebar-rowGroup">
					<a href="#" onClick={this.props.plannerAddHandler} className="sidebar-link"><div className="sidebar-segment"> <i className="fa fa-calendar sidebar-icon" aria-hidden="true"></i> Planner</div></a>
					<a href="#" className="sidebar-link right-link"><div className="sidebar-segment right-segment"><i className={"fa fa-plus sidebar-icon right-icon" + (this.props.plusEnabled ? '' : ' icon-disabled')}></i></div></a> 
				</div>

				<div className="sidebar-section">
					<a onClick={this.props.showMealHandler}><div className="sidebar-segment segment-head"> <i className="fa fa-cutlery sidebar-icon" aria-hidden="true"></i> Meals</div></a>
					<a disabled={this.props.plusEnabled} onClick={this.props.newMealHandler}><div className="link-div sidebar-segment segment-item meal-item meal-item-0">Create Meal</div></a>
				</div>

				<div className="sidebar-section">
					<div className="sidebar-segment segment-head"> <i className="fa fa-bar-chart sidebar-icon" aria-hidden="true"></i> Comparisons</div>
					<a href="#" className="sidebar-link"><div className="sidebar-segment segment-item compare-item compare-item-0">Comparison #1</div></a>
					<a href="#" className="sidebar-link"><div className="sidebar-segment segment-item compare-item compare-item-1">Comparison #2</div></a>
					<a href="#" className="sidebar-link"><div className="sidebar-segment segment-item compare-item compare-item-2">Comparison #3</div></a>
					<a href="#" className="sidebar-link"><div className="sidebar-segment segment-item compare-item compare-item-3">Comparison #4</div></a>
				</div>	

			</div>
			
			**/