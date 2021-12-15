import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import DefaultPage from '../NotFound/DefaultPage';
import Projects from '../Projects/Projects';
import Users from '../Users/Users';
import Dashboard from '../Dashboard/Dashboard';
import CompanyProjects from '../Company/CompanyProjects';
import CompanyProjectRequests from '../Company/CompanyProjectRequests/CompanyProjectRequests';
import Supervisor from './../Supervisor/Supervisor';
import ProjectRequests from '../Projects/ProjectRequests/ProjectRequests';
import Requests from './../Requests/Requests';
import * as roleService from '../Services/roleService';
import CompaniesProjects from '../CompaniesProjects/CompaniesProjects';

function Routes(props) {
    const [adminRole, setAdminRole] = useState(null);
    const [userProjectRole, setUserProjectRole] = useState(null);
    const [companyRole, setCompanyRole] = useState(null);
    const [supervisorRole, setSupervisorRole] = useState(null);

    useEffect(() => {
        setRoles()
    }, []);

    const setRoles = async () => {
        setAdminRole(await roleService.getAdminRole(props));
        setUserProjectRole(await roleService.getUserProjectRole(props));
        setCompanyRole(await roleService.getCompanyRole(props));
        setSupervisorRole(await roleService.getSupervisorRole(props));
    }

	return (
		<Switch>
            {
                props.currentUserRole !== null &&
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
                props.currentUserRole !== null &&
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
                props.currentUserRole === adminRole &&
                    <Route
                        path="/users"
                        render={() => (
                            <Users
                                account={props.account}
                                userChain={props.userChain}
                                web3={props.web3}
                            />
                        )}
                    />
            }
            {
                props.currentUserRole === userProjectRole &&
                    <Route
                        path="/projects" exact
                        render={() => (
                            <Projects
                                currentUserRole={props.currentUserRole}
                                account={props.account}
                                project={props.project}
                                serviceChain={props.serviceChain}
                                signatureChain={props.signatureChain}
                                web3={props.web3}
                            />
                        )}
                    />
            }
            {
                props.currentUserRole === userProjectRole &&
                    <Route
                        path="/projects/:id"
                        render={() => (
                            <ProjectRequests
                                currentUserRole={props.currentUserRole}
                                account={props.account}
                                project={props.project}
                                serviceChain={props.serviceChain}
                                web3={props.web3}
                            />
                        )}
                    />
            }
            {
                props.currentUserRole === companyRole &&
                    <Route
                        path="/companies"
                        render={() => (
                            <CompaniesProjects
                                account={props.account}
                                project={props.project}
                                web3={props.web3}
                            />
                        )}
                    />
            }
            {
                props.currentUserRole === companyRole &&
                    <Route
                        path="/company" exact
                        render={() => (
                            <CompanyProjects
                                account={props.account}
                                project={props.project}
                                serviceChain={props.serviceChain}
                                web3={props.web3}
                            />
                        )}
                    />
            }
            {
                props.currentUserRole === companyRole &&
                    <Route
                        path="/company/:id"
                        render={() => (
                            <CompanyProjectRequests
                                account={props.account}
                                project={props.project}
                                serviceChain={props.serviceChain}
                                web3={props.web3}
                            />
                        )}
                    />
            }

            {
                props.currentUserRole === supervisorRole &&
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
                (
                    props.currentUserRole === companyRole ||
                    props.currentUserRole === supervisorRole
                ) &&
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
                props.currentUserRole !== null &&
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
