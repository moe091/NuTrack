import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
 

class UserHome extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: "",
			message: "Enter username and password to create a new account"
		}
	}
		
	render() {
		return (
			
			<div className="col-sm-9 p-0 main-col">
				<h1>USER HOME</h1>
			</div>
			
		) 
	}
	

	
	
}


export default UserHome;