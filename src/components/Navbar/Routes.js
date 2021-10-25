import React from 'react';
import { Switch, Route } from 'react-router-dom';
import DefaultPage from '../DefaultPage';
import Projects from '../Projects';
import Users from '../Users';
import Dashboard from '../Dashboard';

function Routes() {

    return (
        <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/users" component={Users} />
            <Route path="/projects" component={Projects} />
            <Route component={DefaultPage} />
        </Switch>
    );
}

export default Routes;
