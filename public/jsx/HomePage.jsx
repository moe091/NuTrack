//homepage only has to render the page and nav component. 
//other components will have to render a sidebar/nav component as well as themselves
import React from 'react';
import ReactDOM from 'react-dom';
import Nav from "./Nav.jsx";

class HomePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			//figure out what this needs later. User?
		}
	}
	
	searchHandler(query) {
		console.log("Handle Search in homepage. THIS=", this);
		console.log("Query = " + query);
		this.props.history.push("/food/search/" + query);
	}
	
	render() {
		return (
		
			<section className="bottom-slant masthead" id="App">	
			<Nav />
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
									<SearchBox  searchHandler={this.searchHandler.bind(this)}/>	
								</span>

							</div> 
						</div>

					</div>
				</div>
		
			</section>
		)
	}

	
}

class SearchBox extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			queryString: ""
		}
	}
	
	search() {
		console.log("HomePage - SearchBox.search(). This:", this);
		this.props.searchHandler(this.state.queryString);
		//this.props.searchHandler(this.state.queryString);
	}
	
	updateQueryString(evt) {
		this.setState({
			queryString: evt.target.value
		});
	}
	
	render() {
			return (
					<span className="input-group-btn">
						<input type="text" name="query" className="form-control" placeholder="Hot Pocket" id="foodsearch" onChange={evt => this.updateQueryString(evt)}></input>
						<button className="btn btn-default" type="button" value="search" id="searchBtn" onClick={this.search.bind(this)}>Go!</button>
					</span>
			)
	}
}


export {HomePage, SearchBox};



/**
Need onClick callback for search button.
Callback needs to take search string from foodsearch input and make an ajax call to server
callback then needs to somehow tell App to render the search component and give it the ajax response

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




















