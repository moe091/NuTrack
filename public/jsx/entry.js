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
 

class Appp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			view: "home",
			query: null
		}
		console.log("CONSTRUCT APP");
	}
	
	
	
	render() {
		
		return (
				<Router>
						<div>
							<Route exact path='/' component={HomePage} />
							<Route path="/user" component={UserApp} />
							<Route path="/users" component={UserApp} />
							<Route path='/food' component={UserApp} />
						</div>
				</Router>
		);
		
	}

	

}
	



ReactDOM.render((
    <Appp />
),
	document.getElementById('App')
);

//App will return a div wrapping the whole page, with nav/sidebar/main areas. This will 
//allow it to construct different layouts, e.g the homepage with no sidebar