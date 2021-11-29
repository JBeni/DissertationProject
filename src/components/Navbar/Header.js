import React, { useEffect } from 'react';

function Header(props) {
    const { currentUsername } = props;

    useEffect(() => {
    }, []);

    return (
        <header className={ props.isActive ? "header body-pd" : "header" }>
            <div className="header__toggle">
                <i className={ props.isActive ? "bx bx-menu bx-x" : "bx bx-menu" } onClick={ props.changeMenuOption }></i>
            </div>

            <div className="flex-div">
                <div style={{ marginRight: '50px' }}>
                    Wallet Address: { props.account }
                </div>
            </div>

            <div>
                { currentUsername?.length > 1 && <p>{ currentUsername }</p> }
            </div>
        </header>
    );
}

export default Header
