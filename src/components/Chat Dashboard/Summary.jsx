import React, { Component } from "react";
import SummaryComponent from "./summarycomponent";
import ReactTooltip from "react-tooltip";

import axios from "axios";
import "./style.scss";
export default class Summary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Data: [],
      top: [],
    };
  }
  componentDidMount() {
    console.log(" data: " + this.props.Instancename);
    console.log("Type of data: " + typeof this.props.Instancename);
    axios
      .get(
        "http://localhost:4000/database?instancename=" + this.props.Instancename
      )
      .then((res) => {
        const Data = res.data;
        console.log(JSON.stringify(Data));
        this.setState({ Data: Data });
        console.log("STATE" + JSON.stringify(this.state.Data.channel));
      });

    axios
      .get(
        "http://localhost:4000/summarytopthreeintents?bot=" +
          this.props.Instancename
      )
      .then((res) => {
        const Data = res.data;
        console.log(JSON.stringify(Data));

        this.setState({ top: Data });
        // console.log("STATE" + JSON.stringify(this.state.Data.channel));
      });
  }
  render() {
    //  var top1 = JSON.parse(this.state.top[0]);

    return (
      <div className="summary_container">
        <ReactTooltip />
        <div className="summary1">
          <table className="tablecomponents">
            <tr>
              <td
                className="tdsummary"
                data-tip={String(this.state.Data.channel)}
              >
                <SummaryComponent
                  sname="Channel"
                  Type={this.state.Data.channel}
                />
              </td>
              <td
                className="tdsummary "
                data-tip={String(this.state.Data.engine)}
              >
                <SummaryComponent
                  sname="Engine"
                  Type={this.state.Data.engine}
                />
              </td>
              <td className="tdsummary">
                <SummaryComponent
                  sname="Total user"
                  Type={this.state.Data.total_users}
                  color="blue"
                />
              </td>
              <td className="tdsummary">
                <SummaryComponent
                  sname="Conversations"
                  Type={this.state.Data.conversations}
                />
              </td>
              <td className="tdsummary">
                <SummaryComponent
                  sname="Success Rate"
                  Type={this.state.Data.Success_Rate}
                  color="green"
                />
              </td>
              <td className="tdsummary">
                <SummaryComponent
                  sname="Failed Utterances"
                  Type={this.state.Data.Failure_Rate}
                  color="orange"
                />
              </td>
            </tr>
            <tr className="SummaryDescription">
              <td className="tdsummary">Channel</td>
              <td className="tdsummary">
                {/* {this.state.Data.engine} */} Engine{" "}
              </td>
              <td className="tdsummary">{/* Users */}Interactions </td>
              <td className="tdsummary">Conversations</td>
              <td className="tdsummary">Success Rate</td>
              <td className="tdsummary">Failure Rate</td>
            </tr>
          </table>
        </div>
        <div className="vr"></div>

        <div className="rectholder">
          <table>
            <tr>
              <td className="tdsummary2" colSpan="3">
                <div className="desc"> Most Discussed topics</div>
              </td>
            </tr>

            <tr>
              <td className="tdsummary2">
                <div className="rect">
                  <div className="count">{this.state.top.t1count}</div>
                </div>
              </td>
              <td className="tdsummary2">
                <div className="rect">
                  <div className="count">{this.state.top.t2count}</div>
                </div>
              </td>
              <td className="tdsummary2">
                <div className="rect">
                  <div className="count">{this.state.top.t3count}</div>
                </div>
              </td>
            </tr>

            <tr>
              <td className="tdsummary2">
                <div className="intentname">{this.state.top.t1name}</div>
              </td>
              <td className="tdsummary2">
                <div className="intentname">{this.state.top.t2name}</div>
              </td>
              <td className="tdsummary2">
                <div className="intentname">{this.state.top.t3name}</div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    );
  }
}
