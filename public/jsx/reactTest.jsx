
import React from 'react';
import ReactDOM from 'react-dom';
  
class App extends React.Component {
		render() {
				return (<div className="app-component w-100 h-100">Hello</div>);
		}
}
ReactDOM.render(
		<App />,
		document.getElementById('App')
);
