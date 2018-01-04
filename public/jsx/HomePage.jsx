//homepage only has to render the page and nav component. 
//other components will have to render a sidebar/nav component as well as themselves
import React from 'react';
import ReactDOM from 'react-dom';
class HomePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			//figure out what this needs later. User?
		}
	}
	
	render() {
		return (
		<div className="d-flex align-items-center justify-content-center my-5">
			<div className="center-block d-flex justify-content-center flex-column align-self-center pb-3" id="home-searchdiv">
				<div className="container">
					<div className="row">

						<div className="col-sm-8 mt-3 ml-3">
							<div className="title" id="greeting">NuTrack</div>
							<div className="tagline mb-3">Organize Your Nutrition</div>
						</div>

						<div className="col-sm-2 py-2 hide-img">
							<img className="img-fluid" src="/images/carrot.png" width='70%'>
							</img>
						</div>


					</div>
					<div className="row">

						<span className="searchbox mt-3">
							<SearchBox />	
						</span>

					</div> 
				</div>

			</div>
		</div>
		)
	}

	
}

class SearchBox extends React.Component {
	render() {
			return (
				<form action="/food/search/" method="get">
					<span className="input-group-btn">
						<input type="text" name="query" className="form-control" placeholder="Hot Pocket" id="foodsearch"></input>
						<button className="btn btn-default" type="submit" value="search" id="searchBtn">Go!</button>
					</span>
				</form>
			)
	}
}


export {HomePage, SearchBox};



/**

	render() {
		//render section as main element
		//render nav
		//render this all under nav:
		return
		(
		<div className="d-flex align-items-center justify-content-center my-5">
			<div className="center-block d-flex justify-content-center flex-column align-self-center pb-3" id="home-searchdiv">
				<div className="container">
					<div className="row">

						<div className="col-sm-8 mt-3 ml-3">
							<div className="title" id="greeting">NuTrack</div>
							<div className="tagline mb-3">Organize Your Nutrition</div>
						</div>

						<div className="col-sm-2 py-2 hide-img">
							<img className="img-fluid" src="/images/carrot.png" width='70%'>
							</img>
						</div>


					</div>
					<div className="row">

						<span className="searchbox mt-3">
							<SearchBox />	
						</span>

					</div> 
				</div>

			</div>
		</div>
		)
	}
	
	**/




















