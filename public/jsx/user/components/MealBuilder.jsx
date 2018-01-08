import React from 'react';
import ReactDOM from 'react-dom';




class MealBuilder extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			items: [],
			nutrients: [],
			itemDetails: []
		}
	}
	
	render() {
		return (
			<div className="col-sm-10 main-col">
				<div className="row">
					
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
			console.log("getItemInfos response:", res);
			this.setState({
				nutrients: res,
				sample: "sample string"
			});
		}).catch((err) => {
			console.log("catch error:", err);
		});
	}
	
	renderItems() {
		return (
			<div className="new-meal-items"> 
			
				{this.state.nutrients.map((item) => {
					return (
						<div className="col-sm-4 newMeal-item">
							<span className="newMeal-item-name">
								{item.report.food.name}
							</span>
						</div>
					)
				})}
				
			</div>
		)
	}
}
 


export default MealBuilder;