import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
 
import Datetime from 'react-datetime';

import MealBuilder from '../meals/MealBuilder.jsx';

class TrackerAdd extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			time: new Date()
		}
		
	}
	
	/**
		Render <MealBuilder> if needed.
			- is needed when props.isMealSelected is false, this means that no meal is selected and a new one needs to be created using props.checkedItems. If checkedItems is also empty, display a message saying you need to select a meal or some items to add to tracker
			- if mealbuilder isn't needed, return null, won't effect output html
	**/
	renderBuilderIfNeeded() {
		if (this.props.isMealSelected) {
			return null;
		} else {
			return (
				<div className='wrapper-dark'>
					<MealBuilder checkedItems={this.props.checkedItems} createMealHandler={this.createMealHandler.bind(this)} />
				</div>
			)
		}
	}
	
	//TODO: throw in a ternary, if this.props.isMealSelected == false then render a mealBuilder component, and change onClick of 'Add To Tracker' button to a callback that creates a new meal and then calls the regular trackMeal callback with the newly created meal
	render() {
		return (
			<div className="container-fixed inset-container w-100 h-100"> 
				
					<div className="content-section w-50 m-1 p-4 header-bg">
					
						{
							(this.props.meal == null) 
							?
								"Create Meal Below Before Tracking"
							:
								"Add Meal To Tracker: " + this.props.meal.name
						}
						
					</div>
					
					<div className="content-section w-50 p-4">
						<label className="block-label almost-white">Select Date And Time For Meal:</label>
						<Datetime onChange={this.dateChange.bind(this)} defaultValue={this.state.time} />
						
						<div className='block-space-100'></div>
						
						{this.renderBuilderIfNeeded()}
					
						<button className='btn header-bg' onClick={this.trackMeal.bind(this)}>Add To Tracker</button>
					</div>
				
			</div>
		) 
	}
	
	createMealHandler(p1, p2) {
		console.log("create meal p1=", p1);
		console.log('p2=', p2);
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
		this.props.trackMealHandler(this.props.meal, this.state.date);
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