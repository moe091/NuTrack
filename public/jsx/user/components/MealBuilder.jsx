import React from 'react';
import ReactDOM from 'react-dom';

import RangeSlider from './RangeSlider.jsx';
import NutrientTable from './NutrientTable.jsx';
/** move this from components to user folder.
	Components should be re-usable
	**/


class MealBuilder extends React.Component {
	constructor(props) {
		super(props);
		
		var nutrientMap = new Map();
		nutrientMap.set(203, {name: 'Protein', abbr: 'Protein', total: 0, unit: 'g', un_mg: 0.001});
		nutrientMap.set(204, {name: 'Total Fat', abbr: 'Fat', total: 0, unit: 'g', un_mg: 0.001});
		nutrientMap.set(205, {name: 'Carbohydrates', abbr: 'Carbs', total: 0, unit: 'g', un_mg: 0.001});
		nutrientMap.set(208, {name: 'Calories', abbr: 'Cals', total: 0, unit: 'kcal'});
		nutrientMap.set(269, {name: 'Sugar', abbr: 'Sug', total: 0, unit: 'g', un_mg: 0.001});
		nutrientMap.set(307, {name: 'Sodium', abbr: 'Sodium', total: 0, unit: 'mg', un_g: 1000});
		nutrientMap.set(601, {name: 'Cholesterol', abbr: 'Chol', total: 0, unit: 'mg', un_g: 1000});
		
		this.state = {
			items: [],
			nutrients: [],
			itemDetails: [],
			watched: [],
			nutrientMap: nutrientMap
		}
	}
	
	render() {
		return (
			<div className="col-sm-10 main-col">
				<div className="row newMeal-item-row">
					
					{this.renderItems()}
					
				</div>
				
				
			</div>
		)
	}
	
	
	componentDidMount() {
		this.getItemInfos();
	}
	
	
	getItemInfos() {
		var reqBody = {
			ndbs: this.props.checkedItems,
			type: 'f'
		}
		fetch('../../food/item/list', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
      },
			body: JSON.stringify(reqBody)
		})
		.then((resp) => resp.json())
		.then((res) => {
			//AJAX response for nutrient data
			
			console.log("getItemInfos response:", res);
			var amounts = [];
			for (var i = 0; i < res.nutrients.length; i++) { //set default amount for each item to 1(serving)
				res.nutrients[i].amount = 1;
			}
			this.setState({
				nutrients: res.nutrients,
				watched: res.watched
			});
			
		}).catch((err) => {
			console.log("catch error:", err);
		});
	}
	
	
	addNutrientVals(nut, nutVals) {
		console.log("nut = ", nut);
		console.log("display = ", nutVals);
		
		var itemTotal = 0;
		nut.report.food.nutrients.forEach((n) => {
			itemTotal = nut.amount * Number(n.measures[0].value); 
			if (this.state.nutrientMap.has(Number(n.nutrient_id))) {
				console.log("\n\nmap units = " + this.state.nutrientMap.get(Number(n.nutrient_id).unit));	
				console.log("nutrient units = " + n.unit);
			}
			
			if (typeof nutVals["nut_" + n.nutrient_id] == "undefined") {
				nutVals["nut_" + n.nutrient_id] = itemTotal;
			} else {
				nutVals["nut_" + n.nutrient_id]+= itemTotal;
			}
			console.log("new total(" + n.nutrient_id + "): " + nutVals["nut_" + n.nutrient_id]);
			
		});
	}
	
	createNutrientDisplayObj(nutrientObj) { //creates variable to pass through to NutrientTable. leave nutrientObj null to include all vals in this.state.nutrientObj. pass a val to only include 1, won't work if nutrient isn't in this.state.nutrients
		var watched = (this.state.watched.length == 0) ? [203, 204, 205, 208, 269, 307] : this.state.watched;
		var nutVals = {};
		var watchedNuts = {};
		
		watched.map((id) => {
			nutVals["nut_" + id] = 0;
		});
		
		console.log('nutVals = ', nutVals);
		console.log('205 = ' + nutVals.nut_205);
		
		for (var i = 0; i < this.state.nutrients.length; i++) {
			if (nutrientObj == null || this.state.nutrients[i] == nutrientObj) { //if nutrientObj is null include all objs, if it's not null only include the value passed through
				this.addNutrientVals(this.state.nutrients[i], nutVals);
			}
		}
		
		var watchedNuts = watched.map((w) => {
			if (typeof nutVals["nut_" + w] != "undefined") {
				return {
					id: w, 
					name: this.state.nutrientMap.get(w).name,
					abbr: this.state.nutrientMap.get(w).abbr,
					total: nutVals["nut_" + w].toFixed(2)
				}
			}
		});
		
		console.log("WATCHED NUTS:", watchedNuts);
		
		return watchedNuts;
	}
	
	
	renderItems() {
		return (
			<div className="newMeal-items"> 
				<NutrientTable nutrients={this.createNutrientDisplayObj()} />
				{this.state.nutrients.map((item) => {
					return (
						<div className="newMeal-item">
							<div className="newMeal-item-name">
								<span className="newMeal-name-span">{item.report.food.name.substring(0, 60)}</span>
							</div>
								<label className="slider-lbl" id={'slider-lbl-' + item.report.food.ndbno}>
									<b>{item.amount ? item.amount : 'N/A'}</b> Servings / 
									{
										(item.report.food.nutrients.length > 0) 
											? 
												(item.report.food.nutrients[0].measures[0].qty * item.amount).toFixed(2) + " " + item.report.food.nutrients[0].measures[0].label 
											: 
												''
									}
								</label>
								<label className="serving-lbl">
									(1 serving = 
									{
										(item.report.food.nutrients.length > 0) 
										?
											item.report.food.nutrients[0].measures[0].qty + ' ' + item.report.food.nutrients[0].measures[0].label
										: 
											''
									}
									)
								</label>
								
								<RangeSlider minRange='0' maxRange='5' defaultVal="1" sliderInput={this.createAmountUpdate(item)} sliderStep='0.25' wrapperClass='newMeal-item-amount' /> 
								
						</div>
					)
				})}
				
			</div>
		)
	}
	
	createAmountUpdate(item) {
		console.log("Create Amount Update. item: ", item);
		console.log("this = ", this);
		item.amount = item.amount ? item.amount : 1;
		var index = this.state.nutrients.indexOf(item);
		return (function(e) {
			console.log("slider Val: ", e.target.value);
			item.amount = Number(e.target.value).toFixed(2);
			console.log("item = ", item);
			
			this.setState({ //workaround for updating array of objs in state. Shoulda used redux..
				nutrients: [
					...this.state.nutrients.slice(0, index),
					Object.assign({}, item),
					...this.state.nutrients.slice(index+1)
				]
			})
			
			
		}).bind(this);
	}
}
/**

	Each meal-item will have an ndb#, the user will be able to add 1 or more items, and for each one choose an amount. The ammount will be the # of servings.
	
	Each serving = nutrient.measures[0].qty + " " + measures.label [e.g: "1 slice" or "1 cup"]
	Each serving = 

**/
 


export default MealBuilder;










