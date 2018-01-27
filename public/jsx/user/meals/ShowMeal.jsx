import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import NutrientTable from '../components/NutrientTable.jsx';

/**
	TODO: 
		- rename this ShowMeals, ShowMeal will be what the component for viewing details of a single meal will be called
	
	ShowMeal displays info about each meal that a user has saved.
**/
class ShowMeal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			meals: [],
			message: "Loading Meals"
		}
		
	}
	
	
	render() {
		return (
			<div className="container-fixed inset-container">
				
				<div className="content-section" id="show-meal-content">
				
					<h1> {this.state.message} </h1>
					{this.state.meals.map((meal, index, arr) => {
						if (index % 2 == 0) {
							if (arr.length > index + 1) {
								return this.renderMealRow(meal, arr[index+1])
							} else {
								return this.renderMealRow(meal, null)
							}
						}
					})}
					
				</div>
			
			</div>
		)
	}
	
	renderMealRow(meal1, meal2) {
		if (meal2 != null) {
			return (
				<div className='row meal-row' key={'row-' + meal1._id}>
					{this.renderMeal(meal1)}
					{this.renderMeal(meal2)}
				</div>
			)
		} else {
			return (
				<div className='row meal-row' key={'row-' + meal1._id}>
					{this.renderMeal(meal1)} 
				</div>
			)
		}
	}
	
	renderMeal(meal) { 
		return (
			<div key={meal._id} className="col-lg-6 show-meal">
				
					<div className="show-meal-meals content-block">
						<div className="block-header">
							{meal.name}
						</div>
						
						<div className="block-space"></div>
						
						<NutrientTable nutrients={meal.nutrientTotals} />
						
						<div className="row m-3 inner-block">
							<div className="inner-title">
								Meal Items
							</div>
							{meal.portions.map((item) => {
								return this.renderItem(item)
							})}
						</div>
						
						<span className="link-span right">
							<a onClick={this.props.trackerAdd(meal)} className='pointer-cursor'><i className="fa fa-calendar-plus-o" aria-hidden="true"></i> Tracker</a>
							<a onClick={this.props.trackerAdd(meal)} className='pointer-cursor'><i className="fa fa-plus-square" aria-hidden="true"></i> Planner</a>
						</span>
						
					</div>
					
			</div>
		)
	}
	
	renderItem(item) { 
		return (
			<div key={item._id} className="col-md-4">
				
				<div className="show-meal-portion block-detail">
					<div className="show-meal-portion-servings">servings {item.servings}</div>
					<span className="show-meal-portion-name">{item.name}</span>
				</div>
				
			</div>
		)
	}
	
	
	componentDidMount() {
		fetch('../../user/meals/showmeals', {
			method: 'GET',
			credentials: 'include',
			headers: {
			 	'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		})
		.then((response) => response.json())
		.then((res) => {
			console.log("ShowMeal response = ", res);
			this.setState({
				meals: res.mealPlans,
				message: res.message
			})
		}).catch((err) => {
			console.log("Catching error in 'ShowMeal.jsx':", err);
			this.setState({
				message: "Error retrieving meals from server"
			})
		});
			
		
	}
	
}


export default ShowMeal;