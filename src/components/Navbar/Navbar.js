import React, { useState } from 'react';
import './Navbar.css';

import { useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Routes from './Routes';
import Table from '.././Table';
import CustomStepper from './../CustomStepper';
import User from '../../abis/User.json';
import Button from '@material-ui/core/Button';
import { AddUser } from '../Admin/AddUser';
import ModalComponent from './../Modal';
import DialogModal from './../DialogModal';

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
                <Routes />
                <Table account={account} project={project} web3={web3} />

                <br /><br />

                <DialogModal account={account} project={project} web3={web3} />

            </div>
        </div>
    );
}

export default Navbar;
