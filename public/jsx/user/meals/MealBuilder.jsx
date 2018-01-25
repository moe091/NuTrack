import React from 'react';
import ReactDOM from 'react-dom';

import RangeSlider from '../components/RangeSlider.jsx';
import NutrientTable from '../components/NutrientTable.jsx'; 

/**
	TODO: 
		- change nutrientMap to this.nutrientMap to pull it off global scope
		- refactor component to make it more modular/reusable, specifically so that it can be used in the TrackerAdd component.
		
		- refactor render func slighty, instead of calling renderItems on the state.items array, use .map on the state.items array and the call renderItem on each item(will have to refactor renderItems array into renderItem array as well)
		- make a builderItem component(probably a stateless functional comp) to represent each item, instead of manually rendering each one inside of this component, that should clean things up a lot
		
		
	MealBuilder:
		:: Recieves an array of Numbers(ndbno's) - this.props.checkedItems
		:: Makes an Ajax call upon mounting, passing the checkedItems array to the user/item/list route to recieve an array of food item objects containing the full details and nutrients of each item whose ndbno was in checkedItems array
		:: Renders a builder element for each item in the state.items array received from the ajax call above. Builder elements have a slider to select the number of servings for that item. Each slider has an onInput callback that is created by the createAmountUpdate function
		:: Each item also has it's own nutrientTable that displays the total nutrients for the amount of servings selected by the slider/range input, table updates automatically. The nutrientTotals that are passed to <NutrientTable> are calculated by createNutrientDisplayObj(nutrientObj), to create a nutrientTotals object for a single item pass that item as a parameter to the createNutrientDisplayObj function
		:: There is also a large NutrientTable at the top that displays the total nutrient values for all items and their serving amounts. To calculate the nutrientTotals to pass into the <NutrientTable> for all objects, call createNutrientDisplayObj() and pass null in - this causes the function to calculate total for every item in this.state.nutrients
			TODO: change createNutrientDisplayObj to accept an array, pass in an array of 1 item to calculate totals for just that item, pass in the full this.state.items array to calculate the total across all objects. This will just make things clearer and simpler

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
				<div className="row h-100 newMeal-item-row">
					
					{this.renderItems()}
					
				</div>
				
				
		)
	}
	
	
	componentDidMount() {
		//pass props.items(array of Numbers containing ndbno's) to user/item/list route via ajax, recieve watchedNutrients and full nutrient objects for each ndb, and then calls setState to update this.state.watched and this.state.nutrients
		this.getItemInfos();
	}
	
	
	//Ajax function, pass in the list of ndbs and receive 'nutrients': an array containing full nutrient info for each item from the list of ndbs passed on. also receive 'watched', a Number array containing the nutrient_id of the current users watched_nutrients
	getItemInfos() {
		var reqBody = {
			ndbs: this.props.checkedItems,
			type: 'f'
		}
		fetch('../../user/item/list', {
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
	
	/**
		recieves: 
			nut - a single nutrient object containing full nutrient info of a single food item
			nutVals - an object, containing a property called e.g 'nut_205' for nutrient_id=205, for each watchedNutrient of the current user. each prop is set to 0 by default
		
		:: Updates the properties of nutVals object - for each property matching a nutrient_id of the item passed in to the nut parameter it adds the value for that nutrient in the nut object times the number of servings(nut.amount). By the end nutVals should be an object containing a property for each watchedNutrient of the current user that is equal to the total for the item the nutVal represents(total is amount of specified nutrient per serving & # of servings)
	**/
	addNutrientVals(nut, nutVals) {
		console.log("nut = ", nut);
		console.log("display = ", nutVals);
		
		var itemTotal = 0;
		nut.report.food.nutrients.forEach((n) => {
			//if no measures exist, use the total nutrient val
			if (n.measures.length < 1) {
				n.measures.push({
					value: n.value,
					unit: n.unit,
					qty: 1,
					label: "serving"
				});
			}
			
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
	
	
	//creates variable to pass through to NutrientTable. leave nutrientObj null to include all vals in this.state.nutrientObj. pass a val to only include 1, won't work if nutrient isn't in this.state.nutrients
	createNutrientDisplayObj(nutrientObj) { 
		var watched = (this.state.watched.length == 0) ? [203, 204, 205, 208, 269, 307] : this.state.watched;
		var nutVals = {};
		var watchedNuts = {};
		
		watched.map((id) => {
			nutVals["nut_" + id] = 0;
		});
		
		for (var i = 0; i < this.state.nutrients.length; i++) {
			if (nutrientObj == null || this.state.nutrients[i] == nutrientObj) { //if nutrientObj is null include all objs, if it's not null only include the value passed through(kind of a quick hack, so that the function can be used to get info on individual items or for all items in state) 
				//TODO: just switch nutrientObj to be an array(that is sometimes length 1)
				this.addNutrientVals(this.state.nutrients[i], nutVals);
			}
		}
		
		var watchedNuts = watched.map((w) => {
			if (typeof nutVals["nut_" + w] != "undefined") {
				return {
					id: w, 
					name: this.state.nutrientMap.get(w).name,
					abbr: this.state.nutrientMap.get(w).abbr,
					unit: this.state.nutrientMap.get(w).unit,
					total: nutVals["nut_" + w].toFixed(2)
				}
			}
		});
		
		console.log("WATCHED NUTS:", watchedNuts);
		
		return watchedNuts;
	}
	
	//updates when mealName text input is changed. sets mealName which will be used as the name of the meal when it is actually created
	changeName(e) {
		this.setState({
			mealName: e.target.value
		})
	}
	
	//callback for createMeal button - should be clicked when user is done setting values and naming meal and wants to create it. calls the createMealHandler passed down from NewMeal. calls /user/meals/create route via POST and passes in a mealObj containing the items, name of meal, and pre-calculated nutrientTotals(for nutrientTables). then calls NewMeals showMealHandler to redirect to the ShowMeal component
	createMealClick(e) {
		console.log("CREATE MEAL! state:", this.state);
		this.props.createMealHandler(this.state.nutrients, this.state.mealName, this.createNutrientDisplayObj());
	}
	
	renderItems() {
		return (
			<div className="content-section h-100 w-100"> 
				<div className="section-header">
					
					<label value="Name Meal">Meal Name</label>
					<input type="text" onChange={this.changeName.bind(this)}></input>
					<button type="button" className="btn btn-default" onClick={this.createMealClick.bind(this)}>Create Meal</button>
				
				</div>
				<h4>Total Nutrient Values:</h4>
				<NutrientTable nutrients={this.createNutrientDisplayObj()} />
				{this.state.nutrients.map((item) => {
					return (
						<div className="content-block block-third" key={item.report.food.ndbno}>
							<div className="block-header">
								{item.report.food.name.substring(0, 60)}
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
								<label className="detail-label">
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
								
								<RangeSlider minRange='0' maxRange='5' defaultVal={item.amount} sliderInput={this.createAmountUpdate(item)} sliderStep='0.25' wrapperClass='newMeal-item-amount' /> 
								
								<NutrientTable nutrients={this.createNutrientDisplayObj(item)} />
						</div>
					)
				})}
				
			</div>
		)
	}
	
	
	//creates a function to be used as the onInput callback for each meals serving amount slider. Takes the item corresponding to the slider as a parameter and returns a function that changes the .amount prop of that item and updates state
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










