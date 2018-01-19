import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
 
import Datetime from 'react-datetime';

class TrackerAdd extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			time: new Date()
		}
		
	}
	
	
	render() {
		return (
			<div className="container-fixed inset-container w-100 h-100"> 
				
					<div className="content-section w-50 m-1 p-4 header-bg">
						Add Meal to Tracker: {this.props.meal.name}
					</div>
					
					
					<div className="content-section w-50 h-50 p-4">
						<label className="block-label">Select Date And Time For Meal:</label>
						<Datetime onChange={this.dateChange.bind(this)} />
						
						<div className='block-space-100'></div>
						
						<button className='btn header-bg' onClick={this.trackMeal.bind(this)}>Add To Tracker</button>
					</div>
				
			</div>
		) 
	}
	
	dateChange(param) {
		console.log("dateChange, param = ", param.toDate());
		this.setState({
			date: param.toDate()
		})
	}
	
	
	trackMeal() {
		console.log('this', this);
		this.props.trackMealHandler(this.props.meal, this.state.date);
	}
	
}


export default TrackerAdd;