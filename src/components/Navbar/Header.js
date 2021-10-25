import React from 'react';

function Header({ isActive, changeMenuOption }) {
    return (
        <header className={ isActive ? "header body-pd" : "header" } id="header">
        <div className="header__toggle">
            <i className={ isActive ? "bx bx-menu bx-x" : "bx bx-menu" } id="header-toggle" onClick={ changeMenuOption }></i>
        </div>

        <div className="header__img">
            <img src="assets/images/perfil.jpg" alt="Not" />
        </div>
    </header>
    );
}

export default Header
