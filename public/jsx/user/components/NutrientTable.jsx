import React from 'react';
import ReactDOM from 'react-dom';

function NutrientTable(props) {
	
	function createNutrientItem(item) {
		return (
			<li className="list-inline-item">
				<div className="nutrient-table-item-name">
					{item.abbr}
				</div>
				<div className="nutrient-table-item-total">
					{item.total}
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