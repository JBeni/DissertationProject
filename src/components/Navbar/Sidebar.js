import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar(props) {
	return (
		<div className={props.isActive ? 'l-navbar show' : 'l-navbar'} id="nav-bar">
			<nav className="nav">
				<div>
					<p className="nav__logo">
						<i className="bx bx-layer nav__logo-icon"></i>
						<span className="nav__logo-name">ProjectChain</span>
					</p>

					<div className="nav__list">
                        {
                            props.userRole &&
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
                            props.userRole &&
                                <Link
                                    to="/users"
                                    className={
                                        props.currentLocation[1] === 'users'
                                            ? 'nav__link active'
                                            : 'nav__link'
                                    }
                                >
                                    <i className="bx bx-grid-alt nav__icon"></i>
                                    <span className="nav__name">Users</span>
                                </Link>
                        }
                        {
                            props.userRole &&
                                <Link
                                    to="/projects"
                                    className={
                                        props.currentLocation[1] === 'projects'
                                            ? 'nav__link active'
                                            : 'nav__link'
                                    }
                                >
                                    <i className="bx bx-user nav__icon"></i>
                                    <span className="nav__name">Projects</span>
                                </Link>
                        }
                        {
                            props.userRole &&
                                <Link
                                    to="/project-initiator"
                                    className={
                                        props.currentLocation[1] === 'project-initiator'
                                            ? 'nav__link active'
                                            : 'nav__link'
                                    }
                                >
                                    <i className="bx bx-user nav__icon"></i>
                                    <span className="nav__name">Project Initiator</span>
                                </Link>
                        }
                        {
                            props.userRole &&
                                <Link
                                    to="/company"
                                    className={
                                        props.currentLocation[1] === 'company'
                                            ? 'nav__link active'
                                            : 'nav__link'
                                    }
                                >
                                    <i className="bx bx-message-square-detail nav__icon"></i>
                                    <span className="nav__name">Company Builder</span>
                                </Link>
                        }
                        {
                            props.userRole &&
                                <Link
                                    to="/supervisor"
                                    className={
                                        props.currentLocation[1] === 'supervisor'
                                            ? 'nav__link active'
                                            : 'nav__link'
                                    }
                                >
                                    <i className="bx bx-bookmark nav__icon"></i>
                                    <span className="nav__name">Project Supervisor</span>
                                </Link>
                        }
					</div>
				</div>

				<p className="nav__link">
					<i className="bx bxs-copyright nav__icon"></i>
					<span className="nav__name">Copyright 2021</span>
				</p>
			</nav>
		</div>
	);
}

export default Sidebar;
