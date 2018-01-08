import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';

import Nav from '../Nav.jsx';
import SideBar from '../SideBar.jsx';

import MealBuilder from './components/MealBuilder.jsx';



class NewMeal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			items: []
		}
	}
	
	render() {
		return (
							<MealBuilder checkedItems={this.props.checkedItems}/>
		)
	}
	
	newMealHandler() {
		console.log("new meal handler. this=", this);
		return (<h1>New Meal Handler Function [NewMeal component]</h1>)
	}
}

export default NewMeal;