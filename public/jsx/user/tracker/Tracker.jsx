import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import TrackerAdd from './TrackerAdd.jsx';


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
							/>
						)
					}}
				/>
				
			</div>
		)
	}
	
	trackMealHandler(meal, time) {
		console.log("track meal:", meal);
		console.log("time: ", time);
		
		fetch('../../user/tracker/create', {
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
		}).catch((err) => {
			console.log("error fetching tracker/create: ", err);
		})
	}
	
	
}

export default Tracker;