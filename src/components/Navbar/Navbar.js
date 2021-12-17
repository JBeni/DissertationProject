import React, { useState, useEffect } from 'react';
import '../Styles/Navbar.css';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Routes from './Routes';

function Navbar(props) {
    const [isActive, setIsActive] = useState(true);
    const changeMenuOption = () => setIsActive(prev => !prev);

    const location = useLocation();
    const { pathname } = location;
    const currentLocation = pathname.split("/");

	useEffect(() => {
	}, []);

    return (
        <div className={ isActive ? "body-container body-pd" : "body-container" } id="body-pd">
            <Header
                currentUsername={props.currentUsername}
                currentUserRole={props.currentUserRole}
                account={props.account}
                isActive={isActive}
                changeMenuOption={changeMenuOption}
            />
            <Sidebar
                currentUserRole={props.currentUserRole}
                isActive={isActive}
                currentLocation={currentLocation}
                serviceChain={props.serviceChain}
            />

            <div className="main-section-container">
                <Routes
                    currentUserRole={props.currentUserRole}
                    account={props.account}
                    project={props.project}
                    serviceChain={props.serviceChain}
                    web3={props.web3}
                />
            </div>
        </div>
    );
}

export default Navbar;
