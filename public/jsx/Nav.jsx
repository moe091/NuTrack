
import React from 'react';
import ReactDOM from 'react-dom';

/**
	TODO:
		create login/logout/register routes and components in React. Update Nav.props.user prop whenever something changes
**/
class Nav extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			searchQuery: ''
		}
	}
	/**
		TODO: add this back in at top of first UL in renderUserNav after UserHome component is created:
				<li className="nav-item active">
					<a className="nav-link pointer-cursor" onClick={this.navToUserHome.bind(this)}>
						<span className='bold-text'>{this.props.user.username}'s Home</span></a>
				</li>
	**/
	renderUserNav() {
		return (
			<ul className="navbar-nav mr-auto mt-2 mt-md-0">
				<li className="nav-item">
					<a className="nav-link pointer-cursor" onClick={this.navToTracker.bind(this)}>Tracker</a>
				</li>


				<li className="nav-item">
					<a className="nav-link pointer-cursor" onClick={this.navToPlanner.bind(this)}>Planner</a>
				</li>
				

				<li className="nav-item">
					<a className="nav-link pointer-cursor" onClick={this.navToMeals.bind(this)}>Meals</a>
				</li>
			</ul>
		);
	}
	
	renderProfileNav() {
		return (
			<ul className="navbar-nav pull-right">
				<li className="nav-item">
					<a className="nav-link mx-2 bold-text pointer-cursor" onClick={this.navToProfile.bind(this)}>		
						{this.props.user.username}
					</a>
				</li>
				<li className="nav-item">	
					<a className="nav-link mx-2" href="/users/logout">Logout</a>
				</li>
			</ul>
		)
	}
	
	render() {
		return (
			<div className="nav-wrapper"> 

					<div className="hide-tablet nav-corner">
						<a className="pointer-cursor" onClick={this.navToHome.bind(this)}>
							<span className="nav-title align-self-center justify-self-center">
								NuTrack
							</span>
						</a>
					</div>
					
					<div className="nav-area">
						<nav className="navbar navbar-expand-lg sticky-top navbar-light gap-fix-bottom no-gap">
							<button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
								<span>
									<i className="fa fa-list nav-toggle-icon" id="nav-toggle-icon"></i>
								</span>
							</button>

							<div className="collapse navbar-collapse" id="navbarTogglerDemo02">
								
									
								{
									(this.props.user == null) 
									? 
										<ul className="navbar-nav mr-auto mt-2 mt-md-0" id="left-nav">
											<li className="nav-item active faded-white">not logged in</li> 
										</ul>
									:
										this.renderUserNav()
								}
									

								{
									(this.props.user == null) 
									? 
										<ul className="navbar-nav pull-right" id="right-nav">
											<li className="nav-item">
												<a className="nav-link mx-2 pointer-cursor" onClick={this.navToLogin.bind(this)} >Login</a>
											</li>
											<li className="nav-item">	
												<a className="nav-link mx-2" href="/users/register">Register</a>
											</li>
										</ul>
									:
										this.renderProfileNav()
								}
								
								

								<form className="form-inline my-2 my-lg-0" id="nav-search-form">

									<SearchBox value={this.state.searchQuery} onChangeHandler={this.searchInput.bind(this)} />
									<button type="button" className="btn btn-outline-success my-2 my-sm-0" onClick={this.searchBtnClick.bind(this)}>Search</button>
								</form>
							</div>
						</nav>
					</div> 
			</div>
		)
	}
	
	searchInput(e) {
		this.setState({
			searchQuery: e.target.value
		});
	}
	
	searchBtnClick(e) {
		this.props.setQueryHandler(this.state.searchQuery);
	}
	
	
	navToHome() {
		this.props.history.push("/");
	}
	navToUserHome() {
		this.props.history.push("/user");
	}
	navToProfile() {
		this.props.history.push("/users/profile");
	}
	navToTracker() {
		this.props.history.push('/user/tracker/show');
	}
	navToPlanner() {
		this.props.history.push("/user/planner/show");
	}
	navToMeals() {
		this.props.history.push("/user/meals/show");
	}
	
	navToLogin() {
		console.log("navToLogin");
		this.props.loginRedirect();
	}
	
	searchHandler() {
		
	}
	
	
	
}

function SearchBox(props) {
	
	return (
		<input className="form-control mx-sm-2" type="text" placeholder="Search" value={props.value} onChange={props.onChangeHandler} ></input>
	)
}



export default Nav