import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as roleService from '../Services/roleService';

function Sidebar(props) {
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
		<div className={props.isActive ? 'l-navbar show' : 'l-navbar'} id="nav-bar">
			<nav className="nav">
				<div>
					<p className="nav__logo">
						<i className="bx bxs-bank nav__logo-icon"></i>
						<span className="nav__logo-name">ProjectChain</span>
					</p>

					<div className="nav__list">
                        {
                            //props.currentUserRole !== null &&
                                <Link
                                    to="/dashboard"
                                    className={
                                        props.currentLocation[1] === 'dashboard' || props.currentLocation[1] === ''
                                            ? 'nav__link active'
                                            : 'nav__link'
                                    }
                                >
                                    <i className="bx bxs-dashboard nav__icon"></i>
                                    <span className="nav__name">Dashboard</span>
                                </Link>
                        }
                        {
                            //props.currentUserRole === adminRole &&
                                <Link
                                    to="/users"
                                    className={
                                        props.currentLocation[1] === 'users'
                                            ? 'nav__link active'
                                            : 'nav__link'
                                    }
                                >
                                    <i className="bx bx-user-pin nav__icon"></i>
                                    <span className="nav__name">Users</span>
                                </Link>
                        }
                        {
                            // (
                            //     props.currentUserRole === userProjectRole ||
                            //     props.currentUserRole === companyRole ||
                            //     props.currentUserRole === supervisorRole
                            // ) &&
                                <Link
                                    to="/projects"
                                    className={
                                        props.currentLocation[1] === 'projects'
                                            ? 'nav__link active'
                                            : 'nav__link'
                                    }
                                >
                                    <i className="bx bxs-detail nav__icon"></i>
                                    <span className="nav__name">Projects</span>
                                </Link>
                        }
                        {
                            //props.currentUserRole === companyRole &&
                                <Link
                                    to="/company"
                                    className={
                                        props.currentLocation[1] === 'company'
                                            ? 'nav__link active'
                                            : 'nav__link'
                                    }
                                >
                                    <i className="bx bxs-buildings nav__icon"></i>
                                    <span className="nav__name">Company</span>
                                </Link>
                        }
                        {
                            //props.currentUserRole === supervisorRole &&
                                <Link
                                    to="/supervisor"
                                    className={
                                        props.currentLocation[1] === 'supervisor'
                                            ? 'nav__link active'
                                            : 'nav__link'
                                    }
                                >
                                    <i className="bx bx-analyse nav__icon"></i>
                                    <span className="nav__name">Project Supervisor</span>
                                </Link>
                        }
                        {
                            // (
                            //     props.currentUserRole === companyRole ||
                            //     props.currentUserRole === supervisorRole
                            // ) &&
                                <Link
                                    to="/requests"
                                    className={
                                        props.currentLocation[1] === 'requests'
                                            ? 'nav__link active'
                                            : 'nav__link'
                                    }
                                >
                                    <i className="bx bx-git-pull-request nav__icon"></i>
                                    <span className="nav__name">All Requests</span>
                                </Link>
                        }
					</div>
				</div>

                <div>
                    <p className="nav__link">
                        <i className="bx bx-copyright nav__icon"></i>
                        <span className="nav__name">Copyright {(new Date().getFullYear())}</span>
                    </p>
                </div>
			</nav>
		</div>
	);
}

export default Sidebar;
