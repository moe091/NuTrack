import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';

import TrackerDay from './TrackerDay.jsx';
import NutrientTable from '../components/NutrientTable.jsx';
 
import Datetime from 'react-datetime';

class TrackerShow extends React.Component {
	constructor(props) {
		super(props);
		var ed = new Date();
		var sd = new Date(ed.getDate() - 7);
		var opts = {
			chosenDate: 'end',
			endDate: ed,
			timePeriod: 7,
			startDate: sd
		}
		
		this.state = {
			meals: [],
			endDate: new Date(),
			term: 'week',
			message: 'Your Tracker',
			dates: [],
			watchedNutrients: [203, 204, 205, 208, 269, 307],
			sortedMeals: null,
			
			//options will be passed to TrackerOptions component. TrackerOptions will update the options appropriately on any change, then call TrackerShow.updateOptions(which will also be passed to TrackerOptions as prop). TrackerShow will copy the object and use it to setState triggering a re-render, keeping everything looking and working correctly. This way the options are all in one place and TrackerShow only needs one callback function to pass on to TrackerOptions - TrackerShow is already getting pretty bloated.
			options: opts
		}
		
		
	}
	
	
	componentDidMount() {
		fetch('../../user/tracker/showtracker', {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		})
		.then((response) => response.json())
		.then((res) => {
			res.endDate = new Date(res.endDate);
			console.log('fetch. this=', this);
			console.log("tracker/show response: ", res);
			this.setState({
				meals: res.tracker.meals,
				endDate: res.endDate,
				term: res.term,
				message: res.message,
				dates: this.createDateArray(res.endDate, 'week'),
				watchedNutrients: res.watchedNutrients,
				sortedMeals: null //reset this when now info is retrieved, so that when createMealDates() is called it re-calculates the sortedMeals array
			})
		}).catch((err) => console.log("ERROR fetching show: ", err));
		
	}
	
	createDateArray(end, length) {
		console.log('create date array, end:', end);
		console.log('this:', this);
		if (length == 'day') length = 1; //pointless. wait, actually not, now I can call createDateArray(end, term) instead of having to check if term='day' and only call this func if it's not == 'day'
		if (length == 'week') length = 7;
		if (length == 'month') length = 30;
		var dates = [];
		
		for (let i = 0; i < length; i++) {
			let d = new Date();
			d.setDate(end.getDate() - i);
			
			dates.unshift(d);
		}
		return dates;
	}
	
	
	createMealDates() {
		if (this.state.sortedMeals == null) {
		
			var sortedMeals = this.state.dates.map((date, index) => {
				let meals = [];
				console.log("\n\n\n\n\n\nChecking against date:", date);


				for (let i = 0; i < this.state.meals.length; i++) {
					console.log("meal: ", this.state.meals[i]);

					if (this.state.meals[i].hasOwnProperty('meal')) {

						if (typeof this.state.meals[i].meal.date == 'string') {
							console.log("date was string, newdate:", this.state.meals[i].meal.date.toDateString);
							this.state.meals[i].meal.date = new Date(this.state.meals[i].meal.date);
						}

						if (date.toDateString() == this.state.meals[i].meal.date.toDateString()) {
							meals.push(this.state.meals[i].meal);
						}

					}	
				}

				console.log("premeals:", meals);
				meals.sort((a, b) => {
					return a.date - b.date;
				});
				let mealsForDay = {meals: meals, date: date, key: index};
				console.log("returning mealsForDay: ", mealsForDay);
				return mealsForDay;

			});

			console.log("sortedMeals = ", sortedMeals);
			return sortedMeals;
		} else {
			return this.state.sortedMeals;
		}
	}
	
	renderDay(mealsForDay) {
		console.log("renderDay():", mealsForDay);
		return (
			<TrackerDay meals={mealsForDay.meals} date={mealsForDay.date} styleType='week' key={mealsForDay.key} />
		)
	}
	
	optionUpdateHandler(options) {
		console.log("UPDATE OPTIONS:", options);
	}
	
	render() {
		return (
			<div className='content-section h-100 w-100 tracker-content-section'>
			
				<TrackerOptions optionUpdateHandler={this.optionUpdateHandler.bind(this)} options={this.state.options} />
				<div className='content-section tracker-display-section'>
			
					<div className='tracker-main-nutrient-total'>
						<h3>Nutrient Totals For This Week:</h3>
						{this.createNutrientTable()}
					</div>

					{
						this.createMealDates().map((mealsForDay) => {
							return this.renderDay(mealsForDay);
						})
					}
				</div>
			
			</div>
		)
	}

	
	createNutrientTable() {
		var totals = this.state.watchedNutrients.map((wn) => {
			return {id: wn, total: 0}
		});
		
		var sorted = this.createMealDates();
		console.log("\n\n\n\n\n\n\n\n\n\n\ntotals:", totals);
		console.log('sorted:', sorted);
		for (var n in totals) { //for every item in totals, go through each nutrientTotal, for each meal, on each date. If the id's match then add the meals nutrientTotal to the element of total with matching id
			
			for (var i in sorted) {
				for (var j in sorted[i].meals) {
					for (var k in sorted[i].meals[j].nutrientTotals) {
						console.log('checking ' + sorted[i].meals[j].nutrientTotals[k].id + ' against ' + totals[n].id);
						if (sorted[i].meals[j].nutrientTotals[k].id == totals[n].id) {
							totals[n].total+= Number(sorted[i].meals[j].nutrientTotals[k].total);
							if (!totals[n].hasOwnProperty('name')) {
								totals[n].name = sorted[i].meals[j].nutrientTotals[k].name;
								totals[n].abbr = sorted[i].meals[j].nutrientTotals[k].abbr;
								totals[n].unit = sorted[i].meals[j].nutrientTotals[k].unit;
							}
							
							console.log("added new val, newTotal: " + sorted[n].total);
						}
					}
				}
			}
		
		}
		
		console.log('totals: ', totals);
		return <NutrientTable nutrients={totals} />
							
	}
	
}

