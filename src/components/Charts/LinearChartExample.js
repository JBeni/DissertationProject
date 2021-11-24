import React from 'react';
import { Chart, Dataset } from 'react-rainbow-components';

const containerStyles = {
	maxWidth: 1200,
	maxHeight: 600,
	marginTop: 50,
	marginLeft: 50,
	marginRight: 50,
};

class LineChartExample extends React.Component {
	constructor(props) {
		super(props);
		this.titles = [
			'Data-Yellow',
			'Data-Green',
			'Data-Orange',
			'Data-Purple',
			'Data-Dark',
		];
		this.colors = ['#ffcc00', '#1ad1a3', '#ff6837', '#663398', '#061c3f'];
		this.months = [
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
		];
		this.state = {
			labels: ['January', 'February', 'March', 'April', 'May', 'June'],
			datasets: [
				{
					title: 'Data-Red',
					borderColor: '#fe4849',
					values: [37, 15, 90, 57, 80, 14],
				},
				{
					title: 'Data-Blue',
					borderColor: '#01b6f5',
					values: [18, 39, 15, 38, 15, 35],
				},
			],
		};
	}

	renderDatasets() {
		const { datasets } = this.state;
		return datasets.map(({ title, values, borderColor }) => (
			<Dataset
				key={title}
				title={title}
				values={values}
				borderColor={borderColor}
				backgroundColor={borderColor}
			/>
		));
	}

	render() {
		const { labels } = this.state;

		return (
            <div>
                <div style={containerStyles}>
                    <Chart labels={labels} type="line">
                        {this.renderDatasets()}
                    </Chart>
                </div>
            </div>
		);
	}
}

export default LineChartExample;
