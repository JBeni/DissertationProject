import React from 'react';

function Header(props) {
    return (
        <header className={ props.isActive ? "header body-pd" : "header" }>
            <div className="header__toggle">
                <i className={ props.isActive ? "bx bx-menu bx-x" : "bx bx-menu" } onClick={ props.changeMenuOption }></i>
            </div>

            <div className="flex-div">
                <div className="flex-div">
                    Current Account Address: {props.account}
                </div>
            </div>

            <div className="header__p">
                <p>{props.account}</p>

                {/* <img src="assets/images/perfil.jpg" alt="Not" /> */}
            </div>
        </header>
    );
}

export default Header
