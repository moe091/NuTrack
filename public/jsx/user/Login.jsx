import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
 

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: "",
			message: ""
		}
	}
		
	render() {
		return (
			
			<div className="col-sm-10 p-0 main-col">
				<div className="container-fixed inset-container w-100 h-100"> 

						<div className="content-section w-50 m-1 p-4 header-bg">
							Login					
						</div>

						<div className="content-section w-75 p-4">
						
						<form onSubmit={this.loginSubmit.bind(this)}>
								<div className="text-center warning-text">{this.state.message}</div>
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
									Log in
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
		
		fetch('/users/login', {
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
			window.user = res.user;
			if (res.success) {
				console.log("LOGIN SUCCESSFUL:", res);
				if (this.props.history.location.pathname.split("/")[3] == "registration") {
					this.props.loginSuccess(res.user, "/");
				} else {
					this.props.loginSuccess(res.user);
				}
			} else {
				console.log("login failed:", res);
				this.setState({
					message: res.message
				});
			}
		}).catch((err) => {
			console.log("Error posting login:", err);
		})
		
		
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


export default Login;