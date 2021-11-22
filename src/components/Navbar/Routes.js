import React from 'react';
import { Switch, Route } from 'react-router-dom';
import DefaultPage from '../NotFound/DefaultPage';
import Projects from '../Projects/Projects';
import Users from '../Users/Users';
import Dashboard from '../Dashboard/Dashboard';
import Company from './../Company/Company';
import Supervisor from './../Supervisor/Supervisor';
import ProjectRequests from '../ProjectRequests/ProjectRequests';
import Requests from './../Requests/Requests';

function Routes(props) {
	return (
		<Switch>
            {
                props.userRole === 'DefaultRole' &&
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
            }
            {
                props.userRole === 'DefaultRole' &&
                    <Route
                        path="/dashboard" exact
                        render={() => (
                            <Dashboard
                                account={props.account}
                                project={props.project}
                                web3={props.web3}
                            />
                        )}
                    />
            }
            {
                props.userRole === 'DefaultRole' &&
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
            }
            {
                props.userRole === 'DefaultRole' &&
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
            }
            {
                props.userRole === 'DefaultRole' &&
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
            }
            {
                props.userRole === 'DefaultRole' &&
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
            }
            {
                props.userRole === 'DefaultRole' &&
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
            }
            {
                props.userRole === 'DefaultRole' &&
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
            }
            {
                props.userRole === 'DefaultRole' &&
                    <Route
                        path="/requests"
                        render={() => (
                            <Requests
                                account={props.account}
                                project={props.project}
                                web3={props.web3}
                            />
                        )}
                    />
            }
            {
                props.userRole === 'DefaultRole' &&
                    <Route
                        render={() => (
                            <DefaultPage
                                account={props.account}
                                project={props.project}
                                web3={props.web3}
                            />
                        )}
                    />
            }
		</Switch>
	);
}

export default Routes;
