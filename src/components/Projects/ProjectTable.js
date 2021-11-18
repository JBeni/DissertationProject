import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

export default class ProjectTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
            show: false,
			students: [
				{ id: 1, name: 'Wasif', age: 21, email: 'wasif@email.com' },
				{ id: 2, name: 'Ali', age: 19, email: 'ali@email.com' },
				{ id: 3, name: 'Saad', age: 16, email: 'saad@email.com' },
				{ id: 4, name: 'Asad', age: 25, email: 'asad@email.com' },
			],
		};
	}

	renderTableData() {
		return this.state.students.map((student, index) => {
			const { id, name, age, email, isHidden } = student;
			if (isHidden === true) {
				return null;
			}

			return (
				<tr key={id}>
					<td>{id}</td>
					<td>{name}</td>
					<td>{age}</td>
					<td>{email}</td>
				</tr>
			);
		});
	}

	renderTableHeader() {
		let header = Object.keys(this.state.students[0]);
		return header.map((key, index) => {
			if (key === 'isHidden') {
				return null;
			}
			return <th key={index}>{key.toUpperCase()}</th>;
		});
	}

    setShowTable = (value) => {
        this.setState({ show: value });
    }

	render() {
		return (
            <>
                <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => {
                    this.setShowTable(true);
                }}>Show Table</Button>
                <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => {
                    this.setShowTable(false);
                }}>Hide Table</Button>
                <br /><br />

                {
                    this.state.show === true ?
                        <div>
                            <h1 id="title">React Dynamic Table</h1>
                            <table id="students">
                                <tbody>
                                    <tr>{this.renderTableHeader()}</tr>
                                    {this.renderTableData()}
                                </tbody>
                            </table>
                        </div>
                    : <div></div>
                }
            </>
		);
	}
}
