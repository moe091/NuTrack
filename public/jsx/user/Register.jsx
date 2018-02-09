import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
 

class Register extends React.Component {
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
			
			<div className="col-sm-10 p-0 main-col">
				<div className="container-fixed inset-container w-100 h-100"> 

						<div className="content-section w-50 m-1 p-4 header-bg">
							Register					
						</div>

						<div className="content-section w-75 p-4">
						<label className="block-label almost-white">{this.state.message}</label>
						<form onSubmit={this.loginSubmit.bind(this)}>
								<div className="content-block">
									<div>
										<label className="pr-2 almost-white left">Username</label>
										<input className="right" type="text" value={this.state.username} onChange={this.usernameInputHandler.bind(this)} />
									</div>

									<div>
										<label className="pr-2 almost-white left">Password</label>
										<input className="right" type="password" value={this.state.password} onChange={this.passwordInputHandler.bind(this)} />
									</div>
								</div>
								<div className='block-space-50'></div> 
								<div className='block-space-50'></div>


								<button className='btn header-bg'>
									Register
								</button>
						</form>
					
						</div>

				</div>
			</div>
			
		) 
	}
	
	loginSubmit(e) {
		console.log("LOGIN:", e);
		
		e.preventDefault();
		
		var data = {
			username: this.state.username,
			password: this.state.password
		}
		
		fetch('/users/register', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
		.then((response) => response.json())
		.then((res) => {
			if (res.success) {
				window.user = res.user;
				this.registrationSuccess(res.user);
			} else {
				this.registrationFail("Registration unsuccessful: " + res.message);
			}
		}).catch((err) => {
			console.log("Error posting registration:", err);
			this.registrationFail("Account creation failed, please try again");
		})
		
		
	}
	
	registrationSuccess(user) {
		this.setState({
			message: "Account created successfully! You may now login with username: " + user.username
		});
	}
	
	registrationFail(message) {
		this.setState({
			message: message
		});
	}
	
	usernameInputHandler(e) {
		this.setState({
			username: e.target.value
		});
	}
	
	passwordInputHandler(e) {
		this.setState({
			password: e.target.value
		});
	}
	
	
}


export default Register;