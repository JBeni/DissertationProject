import React from 'react';
import { Switch, Route } from 'react-router-dom';
import DefaultPage from '../DefaultPage';
import Projects from '../Projects/Projects';
import Users from '../Users/Users';
import Dashboard from '../Dashboard';
import CompanyBuilder from './../CompanyBuilder/CompanyBuilder';
import Supervisor from './../Supervisor/Supervisor';

function Routes(props) {
	return (
		<Switch>
			<Route
				exact path="/"
				render={() => (
					<Dashboard
						account={props.account}
						project={props.project}
						web3={props.web3}
					/>
				)}
			/>
			<Route
				path="/users"
				render={() => (
					<Users
						account={props.account}
						project={props.project}
						web3={props.web3}
					/>
				)}
			/>
			<Route
				path="/projects"
				render={() => (
					<Projects
						account={props.account}
						project={props.project}
						web3={props.web3}
					/>
				)}
			/>
			<Route
				path="/company"
				render={() => (
					<CompanyBuilder
						account={props.account}
						project={props.project}
						web3={props.web3}
					/>
				)}
			/>
			<Route
				path="/supervisor"
				render={() => (
					<Supervisor
						account={props.account}
						project={props.project}
						web3={props.web3}
					/>
				)}
			/>

			<Route
				render={() => (
					<DefaultPage
						account={props.account}
						project={props.project}
						web3={props.web3}
					/>
				)}
			/>
		</Switch>
	);
}

export default Routes;
