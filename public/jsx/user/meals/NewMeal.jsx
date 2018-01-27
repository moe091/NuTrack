import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';

import Nav from '../../Nav.jsx';
import SideBar from '../../SideBar.jsx';

import MealBuilder from './MealBuilder.jsx';


/**
	Component for creating new meals. Mostly just renders MealBuilder component and handles the createMeal callback for it
**/
class NewMeal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			items: []
		}
	}
	
	render() {
		return (
							<MealBuilder checkedItems={this.props.checkedItems} createMealHandler={this.createMealHandler.bind(this)} />
		)
	}
	  
	
	/**
		callback for creating meals, passed into <MealBuilder> and called when user clicks 'create meal' button. 
		
		- Posts the meal info(nutrients: an item representing a single food product item from USDA database, mealName: user-entered name for meal, nutTotals: Array of pre-calculated values for nutrient totals of the meal for each nutrient in users watchedNutrients setting)
		- calls this.props.showMealHandler and passes in meal name. This should call <UserApp>'s showMealHandler function, which will update the route and render the ShowMeal component
	**/
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
			this.props.showMealHandler(res.meal.name); //trying to keep functions that change the url in the component with the actual route/history object
		}).catch((err) => {
			console.log("createMealClick() - MealBuilder. catch error:", err);
			//TODO: set this.state.message: "Unable to create meal, server failed to respond"(or a more specific error message if possible). 
			//Also, if message != null, then render it in red text at top of MealBuilder component(have to pass message down)
		});
	}
}
 
export default NewMeal;