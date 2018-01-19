import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
 
import Datetime from 'react-datetime';

class TrackerShow extends React.Component {
	constructor(props) {
		super(props);
		
	}
	
	render() {
		
	}
	
}

//TrackerShow will handle the tracker data and ajax, as well as switches between day/week/month display modes. DayTracker, MonthTracker, and WeekTracker components will be children of TrackerShow that get rendered depending on the route. in turn, each specific Tracker will be a grid/table of elements such as WeekTracker will have 7 WeekTrackerDay elements. DayTracker will just display its day since it only has one thing to show.

//*** look into css grid more for a possibly easy way to display the grid of tracker components for each day ***\\