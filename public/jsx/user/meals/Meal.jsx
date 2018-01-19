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