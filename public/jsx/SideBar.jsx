

import React from 'react';
import ReactDOM from 'react-dom';

/**
	Dynamic SideBar that will be present throughout the whole User area of the app. 
	Used to access Tracker, Planner, Meals, Search, etc pages as well as dynamically add items to meals, planner, and tracker based on the currently displayed component and its state
	
	TODO: 
		-Redesign Layout: put a container inside SideBar taking up the entire space. Each row will be a bootstrap row, with full length links being a col-9 with an empty col-3 to the right and links with a right-link/icon-link being a col-9 for the main link + a col-3 for the little icon/side button. the col-3's will be a slightly darker color than the col-9s and the col-9s will probably have a box-shadow on the right to give a 3d effect. 
		-Make Sidebar collapse, in its collapsed state it will only be the width of the icon-sized buttons. Each link will be replaced by an Icon(Tracker, Planner, Meal, Search) with an icon at the top to expand it. Add to meal/tracker/planner and create meal buttons won't be present on collapsed sidebar.
		-The top nav should be responsible for account-related navigation such as user profile/settings, logging in and out, and navigating between userApp area and homepage
**/
class SideBar extends React.Component {
	
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
		TODO Next Time:
		- Need checkedItems to contain name of selected item(currently just an int with ndbno):
			- in SearchArea component, create a function to render each table row
			- when rendering the table row, set the callback for checking the items checkbox to by calling a function that creates a function, likes this:
			
			createItemCheckCB(item) {
				return function() {
					//call props.checkItemHandler(handler func in UserApp component)
					this.props.checkItem(item.ndbno, item.name);
				}
			}
			
			then the checkbox's callback will be linked to the items name
			
			So in userApp, the checkItemHandler will just have to be changed to add objects instead of Numbers to checkedItems array, like:
				checkedItems.push({ndbno: ndb, name: name});
				
			This will require re-working many other components that rely on checkedItems(NewMeal/MealBuilder, Maybe TrackerAdd, SideBar, etc)
	**/
	render() {
		return (
			
			<div className="sidebar container-fixed">
				
				<div className="sidebar-section container-fixed">
					<label>{this.props.checkedItems.length} Selected Items:</label>
					{
						this.props.checkedItems.map((item) => {
							return this.renderSelectedItem(item);
						})
					}
				</div>
			</div>
			
			
		)
	}
	
	renderSelectedItem(item) {
		return (
		
			<div className="row sidebar-list-item">
				<a className="col-sm-9 sidebar-list-item-main sidebar-item-main">
					{item.name}
				</a>
				<a className="col-sm-3 sidebar-list-item-right sidebar-item-right">
					<i className="fa fa-plus sidebar-icon sidebar-list-icon"></i>
				</a>
			</div>
		
		)
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