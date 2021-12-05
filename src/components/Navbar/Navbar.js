import React, { useState, useEffect } from 'react';
import '../Styles/Navbar.css';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Routes from './Routes';
import { getUserRoleById } from '../Services/dropdownService';
import { getDefaultRole } from './../Services/applicationService';

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
    const [currentUserRole, setCurrentUserRole] = useState(getDefaultRole());

	useEffect(() => {
        // This is Admin - Owner Contract
        if (props.account === "0xf08b741073b3cb01ef6fb3b412e71c977f276faa") {
            //setCurrentUserRole('Admin');
            setCurrentUserRole('DefaultRole');
            //return;
        }

        (async () => {
            let data = await props.project.methods.getUserInfo(props.account).call().then((result) => {
                return result;
            });
            let role = getUserRoleById(data._role);
            setCurrentUserRole(role.value);
        })();
	}, []);

    return (
        <div className={ isActive ? "body-container body-pd" : "body-container" } id="body-pd">
            <Header
                currentUsername={props.currentUsername}
                account={account}
                isActive={isActive}
                changeMenuOption={changeMenuOption}
            />
            <Sidebar
                userRole={currentUserRole}
                isActive={isActive}
                currentLocation={currentLocation}
            />

            <div className="main-section-container">
                <Routes
                    userRole={currentUserRole}
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
