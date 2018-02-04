import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
 
import Datetime from 'react-datetime';

import MealBuilder from '../meals/MealBuilder.jsx';

class TrackerAdd extends React.Component {
	constructor(props) {
		super(props);
		
		
		var date = new Date();
		var msg =
				(this.props.meal == null) ?
					"Create Meal Below Before Adding Items to " + this.props.type
				:
					"Add Meal '" + this.props.meal.name + "' to " + this.props.type + " on " + date.toDateString() + " at " + (date.toTimeString().split(':')[0] + ':' + date.toTimeString().split(':')[1]);
		
		
		this.state = {
			time: date,
			meal: this.props.meal,
			isMealSelected: this.props.isMealSelected,
			message: msg
		}
		
	}
	
	/**
		Render <MealBuilder> if needed.
			- is needed when props.isMealSelected is false, this means that no meal is selected and a new one needs to be created using props.checkedItems. If checkedItems is also empty, display a message saying you need to select a meal or some items to add to tracker
			- if mealbuilder isn't needed, return null, won't effect output html
	**/
	renderBuilderIfNeeded() {
		if (this.state.isMealSelected) {
			return null;
		} else {
			return (
				<div className='wrapper-dark'>
					<MealBuilder checkedItems={this.props.checkedItems} createMealHandler={this.createMealHandler.bind(this)} />
				</div>
			)
		}
	}
	
	//TODO: throw in a ternary, if this.state.isMealSelected == false then render a mealBuilder component, and change onClick of 'Add To Tracker' button to a callback that creates a new meal and then calls the regular trackMeal callback with the newly created meal
	render() {
		return (
			<div className="container-fixed inset-container w-100 h-100"> 
				
					<div className="content-section w-50 m-1 p-4 header-bg">
					
						{
							(this.state.isMealSelected == false) 
							?
								"Create Meal Below Before Tracking"
							:
								"Add Meal To Tracker: " + this.state.meal.name
						}
						
					</div>
					
					<div className="content-section w-75 p-4">
						<label className="block-label almost-white">Select Date And Time For Meal:</label>
						<Datetime onChange={this.dateChange.bind(this)} defaultValue={this.state.time} />
						
						<div className='block-space-50'></div>
						<div className="text-center almost-white">{this.state.message}</div>
						<div className='block-space-50'></div>
						
						{this.renderBuilderIfNeeded()}
					
						<button className={'btn header-bg ' + (this.state.isMealSelected ? '' : 'btn-disabled')} onClick={(this.state.isMealSelected ? this.trackMeal.bind(this) : null)}>
							{
								(this.type == "tracker") ? "Add To Tracker" : "Add To Planner"
							}
						</button>
						
						<div className="text-center text-danger small">{(this.state.isMealSelected ? '' : "Click 'Create Meal' button above to create a meal before adding to " + this.props.type)}</div>
					</div>
				
			</div>
		) 
	}
	
	createMealHandler(p1, p2) {
		console.log("create meal p1=", p1);
		console.log('p2=', p2);
	}
	
	
	createMealHandler(nutrients, mealName, nutTotals) {
		var mealObj = {
			items: nutrients,
			mealName: mealName,
			nutTotals: nutTotals,
			date: null
		}
		
		fetch('../../user/meals/create', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
      },
			body: JSON.stringify(mealObj)
		})
		.then((resp) => resp.json())
		.then((res) => {
			//AJAX response for nutrient data
			
			console.log("CREATE MEAL: ", res); 
			var mealExists = (res.meal != null)
			this.setState({
				message: res.message,
				meal: res.meal,
				isMealSelected: mealExists
			})
			this.props.showMealHandler(res.meal.name); //trying to keep functions that change the url in the component with the actual route/history object
		}).catch((err) => {
			console.log("createMealClick() - MealBuilder. catch error:", err);
			//TODO: set this.state.message: "Unable to create meal, server failed to respond"(or a more specific error message if possible). 
			//Also, if message != null, then render it in red text at top of MealBuilder component(have to pass message down)
		});
	}
	
	
	dateChange(param) {
		console.log("dateChange, param = ", param.toDate());
		this.setState({
			date: param.toDate()
		})
	}
	
	//calls the trackMealHandler function prop passed down from <Tracker> component and passes in this.state.date(set by the datetime picker rendered in this component) and this.props.meal(passed down from <UserApp> to <Tracker> to this <TrackerAdd> component, contains the selected meal from which the 'Add To Tracker' button was clicked)
	trackMeal() {
		console.log('this', this);
		
		//type('planner' or 'tracker') will tell the trackMealHandler function in <Tracker> component whether to post new meal to the /planner/create or /tracker/create route
		this.props.trackMealHandler(this.state.meal, this.state.date, this.props.type);
	}
	
	
	//TODO: complete this function
	/**
		:: Used when isMealSelected is false
		
		- this function will be used to create a meal first and then call the above trackMeal function. Will use this.state.meal instead of this.props.meal,
		- this.state.meal will be set by the MealBuilderUpdateHandler function, which is a callback passed down to the mealBuilder component that is called whenever user changes something in the mealBuilder. the handler will update the state.meal object to represent a meal based on the current state of the mealBuilder, the object will be used to pass to the createMeal route of the backend API and then the response from that(a newly created meal object belonging to current user) will be used to call trackMeal-as would normally be done from the beginning if isMealSelected was true
	**/
	createMealAndTrack() {
		
	}
	
}


export default TrackerAdd;