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

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			view: "home",
			query: null
		}
	}
	
	render() {
		
		return (
				<Router>
						<div>
							<Route exact path='/' component={HomePage} searchHandler={this.search.bind(this)}/>
							<Route path='/food/search' component={Search} searchHandler={this.search.bind(this)} />
							<a href="#" type="btn btn-primary">
								ejs user: {if (window.user) window.user.username else "hello"}
							</a>
						</div>
				</Router>
		);
		
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
}
	


ReactDOM.render((
    <App />
),
	document.getElementById('App')
);

//App will return a div wrapping the whole page, with nav/sidebar/main areas. This will 
//allow it to construct different layouts, e.g the homepage with no sidebar