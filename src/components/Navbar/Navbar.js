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

function Navbar(props) {
    const [isActive, setIsActive] = useState(true);
    const changeMenuOption = () => setIsActive(prev => !prev);

    const location = useLocation();
    const { pathname } = location;
    const currentLocation = pathname.split("/");



    const [address, setAddress] = useState("");
    const handleInputChange = (e) => {
        setAddress(e.target.value);
    }

    const [account] = useState(props.account);
    const [project] = useState(props.project);
    const [web3] = useState(props.web3);

    // console.log("Account Address : " + account);

    // async function getUsername() {
    //     let data = await project.methods.getUserInfo(account).call();
    //     console.log(data);
    // }





    return (
        <div className={ isActive ? "body-container body-pd" : "body-container" } id="body-pd">
            <Header account={props.account} isActive={isActive} changeMenuOption={changeMenuOption} />
            <Sidebar isActive={isActive} currentLocation={currentLocation} />

            <div className="main-section-container">
                <Routes />
                <Table />

                {/* <br /><br />
                <CustomStepper
                    getSteps={getSupplyChainSteps}
                    activeStep={activeStep}
                    getStepContent={getSupplyChainStepContent}
                /> */}


                {/* <Button variant="contained" color="primary" onClick={ getUsername } >
                    Submit
                </Button>  */}
            </div>
        </div>
    );
}

export default Navbar;
