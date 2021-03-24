import React from "react";
import "../Modal/ReportModal.scss";
let axios = require("axios");

export default class Topintentstable extends React.Component {
  state = {
    date: [],
    final: [],
  };

  componentDidMount() {
    var bot = this.props.bot;
    var url = "http://localhost:4000/topintents?instance=" + bot;

    axios.get(url).then((result) => {
      // Top 3 Intents datewise
      console.log(result.data);
      var responseobj = result.data;
      var date = [];
      var final = [];

      // Date Array
      Object.keys(responseobj).forEach(function (data) {
        date.push(data);
      });

      date.forEach(function (day) {
        var temp = responseobj[day];
        var info = [];
        if (temp.length === 1) {
          info.push(temp[0].intent + " : " + temp[0].count);
        } else {
          temp.forEach(function (data) {
            info.push(data.intent + " : " + data.count + " | ");
          });
        }
        final.push(info);
      });
      console.log("final");
      console.log(final);
      this.setState({ date: date });
      this.setState({ final: final });
    });
  }

  renderTableData() {
    var counter = 0;
    return this.state.date.map((element, index) => {
      var final = this.state.final;
      var topic = final[counter];
      counter++;

      return (
        <tr className="TableRow">
          <td className="TableData">{element}</td>
          <td className="TableData3">{topic}</td>
        </tr>
      );
    });
  }

  render() {
    return (
      <div>
        <table className="Table3">
          <tbody>
            <tr className="TableRow">
              <th className="TableHeader">Date</th>
              <th className="TableHeader">Topics</th>
            </tr>
          </tbody>
          <tbody className="TableData3">{this.renderTableData()}</tbody>
        </table>
      </div>
    );
  }
}
