import React from 'react';
const rd3 = require('react-d3');
const LineChart = rd3.LineChart;
/*
 MORE examples found in:
 http://esbullington.github.io/react-d3-website/
 */
let lineData = [
  {
    name: 'series1',
    values: [{x: 0, y: 20}, {x: 24, y: 10}]
  },
  {
    name: 'series2',
    values: [{x: 70, y: 82}, {x: 76, y: 82}]
  }
];

module.exports = class D3Chart extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <LineChart
        legend={true}
        data={lineData}
        width={500}
        height={300}
        title="Line Chart Demo"
      />)
  }
}
