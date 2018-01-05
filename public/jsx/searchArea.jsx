import React from 'react';
import ReactDOM from 'react-dom';
import {$,jQuery} from 'jquery';




class SearchArea extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			query: null,
			message: "Search Resdfawefults"
		}
	}
	
	
	render() {
		return(
			<div className="search-area">
				<h2>{this.props.message}</h2>
				<SearchTable />
			</div>
		)
	}
	
	componentDidMount() {
	
	
		fetch('/food/search/results/' + this.props.query)
		.then((resp) => resp.json())
		.then(function(data) {
			console.log("data = ", data);
		});
		
	}
	
	
	
}

//Table will render the actual table. It will handle the headers itself and have data
//from server for the watchedNutrients so it can render the header cells
//Each row will be a component. All row components will be held by a parent class that
//handles ajax calls(is given array of ndbno's, and uses each element to create a row)

//Search Area handles the initial call that queries the API with the search string
//SearchTable renders table, uses data from SearchArea's ajax call to name headers
//TableData component is created by SearchTable and given list of ndbno's
//TableData requests nutrientData for each ndbno and uses it to create a TableRow
class SearchTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			nutNames: ["a", "b", "c", "d", "e"]
		}
	}
	
	render() {
		return (
			<table className="table">
				<thead className="thead-inverse">
					<tr>
						<th>{this.state.nutNames[0]}</th>
						<th>{this.state.nutNames[1]}</th>
						<th>{this.state.nutNames[2]}</th>
						<th>{this.state.nutNames[3]}</th>
						<th>{this.state.nutNames[4]}</th>
					</tr>
				</thead>
				
				<tbody>
					
				</tbody>			
			</table>
		)
	}
}

export {SearchArea, SearchTable}