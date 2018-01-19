import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
//can get rid of react imports in other imports, they'll all be combined into one file anyway
import reactTest from './reactTest.jsx';  
import {HomePage, SearchBox} from './HomePage.jsx'; 
import {SearchArea, SearchTable} from './SearchArea.jsx';
import Search from './Search.jsx';
import Nav from './Nav.jsx';
import SideBar from './SideBar.jsx';

import UserApp from './user/UserApp.jsx';
 

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			view: "home",
			query: null,
		}
	}
	
	
	newMealHandler(e) {
		console.log("new meal click"); 
		console.log(e.target);
		console.log("this = ", this);
		
		fetch('../../user/meals/new', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
      },
			body: JSON.stringify({items: this.state.checkedItems})
		})
		.then((resp) => resp.json())
		.then((res) => {
			console.log("getItemInfos response:", res);
		}).catch((err) => {
			console.log("catch error:", err);
		});
		this.props.history.push("../../user/meals/new");
	}
	
	search(query) {
		this.setState({
			view: "search",
			query: query
		});
		console.log("App.search called, query = " + this.state.query);
		console.log("THIS = ", this);
		this.props.history.push("/search");
	}
	
	
	render() {
		
		return (
				<Router>
						<div>
							<Route exact path='/' component={HomePage} searchHandler={this.search.bind(this)}/>
							<Route path="/user" component={UserApp} />
							<Route path='/food' component={UserApp} />
						</div>
				</Router>
		);
		
	}

	

}
	



ReactDOM.render((
    <App />
),
	document.getElementById('App')
);

//App will return a div wrapping the whole page, with nav/sidebar/main areas. This will 
//allow it to construct different layouts, e.g the homepage with no sidebar