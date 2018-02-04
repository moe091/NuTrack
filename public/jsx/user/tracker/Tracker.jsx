import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import TrackerAdd from './TrackerAdd.jsx';
import TrackerShow from './TrackerShow.jsx';


class Tracker extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			meals: []
		}
	}
	
	render() {
		return (
			<div className="col-sm-10 p-0 main-col">
				<Route path='/user/tracker/add' render={() => {
						return (
							<TrackerAdd 
								meal={this.props.meal}
								trackerAddHandler={this.props.trackerAddHandler}
								trackMealHandler={this.trackMealHandler.bind(this)}
								isMealSelected={this.props.isMealSelected}
								checkedItems={this.props.checkedItems}
								type="tracker"
							/>
						)
					}}
				/>
				
				<Route path='/user/planner/add' render={() => {
						return (
							<TrackerAdd 
								meal={this.props.meal}
								trackerAddHandler={this.props.plannerAddHandler}
								
								//props.type will be passed to trackMealHandler when called, if type is planner it post to the planner/create route, if type is 'tracker' it will post to tracker/create
								trackMealHandler={this.trackMealHandler.bind(this)}
								isMealSelected={this.props.isMealSelected}
								checkedItems={this.props.checkedItems}
								type="planner"
							/>
						)
					}}
				/>
				
				
				
				
				<Route path='/user/tracker/show' render={() => {
						return (
							<TrackerShow type="tracker" />
						)	
					}}
				/>
				
				<Route path='/user/planner/show' render={() => {
						return (
							<TrackerShow type="planner" />
						)	
					}}
				/>
				
				
			</div>
		)
	}
	
	
	//type = 'planner' or 'tracker'
	trackMealHandler(meal, time, type) {
		console.log("track meal:", meal);
		console.log("time: ", time);
		
		var route;
		if (type == "tracker") {
			route = "../../user/tracker/create";
		} else if (type == "planner") {
			route = "../../user/planner/create";
		} else {
			console.warn("<Tracker>, trackMealHandler() - type is not equal to 'tracker' or 'planner', something is wrong. this:", this);
		}
		
		
		fetch(route, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				meal: meal,
				date: time
			})
		})
		.then((response) => response.json())
		.then((res) => {
			console.log("tracker/create response:", res);
			if (type == "tracker") {
				this.props.history.push("../../user/tracker/show");
			} else if (type == "planner") {
				this.props.history.push("../../user/planner/show");
			} else {
				console.warn("type not 'planner' or 'tracker', this:", this);
			}
		}).catch((err) => {
			console.log("error fetching tracker/create: ", err);
		})
	}
	
	
}

export default Tracker;