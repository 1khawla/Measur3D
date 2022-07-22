import React from "react";

import { EventEmitter } from "./events";

import { Chart as ChartJS, Title } from "chart.js/auto";
import { Line } from "react-chartjs-2";

import axios from "axios";

class Chart extends React.Component {
  constructor() {
    super(...arguments);
    this.primaryxAxis = { valueType: "DateTime", labelFormat: "yMd" };
    this.tooltip = { enable: true };
  

    EventEmitter.subscribe("resetChart", (event) => this.resetChart(event));
    EventEmitter.subscribe("updateChart", (event) => this.updateChart(event));
  }

  resetChart = (event) => {
    this.setState({
      labels: null,
      label: null,
      data: null,
    });
  };

  updateChart = async (info) => {
    if (info.searchData) {
      var labels = [],
        data = [];

      for (const el in info.searchData) {
        labels.push(Date(info.searchData[el].time.instant));
        data.push(info.searchData[el].value.value);
      }

      this.setState((prevState) => ({
        ...prevState,
        labels: labels,
        label: info.label,
      }));

      return;
    }

    await axios.get(info.url).then((dataset) => {
      var labels = [],
        data = [];

      for (const el in dataset.data) {
        labels.push(Date(dataset.data[el].time.instant));
        data.push(dataset.data[el].value.value);
      }

      this.setState({
        labels: labels,
        label: info.label,
        data: data,
      });
    });
  };

  state = {
    labels: null,
    label: null,
    data: null,
  };

  render() {
    return (
      <Line
        datasetIdKey="id"
        data={{
          labels: this.state.labels,
          datasets: [
            {
              id: 1,
              label: " Dynamic_Data",
              data: this.state.data,
              backgroundColor:  "#ff6111",
              borderColor: "#jjj555",
              borderWidth: 1,
              pointRadius: 3,
              pointBackgroundColor: "#ff6111",
            
            },
          ],
        }}
      />
    );
  }
}

export default Chart;