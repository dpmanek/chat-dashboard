import React from "react";
import axios from "axios";
import "../Modal/ReportModal.scss";

export default class SuccessfulConvoTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resultobj: [],
    };
  }
  componentDidMount() {
    var bot = this.props.bot;
    console.log(bot);
    axios
      .get("http://localhost:4000/successfulconversation?bot=" + bot)
      .then((res) => {
        console.log("return from get");
        console.log(res.data);
        var result = res.data;
        this.setState({ resultobj: result });
      });

    this.clicked = () => {
      if (this.props.height || this.props.width) {
        var value = "SuccessfulConvoGraph";
        this.props.maximize(value);
      }
    };
  }
  renderTableData(dataForTable) {
    return dataForTable.map((ele, index) => {
      const { conv_date, count } = ele;
      return (
        <tr className="TableRow">
          <td className="TableData">{conv_date}</td>
          <td className="TableData">{count}</td>
        </tr>
      );
    });
  }

  render() {
    /* Test */

    /* test */
    // var data = this.props.data;
    //var data = dataForTable;
    return (
      <div className="scroll">
        <table className="Table">
          <tr className="TableRow">
            <th className="TableHeader">Date</th>
            <th className="TableHeader">Count</th>
          </tr>
          <tbody className="TableData">
            {this.renderTableData(this.state.resultobj)}
          </tbody>
        </table>
      </div>
    );
  }
}
