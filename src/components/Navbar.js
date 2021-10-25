import React, { useState } from 'react';
import './Navbar.css';

import { Switch, Route, Link, useLocation } from 'react-router-dom';
import DefaultPage from './DefaultPage';
import Projects from './Projects';
import Users from './Users';
import Dashboard from './Dashboard';

function Navbar() {

    const [isActive, setIsActive] = useState(true);
    const changeMenuOption = () => setIsActive(prev => !prev);

    const location = useLocation();
    const { pathname } = location;
    const currentLocation = pathname.split("/");

    return (
        <div className={ isActive ? "body-container body-pd" : "body-container" } id="body-pd">
            <header className={ isActive ? "header body-pd" : "header" } id="header">
                <div className="header__toggle">
                    <i className={ isActive ? "bx bx-menu bx-x" : "bx bx-menu" } id="header-toggle" onClick={ changeMenuOption }></i>
                </div>

                <div className="nav-middle flex-div">
                    <div className="search-box flex-div">
                        <input type="text" placeholder="Search"/>
                        <i className="bx bx-search" id="header-search-box"></i>
                    </div>
                </div>

                <div className="header__img">
                    <img src="assets/images/perfil.jpg" alt="Not" />
                </div>
            </header>

            <div className={ isActive ? "l-navbar show" : "l-navbar" } id="nav-bar">
                <nav className="nav">
                    <div>
                        <p className="nav__logo">
                            <i className="bx bx-layer nav__logo-icon"></i>
                            <span className="nav__logo-name">ProjectChain</span>
                        </p>

                        <div className="nav__list">
                            <Link to="/dashboard" className={ (currentLocation[1] === "dashboard" || currentLocation[1] === ""  ) ? "nav__link active" : "nav__link" }>
                                <i className="bx bxs-dashboard nav__icon"></i>
                                <span className="nav__name">Dashboard</span>
                            </Link>

                            <Link to="/admin" className={ currentLocation[1] === "admin" ? "nav__link active" : "nav__link" }>
                                <i className="bx bx-grid-alt nav__icon"></i>
                                <span className="nav__name">Admin</span>
                            </Link>

                            <Link to="/project-initiator" className={ currentLocation[1] === "project-initiator" ? "nav__link active" : "nav__link" }>
                                <i className="bx bx-user nav__icon"></i>
                                <span className="nav__name">Project Initiator</span>
                            </Link>

                            <Link to="/company-builder" className={ currentLocation[1] === "company-builder" ? "nav__link active" : "nav__link" }>
                                <i className="bx bx-message-square-detail nav__icon"></i>
                                <span className="nav__name">Company Builder</span>
                            </Link>

                            <Link to="/project-supervisor" className={ currentLocation[1] === "project-supervisor" ? "nav__link active" : "nav__link" }>
                                <i className="bx bx-bookmark nav__icon"></i>
                                <span className="nav__name">Project Supervisor</span>
                            </Link>

                            <br/><br/>

                            <Link to="/projects" className={ currentLocation[1] === "projects" ? "nav__link active" : "nav__link" }>
                                <i className="bx bx-user nav__icon"></i>
                                <span className="nav__name">Projects</span>
                            </Link>
                            <Link to="/user-profile" className={ currentLocation[1] === "user-profile" ? "nav__link active" : "nav__link" }>
                                <i className="bx bx-user nav__icon"></i>
                                <span className="nav__name">User Profile</span>
                            </Link>
                        </div>
                    </div>

                    <p className="nav__link">
                        <i className="bx bxs-copyright nav__icon"></i>
                        <span className="nav__name">Copyright 2021</span>
                    </p>
                </nav>
            </div>

            <div className="main-section-container">
            {/* <Switch>
                <Route exact path="/" component={Dashboard} />
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/users" component={Users} />
                <Route path="/projects" component={Projects} />
                <Route component={DefaultPage} />
            </Switch> */}
            </div>
        </div>
    );
}

export default Navbar;
