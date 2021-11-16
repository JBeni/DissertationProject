import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MaterialTable from '@material-table/core';

const tableIcons = {
};

const CompanyBuilder = () => {
	const [users, setUser] = useState([
        {
            name: 'asd',
            username: 'asdsad',
            email: 'asdasdasd',
        },
        {
            name: 'asd',
            username: 'asdsad',
            email: 'asdasdasd',
        },
        {
            name: 'asd',
            username: 'asdsad',
            email: 'asdasdasd',
        },
        {
            name: 'asd',
            username: 'asdsad',
            email: 'asdasdasd',
        },
    ]);

	useEffect(() => {
		loadUsers();
	}, []);

	const loadUsers = async () => {
		const result = await axios.get('http://localhost:3003/users');
		setUser(result.data.reverse());
	};

	const deleteUser = async (id) => {
		await axios.delete(`http://localhost:3003/users/${id}`);
		loadUsers();
	};

    const tableRef = React.createRef();
    const columns = [
        { title: 'Username', field: 'username' },
        //{ title: 'First Name', field: 'firstname' },
        //{ title: 'Last Name', field: 'lastname' },
        { title: 'Email', field: 'email' },
        { title: 'Role', field: 'role' },
        //{ title: 'Wallet Address', field: 'walletAddress' },
    ];

	return (
        <MaterialTable
        title="Users ProjectChain"
        tableRef={tableRef}
        icons={tableIcons}
        columns={columns}
        actions={[]}
    />
);
};

export default CompanyBuilder;
