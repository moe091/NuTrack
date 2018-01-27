import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import NewMeal from './NewMeal.jsx';
import ShowMeal from './ShowMeal.jsx';

class Meal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			checkedItems: this.props.checkedItems,
			meals: []
		}
	}
	
	//creates a function that calls this.props.trackerAddHandler and passes in the (meal) parameter.
	//TODO: instead of creating a returning a function to be used as the trackerAddHandler, just set the function to call this.props.trackerAddHandler(was only setup this way so I could log some stuff to the console and see what it's doing). 
	//NOTE: tried to implement todo, and meal wasn't being passed on for some reason. gotta fix that later
	trackerAdd(meal) {
		console.log('this1: ', this);
		var that = this;
		return function() {
			console.log('this2: ', that);
			that.props.trackerAddHandler(meal);
		}
	}
	
	render() {
		return (
			<div className="col-sm-10 p-0 main-col">
				<Route path='/user/meals/new' render={() => {
					return (
						<NewMeal 
							checkedItems={this.state.checkedItems} 
							showMealHandler={this.showMealHandler.bind(this)} 
							trackerAddHandler={this.props.trackerAddHandler}
						/>
					)
				}} />
				
				<Route path='/user/meals/show' render={() => {
						return (
							<ShowMeal
								trackerAdd={this.trackerAdd.bind(this)}
							/>
						)
					}} />
	
			</div>
		)
		 
		
	}
	
	showMealHandler() {
		this.props.history.push("../../user/meals/show");
	}
}  


export default Meal;