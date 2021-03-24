import React from "react";
import axios from "axios";
import "../Modal/ReportModal.scss";

export default class DefaultIntentsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resultobj: [],
    };
  }
  componentDidMount() {
    var bot = this.props.bot;
    console.log(bot);
    axios.get("http://localhost:4000/table?bot=" + bot).then((res) => {
      console.log("return from get");
      console.log(res.data);
      var result = res.data;
      console.log(result);
      this.setState({ resultobj: result });
    });

    this.clicked = () => {
      if (this.props.height || this.props.width) {
        var value = "DefaultIntentsGraph";
        this.props.maximize(value);
      }
    };
  }
  renderTableData() {
    return this.state.resultobj.map((ele, index) => {
      const { date, msg } = ele;
      return (
        <tr className="TableRowDI">
          <td className="TableDataDI">{date}</td>
          <td className="TableDataDI">{msg}</td>
        </tr>
      );
    });
  }

  render() {
    /* Test */

    return (
      <table className="TableDI" width="300px">
        <tr className="TableRowDI">
          <th className="TableHeaderDI">Date</th>
          <th className="TableHeaderDI">Message</th>
        </tr>
        <tbody className="TableDataDI">{this.renderTableData()}</tbody>
      </table>
    );
  }
}
