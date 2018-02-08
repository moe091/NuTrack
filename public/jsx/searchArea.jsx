import React from 'react';
import ReactDOM from 'react-dom';
import {$,jQuery} from 'jquery';



//pull items, nutrients, and nutNames up to UserApp
class SearchArea extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			query: null,
			nutNames: ["a", "2", "III", "4th", "last"],
			items: [],
			nutrients: []
		}
	}
	
	
	componentWillUpdate(nextProps, nextState) {
		console.log("updating component");
		console.log("pquery:", this.props.pathQuery);
	}
	componentWillReceiveProps(nextProps) {
		console.log("updating searchArea");
		console.log("pquery:", this.props.pathQuery);
		
		if (nextProps.query != this.props.query) {
			console.log("\n\n\n-CALLING SEARCH FROM NEWPROPS-\n\n\n");
			console.log("query changed:", nextProps.query);
			this.search(nextProps.query);
		}
	}
	
	render() {
		return(
			<div className="col-sm-10 p-0 search-col">
				<div className="search-area">
					<div className="search-head">
						
						<div className="input-group">
							
							<input className="form-control search-input" placeholder="Search" name="srch-term" id="srch-term" type="text"></input>
							<button className="btn btn-default" type="submit"><i className="fa fa-search"></i></button>
							
						</div>
						<div className="search-query">
							Results For "{this.props.query}"
						</div>
					</div>
					<SearchTable nutNames={this.props.searchNutNames} items={this.props.searchItems} nutrients={this.props.searchNutrients} checkedItems={this.props.checkedItems} checkItemHandler={this.props.checkItemHandler}/>
				</div>
			</div>
		)
	}
	
	componentDidMount() {
		console.log("\n\n\n\n\nMOUNTING");
		console.log("pquery:", this.props.pathQuery);
		console.log("q: ", this.props.query);
		if (this.props.query == this.props.pathQuery) {
			console.log("Queries match, update results");
			if (this.props.searchNutrients.length == 0) {
				console.log("\n\n\n-CALLING SEARCH FROM MOUNT-\n\n\n", this.props);
				this.search(this.props.query);
			}
		} else {
			console.log("Queries don't match, SET QUERY");
			this.props.setQuery(this.props.pathQuery);
		}
		
	}
	
	search(query) {
		var newResults = {};
		
		this.setState({
			items: [],
			nutrients: []
		})
		this.getSearchResults(query).then((data) => {
			/**
			this.setState({
				nutNames: data.nutNames,
				items: data.items.item,
			});
			**/
			newResults.nutNames = data.nutNames;
			newResults.items = data.items.item;
			this.getItemInfos(newResults);
			
		}).catch((err) => {
			console.log('error getting search results. err:', err);
		})
	}
	
	//returns promise that resolves to search results based on props.query(search results is an array of items containing the name and ndbno's but no nutrient info, have to specifically call USDA API for each item to get specific data)
	getSearchResults(query) {
		let that = this; //TODO: figure out why I did it this way(probably forgot a bind somewhere) and fix
		
		return fetch('/user/search/results/' + query, {
			method: 'GET',
			credentials: 'include'
		})
		.then((resp) => resp.json()); //this line returns a promise that contains the json info as data param - meaning this function returns promise containing data from fetch
	}
	
	
	//requests full nutrient data on each item in this.state.items from the backend. Update's state(causing full search results to render) when complete, returns nothing
	getItemInfos(newResults) {
		console.log("getItemInfos() - this:", this);
		console.log('newResults', newResults);
		var ndbArr = newResults.items.map((item) => { 
				return item.ndbno 
			});
		var reqData = JSON.stringify({
			ndbs: ndbArr,
			type: 'b'
		}); 
		
		fetch('../../user/item/list', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
      },
			body: reqData
		})
		.then((resp) => resp.json())
		.then((res) => {
			console.log("getItemInfos response:", res);
			//instead of setting state, set a callback reaching back up to UserApp to set search results, allowing results to be stored when navigating to different components
			
			/**
			this.setState({
				nutrients: res.nutrients,
				sample: "sample string"
			}); 
			**/
			newResults.nutrients = res.nutrients;
			console.log("THIS:", this);
			this.props.searchUpdateHandler(newResults);
		}).catch((err) => {
			console.log("catch error:", err);
		});
		console.log("after fetch");
	}
	//NEXT/TODO: AFTER receiving items from above ajax request, send another ajax request to get nutrient data on each item.ndbno, then after that fetch completes, render SearchTable again with data from the 2nd ajax request
	/**
			fetch('/food/search/results/' + this.props.query, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(this.state.items)
		})
		.then((resp) => resp.json())
		.then(function(data) {
			console.log("data = ", data);
			that.setState({
				nutNames: data.nutNames,
				items: data.items.item
			});
		});
		**/
	
	
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
			itemDatas: []
		}
	}
	
	render() {
		return (
			<table className="table">
				<thead className="thead-inverse">
					<tr>
						<th>Select</th>
						<th>Name</th>
						<th>Manufacturer</th>
							<th>
								{
									(this.props.nutrients.length > 0) 
									? 
										this.props.nutrients[0].nutrients[0].name
									:
										""
								}
							</th>
						
							<th>
								{
									(this.props.nutrients.length > 0) 
									? 
										this.props.nutrients[0].nutrients[1].name
									:
										""
								}
							</th>
						
							<th>
								{
									(this.props.nutrients.length > 0) 
									? 
										this.props.nutrients[0].nutrients[2].name
									:
										""
								}
							</th>
						
							<th>
								{
									(this.props.nutrients.length > 0) 
									? 
										this.props.nutrients[0].nutrients[3].name
									:
										""
								}
							</th>
						
							<th>
							{
									(this.props.nutrients.length > 0) 
								? 
									this.props.nutrients[0].nutrients[4].name
								:
									""
							}
							</th> 
					</tr>
				</thead>
				
				<tbody>
					{
							this.props.nutrients.map((item) => { 
								return this.createRow(item);
							})
					}
				</tbody>			
			</table>
		)
	}
	
	//renders a <tr> in table containing data(name, nutrient vals) from item
	createRow(item) {
		if (item.nutrients.length > 5) {
			item.nutrients = item.nutrients.slice(0, 5);
		}
		return (
			<tr key={item.ndb}>
				<td>
					<label className="fancy-checkbox">
						<input type="checkbox" className="search-result-chk" id={"item-chk-" + item.ndb}  name="item-chk-1" onChange={this.createCheckHandler(item)} num="1" checked={this.getCheckedVal(item.ndb)} ></input>
						<i aria-hidden="true" className="chk-icon fa fa-square-o unchecked"></i>
						<i aria-hidden="true" className="chk-icon fa fa-check-square-o checked"></i>
					</label>	
				</td>
				<td>
					<a href="#" className="food-item-link">
						{item.name}
					</a>
				</td>
				<td>{item.manu}</td>
				{
					item.nutrients.map((n) => {
						return <td key={(item.ndb + '-' + n.id)}>{n.value}{n.unit}</td>
					})
				}  
			
			</tr>
		)
	}
	
	/**
		for setting boolean attribute 'checked' on <input> element for items. for boolean attributes <e boolAttr=""> defaults to just <e> and <e boolAttr="boolAttr"> defaults to <e boolAttr>, which is a good thing. See https://github.com/facebook/react/issues/9230 if confused
	**/
	getCheckedVal(ndb) {
		for (var i = 0; i < this.props.checkedItems.length; i++) {
			if (this.props.checkedItems[i].ndb == ndb) {
				return "checked";
			}
		}
		return "";
	}
	
	/**
		Create an checkItem handler specific for each item that calls props.checkItemHandler and passes in an object with item.name and item.ndbno
	**/
	createCheckHandler(item) {
		//arrow func so I don't have to bind 
		return (e) => {
			console.log("callback. this:", this);
			this.props.checkItemHandler({
				ndb: item.ndb,
				name: item.name,
				checked: e.target.checked
			})
		}
	}
	
	
}

export {SearchArea, SearchTable}