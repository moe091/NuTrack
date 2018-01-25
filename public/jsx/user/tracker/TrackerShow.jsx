import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';

import TrackerDay from './TrackerDay.jsx';
import NutrientTable from '../components/NutrientTable.jsx';
 
import Datetime from 'react-datetime';


/**
	Tracker Show displays a list of days in chronological order, each day is a <TrackerDay> component that displays the meals for that day in chronological order.
	:User can select a time period (day/week/month/custom) and a startDate and/or endDate
	:User can click buttons to view stats and graphs for chosen time periods(todo: or check off select days and only display stats for the selected days)
	
	TODO: 
		- Add a 'custom' timePeriod, where instead of being a set number of days the user selects both the startDate and endDate and TrackerShow displays all days inbetween those two dates. If <3 days are selected set <TrackerDay> styleTypes to 'day', <=7 set to 'week', >7 set to 'month'
		- Add buttons to view stats and graphs for selected days,
		- Add checkboxes to each TrackerDay comp so that user can select days before clicking buttons to view stats/graphs for those days
**/
class TrackerShow extends React.Component {
	constructor(props) {
		super(props);
		var ed = new Date(); //set end date to current date
		var sd = new Date(); //just creating a date object for start date
		sd.setDate(ed.getDate() - 7); //set start date to end date - 7(one week ago)
		
		var opts = { //willbe passed to TrackerOptions and updated by callback from TrackerOptions
			chosenDate: 'end',
			endDate: ed,
			timePeriod: 6,
			startDate: sd
		}
		
		this.state = {
			meals: [], //this is ALL of the users meals, not necessarily sorted
			endDate: new Date(), //redundant, refactor to use options.endDate to keep things synced
			term: 'week',
			message: 'Your Tracker',
			dates: [], //will store all the dates that are to be displayed. e.g, will have length 7 if term = 'week', or 1 if term = 'day'
			watchedNutrients: [203, 204, 205, 208, 269, 307], //default watchedNutrients. Will be updated in Ajax call if user has different watchedNuts set
			sortedMeals: [], //will contain an organized list of meals for each date to be displayed. sortedMeals[i] = {date: Date, meals: []} sortedMeals[i].meals[j] = 
			
			//options will be passed to TrackerOptions component. TrackerOptions will update the options appropriately on any change, then call TrackerShow.updateOptions(which will also be passed to TrackerOptions as prop). TrackerShow will copy the object and use it to setState triggering a re-render, keeping everything looking and working correctly. This way the options are all in one place and TrackerShow only needs one callback function to pass on to TrackerOptions - TrackerShow is already getting pretty bloated.
			options: opts
		}
		
		this.styles = new Map();
		this.styles.set(0, 'day');
		this.styles.set(6, 'week');
		this.styles.set(30, 'month');
		
		
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
			
			//create dates here, so it can be used to sate state.dates and also to set state.sortedMeals via this.createMealDates(dates, meals), dates needs to be defined before the call to setState so it can be used, or I'd have to call createDateArray again
			var dates = this.createDateArray(res.endDate, this.state.options.timePeriod);
			this.setState({
				meals: res.tracker.meals,
				endDate: res.endDate,
				term: res.term,
				message: res.message,
				dates: dates,
				watchedNutrients: res.watchedNutrients,
				sortedMeals: this.createMealDates(dates, res.tracker.meals)
			})
		}).catch((err) => console.log("ERROR fetching show: ", err));
		
	}
	
	createDateArray(end, length) {
		
		//dates will include start date and end date - so: 'for (i is less than OR EQUAL TO length)' - so: length should be 1 shorter than the number of dates I want.
		if (length == 'day') length = 0; 
		if (length == 'week') length = 6; 
		if (length == 'month') length = 30;
		length = Number(length);//because the html <select> element sets a string instead of a number. TODO: convert this right away on prop update instead
		
		var dates = [];
		
		for (let i = 0; i <= length; i++) {
			let d = new Date();
			d.setDate(end.getDate() - i);
			
			dates.unshift(d);
		}
		return dates;
	}
	
	
	createMealDates(dates, allMeals) {
		
			var sortedMeals = dates.map((date, index) => {
				let meals = [];


				for (let i = 0; i < allMeals.length; i++) {

					if (allMeals[i].hasOwnProperty('meal')) {

						if (typeof allMeals[i].meal.date == 'string') {
							allMeals[i].meal.date = new Date(allMeals[i].meal.date);
						}

						if (date.toDateString() == allMeals[i].meal.date.toDateString()) {
							meals.push(allMeals[i].meal);
						}

					}	
				}

				meals.sort((a, b) => {
					return a.date - b.date;
				});
				let mealsForDay = {meals: meals, date: date, key: index};
				return mealsForDay;

			});

			return sortedMeals;
	}
	
	
	/**
		Callback function passed into each TrackerDay element. TrackerDay sets onClick of it's outermost element to clickDay(props.date), actually calling the function when setting the onClick prop so that onClick is set to the function returned by the clickDay function. When onClick prop is set, date of current TrackerDay element is passed in and clickDay creates a function that uses the date to handle clicking on that date:
		
		it creates a modal displaying details for that specific day(including the meals and links to those meals and a NutrientTable for just that day), and also includes links/buttons to add meals to that days tracker
	**/
	clickDay(date) {
		return (function(e) {
			console.log('this = ', this);
			console.log("clicked on day: ", date);
			console.log('target: ', e.target);
		}).bind(this);
	}
	
	clickMeal(meal) {
		return (e) => {
			console.log('this = ', this);
			e.stopPropagation();
			console.log('meal: ', meal);
		}
	}
	
	/**
		Render an individual day
		@param mealsForDay: object containing a Date object representing the current day and an array of meal items for that day
	**/
	renderDay(mealsForDay) {
		return (
			<TrackerDay meals={mealsForDay.meals} date={mealsForDay.date} styleType={this.styles.get(this.state.options.timePeriod)} key={mealsForDay.key} clickDay={this.clickDay.bind(this)} clickMeal={this.clickMeal.bind(this)} />
		)
	}
	
	/**
		Handles all option updates from the TrackerOptions component. 
		options: {
			startDate: Date
			endDate: Date
			timePeriod: Number //how many days to display, e.g 0 = 1day, 6 = 1 week(is 1 less than the number of days, because days 0 to options.timePeriod, inclusive, are rendered. <TrackerOptions> makes sure startDate, endDate and timePeriod are synced up, options.timePeriod is just used to know how to display and style the day elements
		}
	**/
	optionUpdateHandler(options) {
		//create a new object that is a copy of options
		console.log('optionUpdate: oldOpts:', this.state.options);
		var newOpts = Object.assign({}, options);
		
		var dates = this.createDateArray(newOpts.endDate, newOpts.timePeriod);
		//set state.options to the new options object to update values and trigger render
		this.setState({
			options: newOpts,
			dates: dates,
			sortedMeals: this.createMealDates(dates, this.state.meals)
		});
		
		console.log('newOpts:', newOpts);
		
	}
	
	
	/**
		Render a content-section that takes up 100% of it's parent element. At the top render TrackerOptions component, below that render a NutrientTable component to display the total nutrients for all displayed dates, and then below that render a TrackerDay component for each day between startDate and endDate(state.sortedMeals will already contain an array full of only the elements needed for each day between startDate and endDate)
	**/
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
						this.state.sortedMeals.map((mealsForDay) => {
							return this.renderDay(mealsForDay);
						})
					}
				</div>
			
			</div>
		)
	}

	
	/**
		basically just loop through all of the nutrients for each meal of each day and add the nutrient values to create the totals object to be passed to the NutrientTable component, then create <NutrientTable> passing in the newly created totals.
	**/
	createNutrientTable() {
		var totals = this.state.watchedNutrients.map((wn) => {
			return {id: wn, total: 0}
		});
		
		var sorted = this.state.sortedMeals;
		for (var n in totals) { //for every item in totals, go through each nutrientTotal, for each meal, on each date. If the id's match then add the meals nutrientTotal to the element of total with matching id
			
			for (var i in sorted) {
				for (var j in sorted[i].meals) {
					for (var k in sorted[i].meals[j].nutrientTotals) {
						if (sorted[i].meals[j].nutrientTotals[k].id == totals[n].id) {
							
							//add total from current meals nutrientTotals[] to totals[]
							totals[n].total+= Number(sorted[i].meals[j].nutrientTotals[k].total);
							
							//if totals[n] doesn't have a property called 'name', the other props(name, abbr, and unit) haven't been copied over yet, so do that. This only needs to be done once, that's why this check is here. total is the only value that is updated every time.
							if (!totals[n].hasOwnProperty('name')) {
								totals[n].name = sorted[i].meals[j].nutrientTotals[k].name;
								totals[n].abbr = sorted[i].meals[j].nutrientTotals[k].abbr;
								totals[n].unit = sorted[i].meals[j].nutrientTotals[k].unit;
							}
							
						} //if sorted.meals.nutrientTotaks.id = totals.id
					} // for k in sorted.meals.nutrienttotals
				} // for j in sorted.meals
			} //for i in sorted
		
		} //for n in totals
		
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
	}
	
	/**
		Render a content-section to display the options in. Inside the content section render a datePicker for startDate on the left, a dropdown/select element for choosing the timePeriod(day/week/month) and another datepicker for endDate
	**/
	render() {
		console.log('rendering options. this:', this);
		return (
			<div className='tracker-props content-section tracker-options-section'>
				<div className='content-block tracker-option-block'>
					<label className='block-label'>Select A Start Date:</label>
					<Datetime value={this.props.options.startDate} renderInput={this.renderDateInput} dateFormat="MM-DD-YYYY" onChange={this.startDateChange.bind(this)} />
				</div>

				<div className='content-block tracker-option-block'>
					<label className='block-label'>Select A Time Period:</label>
					<select defaultValue='6' className='tracker-option-input' onChange={this.timePeriodChange.bind(this)}>
						<option value='0'>Day</option>
						<option value='6'>Week</option>
						<option value='30'>Month</option>
					</select>
				</div>

				<div className='content-block tracker-option-block'>
					<label className='block-label'>OR - Select An End Date:</label>
					<Datetime value={this.props.options.endDate} renderInput={this.renderDateInput} onChange={this.endDateChange.bind(this)} />
				</div>
			</div>
		)
	}
	
	
	/**
		startDateChange() and endDateChange() functions are both called when their respective <Datetime /> is updated. Set the start-or-end date and chosenDate in options then call syncDates functions to sync up the other(start-or-end) date based on the newly updated date and user selected timePeriod value 
	**/
	startDateChange(mDate) { //receives moment date obj, ._d is js date
		this.props.options.chosenDate = 'start';
		this.props.options.startDate = mDate._d;
		
		this.syncDates();
	}
	endDateChange(mDate) {
		this.props.options.chosenDate = 'end';
		this.props.options.endDate = mDate._d;
		
		this.syncDates();
	}
	
	timePeriodChange(e) {
		console.log("SELECTED VALUE: ", e.target.options[e.target.selectedIndex].value);
		this.props.options.timePeriod = e.target.options[e.target.selectedIndex].value;
		
		this.syncDates();
	}
	
	
	
	/**
		 - called whenever startDate, endDate, or timePeriod are updated
		 - keeps startDate and endDate synced, based on timePeriod, when user updates one or the other
		 - calls updateOptions callback when done to update and rerender components
		 
		looks at chosenDate['start' or 'end'] - to find out which date value the user is updating, then looks at timePeriod[1,7 or 30] to set the other date by either adding options.timePeriod days(if startDate was set) or subTracting days(if endDate was set by user)
	**/
	syncDates() {
		this.props.options.timePeriod = Number(this.props.options.timePeriod);
		if (this.props.options.chosenDate == 'start') { //user is setting startDate manually
			//add timePeriod days to find endDate and set it
			this.props.options.endDate = new Date(this.props.options.startDate);
			this.props.options.endDate.setDate(this.props.options.endDate.getDate() + this.props.options.timePeriod);
			//TODO: update endDate component to match new date
			
		} else { //user is setting endDate, do the same as above but backwards
			
			this.props.options.startDate = new Date(this.props.options.endDate);
			this.props.options.startDate.setDate(this.props.options.startDate.getDate() - this.props.options.timePeriod);
			//TODO: update actual startDate component to match new date
		}
		console.log('sync dates. start: ', this.props.options.startDate.toString())
		console.log('sync dates. end: ', this.props.options.endDate.toString())
		this.props.optionUpdateHandler(this.props.options);
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