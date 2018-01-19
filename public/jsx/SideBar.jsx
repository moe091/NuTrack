

import React from 'react';
import ReactDOM from 'react-dom';

class SideBar extends React.Component {
	
	
	render() {
		return (
			
			<div className="sidebar">
	
				<div className="sidebar-spacer"></div>

				<div className="sidebar-rowGroup">
					<a href="#" className="sidebar-link"><div className="sidebar-segment"> <i className="fa fa-tasks sidebar-icon" aria-hidden="true"></i> Tracker</div></a>
					<a href="#" onClick={this.props.trackerAddHandler} className="sidebar-link right-link"><div className="sidebar-segment right-segment"><i className={"fa fa-plus sidebar-icon right-icon" + (this.props.plusEnabled ? '' : ' icon-disabled')}></i></div></a> 
				</div>

				<div className="sidebar-rowGroup">
					<a href="#" onClick={this.props.plannerAddHandler} className="sidebar-link"><div className="sidebar-segment"> <i className="fa fa-calendar sidebar-icon" aria-hidden="true"></i> Planner</div></a>
					<a href="#" className="sidebar-link right-link"><div className="sidebar-segment right-segment"><i className={"fa fa-plus sidebar-icon right-icon" + (this.props.plusEnabled ? '' : ' icon-disabled')}></i></div></a> 
				</div>

				<div className="sidebar-section">
					<a disabled={this.props.plusEnabled} onClick={this.props.showMealHandler}><div className="sidebar-segment segment-head"> <i className="fa fa-cutlery sidebar-icon" aria-hidden="true"></i> Meals</div></a>
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
			
		)
	}
}

export default SideBar;