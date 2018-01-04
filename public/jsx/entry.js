import React from 'react';
import ReactDOM from 'react-dom';
//can get rid of react imports in other imports, they'll all be combined into one file anyway
import reactTest from './reactTest.jsx';  
import {HomePage, SearchArea} from './HomePage.jsx';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			page: "home"
		}
	}
	
	render() {
		return <HomePage />
	}
	
}
	
	

ReactDOM.render(
	<App page="home"/>,
		document.getElementById('App')
);