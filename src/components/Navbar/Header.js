import React, { useState, useEffect } from 'react';
import { getUserInfo } from '../Services/applicationService';

function Header(props) {
    const [userData, setUserData] = useState();

    useEffect(() => {
        (async() => {
            let data = await getUserInfo(props);
            setUserData(data);
        })();
    }, [props]);

    return (
        <header className={ props.isActive ? "header body-pd" : "header" }>
            <div className="header__toggle">
                <i className={ props.isActive ? "bx bx-menu bx-x" : "bx bx-menu" } onClick={ props.changeMenuOption }></i>
            </div>

            <div className="flex-div">
                <div style={{ marginRight: '50px' }}>
                    Wallet Address: {props.account}
                </div>
            </div>

            <div>
                { userData?.username?.length > 1 && <p>{userData.username}</p> }
            </div>
        </header>
    );
}

export default Header
