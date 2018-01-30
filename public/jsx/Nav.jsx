
import React from 'react';
import ReactDOM from 'react-dom';

class Nav extends React.Component {
	
	render() {
		return (
			<div className="container-fixed no-gap">
				<div className="row row-leftFix">

					<div className="col-sm-2 p-3 nav-corner d-flex align-content-center justify-content-center">
						<span className="nav-title align-self-center justify-self-center">
							NuTrack
						</span>
					</div>
					
					<div className="col-sm-10 p-0">
						<nav className="navbar navbar-expand-lg sticky-top navbar-light gap-fix-bottom no-gap">
							<button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
								<span>
									<i className="fa fa-list nav-toggle-icon"></i>
								</span>
							</button>
							<a className="navbar-brand" href="#">NuTrack</a>

							<div className="collapse navbar-collapse" id="navbarTogglerDemo02">
								<ul className="navbar-nav mr-auto mt-2 mt-md-0">
									<li className="nav-item active">
										<a className="nav-link" href="/">Home <span className="sr-only">(current)</span></a>
									</li>

										<li className="nav-item">
											<a className="nav-link" href="/user/tracker">Tracker</a>
										</li>

									<li className="nav-item">
										<a className="nav-link" href="/user/home">
										not logged in
										</a>
									</li>

								</ul>

								<ul className="navbar-nav pull-right">

									<li className="nav-item">
										<a className="nav-link mx-2" href="/users/login">Login</a>
									</li>
									<li className="nav-item">	
										<a className="nav-link mx-2" href="#">Register</a>
									</li>

								</ul>

								<form className="form-inline my-2 my-lg-0" id="nav-search-form">

									<input className="form-control mx-sm-2" type="text" placeholder="Search"></input>
									<button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
								</form>
							</div>
						</nav>
					</div>
				</div>
			</div>
		)
	}
	
	
}




export default Nav