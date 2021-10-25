import React, { useState } from 'react';
import './Navbar.css';

import { useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Routes from './Routes';

function Navbar() {

    const [isActive, setIsActive] = useState(true);
    const changeMenuOption = () => setIsActive(prev => !prev);

    const location = useLocation();
    const { pathname } = location;
    const currentLocation = pathname.split("/");

    return (
        <div className={ isActive ? "body-container body-pd" : "body-container" } id="body-pd">
            <Header isActive={isActive} changeMenuOption={changeMenuOption} />
            <Sidebar isActive={isActive} currentLocation={currentLocation} />

            <div className="main-section-container">
                <Routes />
            </div>
        </div>
    );
}

export default Navbar;
