import React, { Component } from 'react';
import './App.css';
import Navbar from './components/Navbar';

class App extends Component {
	render() {
		return (
			<React.Fragment>
                <Navbar />
			</React.Fragment>
		);
	}
}

export default App;
