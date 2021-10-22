import React, { Component } from 'react';
import './Navbar.css';

import { Switch, Route, NavLink,useLocation, Redirect } from 'react-router-dom';
import DefaultPage from './DefaultPage';
import Projects from './Projects';
import Users from './Users';
import Dashboard from './Dashboard';

function Init() {
    //assigning location variable
    const location = useLocation();
    const { pathname } = location;
    return pathname.split("/");
}

class Navbar extends Component {
    something;

    constructor(props) {
        super(props);
        this.state = { isActive: true };
    }

    changeMenuOption = () => {
        this.setState({ isActive: !this.state.isActive });
    }

    checkCurrentUrl = () => {
        this.something = Init();
    }

    render() {
        return (
            <div className={ this.state.isActive ? "body-container body-pd" : "body-container" } id="body-pd">
                <header className={ this.state.isActive ? "header body-pd" : "header" } id="header">
                    <div className="header__toggle">
                        <i className={ this.state.isActive ? "bx bx-menu bx-x" : "bx bx-menu" } id="header-toggle" onClick={ this.changeMenuOption }></i>
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

                <div className={ this.state.isActive ? "l-navbar show" : "l-navbar" } id="nav-bar">
                    <nav className="nav">
                        <div>
                            <p className="nav__logo">
                                <i className="bx bx-layer nav__logo-icon"></i>
                                <span className="nav__logo-name">ProjectChain</span>
                            </p>

                            <div className="nav__list">
                                <NavLink to="/dashboard" className={ this.something === "dashboard" ? "nav__link active" : "nav__link" }>
                                    <i className="bx bxs-dashboard nav__icon"></i>
                                    <span className="nav__name">Dashboard</span>
                                </NavLink>

                                <NavLink to="/admin" className={ this.something === "admin" ? "nav__link active" : "nav__link" }>
                                    <i className="bx bx-grid-alt nav__icon"></i>
                                    <span className="nav__name">Admin</span>
                                </NavLink>

                                <NavLink to="/project-initiator" className={ this.something === "project-initiator" ? "nav__link active" : "nav__link" }>
                                    <i className="bx bx-user nav__icon"></i>
                                    <span className="nav__name">Project Initiator</span>
                                </NavLink>

                                <NavLink to="/company-builder" className={ this.something === "company-builder" ? "nav__link active" : "nav__link" }>
                                    <i className="bx bx-message-square-detail nav__icon"></i>
                                    <span className="nav__name">Company Builder</span>
                                </NavLink>

                                <NavLink to="/project-supervisor" className={ this.something === "project-supervisor" ? "nav__link active" : "nav__link" }>
                                    <i className="bx bx-bookmark nav__icon"></i>
                                    <span className="nav__name">Project Supervisor</span>
                                </NavLink>

                                <br/><br/>

                                <NavLink to="/projects" className={ this.something === "projects" ? "nav__link active" : "nav__link" }>
                                    <i className="bx bx-user nav__icon"></i>
                                    <span className="nav__name">Projects</span>
                                </NavLink>
                                <NavLink to="/user-profile" className={ this.something === "user-profile" ? "nav__link active" : "nav__link" }>
                                    <i className="bx bx-user nav__icon"></i>
                                    <span className="nav__name">User Profile</span>
                                </NavLink>
                            </div>
                        </div>

                        <p className="nav__link">
                            <i className="bx bxs-copyright nav__icon"></i>
                            <span className="nav__name">Copyright 2021</span>
                        </p>
                    </nav>
                </div>

                <div className="main-section-container">
                <Switch>
					<Route exact path="/" component={Dashboard} />
                    <Redirect path="/" to="/dashboard" />
                    <Route path="/dashboard" component={Dashboard} />
					<Route path="/users" component={Users} />
					<Route path="/projects" component={Projects} />
					<Route component={DefaultPage} />
				</Switch>
                </div>
            </div>
        );    
    }
}

export default Navbar;
