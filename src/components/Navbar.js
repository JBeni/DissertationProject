import React, { useState, useEffect } from 'react';
import './Styles/Navbar.css';
import { useLocation } from 'react-router-dom';
import Header from './Navbar/Header';
import Sidebar from './Navbar/Sidebar';
import Routes from './Navbar/Routes';
import { getUserRoleById } from './formService';

function Navbar(props) {
    const [isActive, setIsActive] = useState(true);
    const changeMenuOption = () => setIsActive(prev => !prev);

    const location = useLocation();
    const { pathname } = location;
    const currentLocation = pathname.split("/");

    const [account] = useState(props.account);
    const [project] = useState(props.project);
    const [web3] = useState(props.web3);
    const [currentUserRole, setCurrentUserRole] = useState('DefaultRole');

	useEffect(() => {
        if (props.account === "0xf08b741073b3cb01ef6fb3b412e71c977f276faa") {
            //setCurrentUserRole('Admin');
            //return;
        }

        return;
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
            <Header account={props.account} isActive={isActive} changeMenuOption={changeMenuOption} />
            <Sidebar userRole={currentUserRole} isActive={isActive} currentLocation={currentLocation} />

            <div className="main-section-container">
                <Routes userRole={currentUserRole} account={account} project={project} web3={web3} />
            </div>
        </div>
    );
}

export default Navbar;
