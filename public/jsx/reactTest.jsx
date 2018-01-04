
import React from 'react';
import ReactDOM from 'react-dom';
import {SearchArea, SearchTable} from './searchArea.jsx';
  
class TimeApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			date: new Date(),
			screen: "none"
		}
		
	}
	
	render() {
		if (this.state.screen == "time") {
			return(
				<div className="h-100 w-100">
					{this.createRow(((this.state.date.getHours() - 4) % 12) + ':' + this.state.date.getMinutes() + ':' + this.state.date.getSeconds())}
					<button className="btn" onClick={this.showSearch}>Render Search</button>
				</div>
			);
		} else {
			return(
				<SearchArea />
			);
		}
	}
	
	showSearch() {
		this.setState({
			screen: "search"
		});
	}
	createRow(id) {
		return(
				<Row value={id} />
		)
	}
	
	componentDidMount() {
		this.timerID = setInterval(
			() => this.tick(), 1000
		);
	}
	
	tick() {
		this.setState({
			date: new Date()
		});
	}
}  



class Row extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: null,
		}
	}
	
	render() {
		return (
			<span className='block w-25 h-25'>
				Time = {this.props.value}
			</span>
		)
	}
}




export {TimeApp, Row};