/**
	Tracker Options - for choosing the time period(day, week, or month) as well as start OR end date
	- if you choose end or start date, the other gets set automatically based on the time period, e.g if you choose an end date and have 'week' selected, it will set the start date to end date-7 in the end date onChange callback
	- if you set the start/end date and the other date is automatically updated, and THEN you change the time period, the date you manually set will stay the same and the other date will be updated to match the time period:
		: so the endDate and startDate onChange event callbacks need to set the 'chosenDate' variable to 'start' or 'end' so that if the time period is updated, it knows which date to change.
		: by default the end date is the current date and chosenDate is 'end'
**/
class TrackerOptions extends React.Component {
	constructor(props) {
		super(props);
		
		/**
		this.state = {
			chosenDate: 'end',
			endDate: new Date(),
			timePeriod: 'week',
			startDate: (newDate().setDate(this.state.endDate.getDate() - 7)),
			
		}
		**/
	}
	
	updateOtherDate() {
		
	}
	
	render() {
		return (
			<div className='tracker-props content-section tracker-options-section'>
				<div className='content-block tracker-option-block'>
					<label className='block-label'>Select A Start Date:</label>
					<Datetime renderInput={this.renderDateInput} dateFormat="MM-DD-YYYY" onChange={this.startDateChange.bind(this)} />
				</div>

				<div className='content-block tracker-option-block'>
					<label className='block-label'>Select A Time Period:</label>
					<select className='tracker-option-input' onChange={this.timePeriodChange.bind(this)}>
						<option value='1'>Day</option>
						<option value='7'>Week</option>
						<option value='30'>Month</option>
					</select>
				</div>

				<div className='content-block tracker-option-block'>
					<label className='block-label'>OR - Select An End Date:</label>
					<Datetime renderInput={this.renderDateInput} onChange={this.endDateChange.bind(this)} />
				</div>
			</div>
		)
	}
	
	
	/**
		startDateChange() and endDateChange() functions are both called when their respective <Datetime /> is updated. Set the start-or-end date and chosenDate in options then call syncDates functions to sync up the other(start-or-end) date based on the newly updated date and user selected timePeriod value 
	**/
	startDateChange(mDate) { //receives moment date obj, ._d is js date
		console.log("START DATE. p1 = ", p1);
		console.log("p2 = ", p2);
		this.props.options.chosenDate = 'start';
		this.props.options.startDate = mDate._d;
		
		this.syncDates();
	}
	
	endDateChange(mDate) {
		console.log("ennd DATE. p1 = ", p1);
		console.log("p2 = ", p2);
		this.props.optons.choseDate = 'end';
		this.props.options.endDate = mDate._d;
		
		this.syncDates();
	}
	
	timePeriodChange(e) {
		console.log("SELECTED VALUE: ", e.target.options[e.target.selectedIndex].value);
		this.props.options.timePeriod = e.target.options[e.target.selectedIndex].value;
		console.log('Time Period Select Change. select:', e.target);
		console.log('time period select value = ', e.target.value);
	}
	
	
	
	/**
		 - called whenever startDate, endDate, or timePeriod are updated
		 - keeps startDate and endDate synced, based on timePeriod, when user updates one or the other
		 - calls updateOptions callback when done to update and rerender components
		 
		looks at chosenDate['start' or 'end'] - to find out which date value the user is updating, then looks at timePeriod[1,7 or 30] to set the other date by either adding options.timePeriod days(if startDate was set) or subTracting days(if endDate was set by user)
	**/
	syncDates() {
		if (this.props.options.chosenDate == 'start') { //user is setting startDate manually
			//add timePeriod days to find endDate and set it
			this.props.options.endDate.setDate(this.props.options.startDate.getDate() + this.props.options.timePeriod);
			//TODO: update endDate component to match new date
			
		} else { //user is setting endDate, do the same as above but backwards
			
			this.props.options.startDate.setDate(this.props.options.endDate.getDate() - this.props.options.timePeriod);
			//TODO: update actual startDate component to match new date
		}
	}
	
	
	
	//custom render function for <Datetime /> component, just chop off the time part because it's unnecessary here
	renderDateInput(props, openCalendar) {
		
		function clear(){
			props.onChange({target: {value: ''}});
		}
		
			props.value = props.value.split(' ')[0];
		return (
			<div>
				<input {...props} />
			</div>
		)
		
	}
	
	
	
	
	
}

export default TrackerShow;











//TrackerShow will handle the tracker data and ajax, as well as switches between day/week/month display modes. DayTracker, MonthTracker, and WeekTracker components will be children of TrackerShow that get rendered depending on the route. in turn, each specific Tracker will be a grid/table of elements such as WeekTracker will have 7 WeekTrackerDay elements. DayTracker will just display its day since it only has one thing to show.

//*** look into css grid more for a possibly easy way to display the grid of tracker components for each day ***\\