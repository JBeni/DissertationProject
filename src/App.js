import React, { Component } from 'react';
import Navbar from './components/Navbar';
import CustomPaginationActionsTable from './components/TableViewRowModal/TabelExample';
import { StyledEngineProvider } from '@mui/material/styles';

class App extends Component {
	render() {
		return (
			<React.Fragment>
                <StyledEngineProvider injectFirst>
                    <CustomPaginationActionsTable />
                </StyledEngineProvider>
			</React.Fragment>
		);
	}
}

export default App;
