import React, { useState } from 'react';
import './Styles/Navbar.css';

import { useLocation } from 'react-router-dom';
import Header from './Navbar/Header';
import Sidebar from './Navbar/Sidebar';
import Routes from './Navbar/Routes';

function Navbar(props) {
    const [isActive, setIsActive] = useState(true);
    const changeMenuOption = () => setIsActive(prev => !prev);

    const location = useLocation();
    const { pathname } = location;
    const currentLocation = pathname.split("/");

    const [account] = useState(props.account);
    const [project] = useState(props.project);
    const [web3] = useState(props.web3);

    return (
        <div className={ isActive ? "body-container body-pd" : "body-container" } id="body-pd">
            <Header account={props.account} isActive={isActive} changeMenuOption={changeMenuOption} />
            <Sidebar isActive={isActive} currentLocation={currentLocation} />

            <div className="main-section-container">
                <Routes account={account} project={project} web3={web3} />
            </div>
        </div>
    );
}

export default Navbar;
