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

    const [account] = useState(props.account);
    const [project] = useState(props.project);
    const [signatureChain] = useState(props.signatureChain);
    const [web3] = useState(props.web3);
    const { currentUserRole } = props;

	useEffect(() => {
	}, []);

    return (
        <div className={ isActive ? "body-container body-pd" : "body-container" } id="body-pd">
            <Header
                currentUsername={props.currentUsername}
                currentUserRole={currentUserRole}
                account={account}
                isActive={isActive}
                changeMenuOption={changeMenuOption}
            />
            <Sidebar
                currentUserRole={currentUserRole}
                isActive={isActive}
                currentLocation={currentLocation}
                setLoggedIn={props.setLoggedIn}
                loggedIn={props.loggedIn}
            />

            <div className="main-section-container">
                <Routes
                    currentUserRole={currentUserRole}
                    account={account}
                    project={project}
                    signatureChain={signatureChain}
                    web3={web3}
                />
            </div>
        </div>
    );
}

export default Navbar;
