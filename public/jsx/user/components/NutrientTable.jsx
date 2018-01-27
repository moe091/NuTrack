import React from 'react';
import ReactDOM from 'react-dom';


/**
	Renders a nutrient table, displaying any number of nutrients(specified by each element of props.nutrients), showing the name of the nutrient, the amount, and the units for each nutrient.
	
	this component can be displayed in various ways, e.g as a large element spreading across the entire main section of app, or as a small element that is rendered for each item in a list of displayed items on a page. By default is displayed with it's width taking up it's parent html container and font-size set to 1em. Different styles for different uses and sizes are specified in SASS by adding a ruleset for .nutrient-table as a child of whatever element it is being rendered inside(e.g  .show-meal-item .nutrient-table { ... })
	
	PROPS: 
		- nutrients - an Array of objects. each element represents a nutrient whose value is to be displayed by this component.
			nutrients[i].name = (String) name of nutrient
									.abbr = (String) abbreviation(e.g 'Cals' instead of 'Calories')
									.total = (Number) the value/amount of the nutrient
									.unit = (String) string representing the units the nutrient is measured in(e.g 'mg' for milligrams)
**/
function NutrientTable(props) {
	
	function createNutrientItem(item) {
		return (
			<li className="list-inline-item" key={item.id}>
				<div className="nutrient-table-item-name">
					{item.abbr}
				</div>
				<div className="nutrient-table-item-total">
					{Math.round(item.total)}{item.unit}
				</div>
			</li>
		)
	}
	
	return (
		<div className="nutrient-table">
			<ul className="nutrient-table-list list-inline">
				{
					props.nutrients.map((item) => {
						return createNutrientItem(item);
					})
				}
				
			</ul>
			
		</div>
	)
}

export default NutrientTable


