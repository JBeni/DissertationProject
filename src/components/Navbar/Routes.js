import React from 'react';
import { Switch, Route } from 'react-router-dom';
import DefaultPage from '../DefaultPage';
import Projects from '../Projects/Projects';
import Users from '../Users/Users';
import Dashboard from '../Dashboard';
import Company from './../Company/Company';
import Supervisor from './../Supervisor/Supervisor';
import ProjectRequests from '../ProjectRequests/ProjectRequests';

function Routes(props) {
	return (
		<Switch>
			<Route
				path="/" exact
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
				path="/projects" exact
				render={() => (
					<Projects
						account={props.account}
						project={props.project}
						web3={props.web3}
					/>
				)}
			/>
			<Route
				path="/projects/:id"
				render={() => (
					<ProjectRequests
						account={props.account}
						project={props.project}
						web3={props.web3}
					/>
				)}
			/>

			<Route
				path="/project-initiator"
				render={() => (
					<DefaultPage
						account={props.account}
						project={props.project}
						web3={props.web3}
					/>
				)}
			/>
			<Route
				path="/company"
				render={() => (
					<Company
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
