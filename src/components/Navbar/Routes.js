import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import DefaultPage from '../NotFound/DefaultPage';
import Projects from '../Projects/Projects';
import Users from '../Users/Users';
import Dashboard from '../Dashboard/Dashboard';
import Company from './../Company/Company';
import Supervisor from './../Supervisor/Supervisor';
import ProjectRequests from '../ProjectRequests/ProjectRequests';
import Requests from './../Requests/Requests';
import { getDefaultRole } from './../Services/applicationService';

function Routes(props) {
    const [defaultRole, setDefaultRole] = useState('');

    useEffect(() => {
        const role = getDefaultRole();
        setDefaultRole(role);
    }, []);

	return (
		<Switch>
            {
                props.userRole === defaultRole &&
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
                props.userRole === defaultRole &&
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
                props.userRole === defaultRole &&
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
                props.userRole === defaultRole &&
                <Route
                    path="/projects" exact
                    render={() => (
                        <Projects
                            account={props.account}
                            project={props.project}
                            signatureChain={props.signatureChain}
                            web3={props.web3}
                        />
                    )}
                />
            }
            {
                props.userRole === defaultRole &&
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
                props.userRole === defaultRole &&
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
                props.userRole === defaultRole &&
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
                props.userRole === defaultRole &&
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
                props.userRole === defaultRole &&
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
                props.userRole === defaultRole &&
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
