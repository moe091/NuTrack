
import React from 'react';
import ReactDOM from 'react-dom';
  
class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			date: new Date()
		}
		
	}
	
	render() {
		return(
			<div className="h-100 w-100">
				{this.createRow(((this.state.date.getHours() - 4) % 12) + ':' + this.state.date.getMinutes() + ':' + this.state.date.getSeconds())}
			</div>
		)
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

ReactDOM.render(
	<App message="THIS IS HALLOWEEN. <br> Does br work here? <br><br><br><br>HMMMM.<h1>HEADER</h1>"/>,
		document.getElementById('app-section')
);
