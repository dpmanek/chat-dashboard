import React from "react";
import axios from "axios";
import "../Modal/ReportModal.scss";

export default class NoOfUsersTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resultToDisplay: [],
    };
  }
  componentDidMount() {
    var bot = this.props.bot;
    var url = "http://localhost:4000/noofusers?instance=" + bot;
    axios.get(url).then((res) => {
      console.log(res.data);
      const resultToDisplay = res.data;
      this.setState({ resultToDisplay });
    });
  }
  render() {
    return (
      <div>
        <table className="Table">
          <tr className="TableRow">
            <th className="TableHeader">Date</th>
            <th className="TableHeader">Number of users</th>
          </tr>
          <tbody className="TableData">
            {this.state.resultToDisplay.map((resultToDisplay) => (
              <tr className="TableRow">
                <td className="TableData">{resultToDisplay.date}</td>
                <td className="TableData">{resultToDisplay.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
