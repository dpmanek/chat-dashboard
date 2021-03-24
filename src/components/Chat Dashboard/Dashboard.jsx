import React, { Component } from "react";
import Wordcloud from "../WordCloud/Wordcloud"; //wordcloud
import "./style.scss";
import Modal from "../Modal/Modal";
import Topthreeintents from "../TopIntents/Topthreeintents";
import DefaultIntentsGraph from "../DefaultIntents/DefaultIntentsGraph";
import NoOfUsers from "../NoOfUsers/NoOfUsers";
import Summary from "./Summary";
import Rating from "../Rating/Rating";
import SuccessfulConvoGraph from "../SuccessfulConversation/SuccessfulConvoGraph";
import Footer from "../Footer/footer";

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reportClicked: false,
      reportType: "",
    };
  }
  reportsetter = (value) => {
    this.setState({ reportClicked: true });
    this.setState({ reportType: value });
  };
  close = () => {
    this.setState({ reportClicked: false });
  };

  render() {
    const { Bot } = this.props.location.state;
    const { Instancename } = this.props.location.state;
    // var Instancename = this.state.Instancename;
    //var Instancename = "TeaBot";
    //var Bot = this.state.Bot;
    //var Bot = "Tea";
    console.log(" Instance name:" + Instancename);
    console.log(" Bot name:" + Bot);
    console.log("Type of Instance name:" + typeof Instancename);
    console.log("Type of Instance name:" + typeof Bot);
    return (
      <div className="container">
        {this.state.reportClicked && this.state.reportType ? (
          <div className="popup">
            <Modal
              close={this.close}
              reportType={this.state.reportType}
              bot={Instancename}
            />
          </div>
        ) : null}
        <div className="dashboard">
          <div className="titlebar">
            <div className="dashboardtitle">{Bot} Dashboard</div>
            {/* <div className="log">Logout</div> */}
          </div>
        </div>

        <div className="summary">
          <div className="componentheader">
            <div className="componentfont">Summary</div>
          </div>

          <div className="SummaryBox">
            <Summary Bot={Bot} Instancename={Instancename} />
          </div>
        </div>

        <div className="reports">
          <div>
            <div className="componentheader">
              <div className="componentfont">Reports</div>
            </div>

            <div className="reportcomponent">
              <div className="rectangle rectangle-left-margin">
                <NoOfUsers
                  bot={Instancename}
                  height="200"
                  width="435"
                  maximize={this.reportsetter}
                  className="modal"
                />
              </div>
              <div className="rectangle">
                <Topthreeintents
                  bot={Instancename}
                  height="200"
                  width="435"
                  maximize={this.reportsetter}
                  className="modal"
                />
              </div>

              <div className="rectangle">
                <SuccessfulConvoGraph
                  bot={Instancename}
                  height="200"
                  width="435"
                  maximize={this.reportsetter}
                  className="modal"
                />
              </div>

              <div className="rectangle rectangle-left-margin">
                <DefaultIntentsGraph
                  bot={Instancename}
                  height="200"
                  width="435"
                  maximize={this.reportsetter}
                  className="modal"
                />
              </div>

              <div className="rectangle">
                <Wordcloud
                  bot={Instancename}
                  height="200"
                  width="435"
                  maximize={this.reportsetter}
                  className="modal"
                />
              </div>

              <div className="rectangle">
                <Rating
                  bot={Instancename}
                  height="200"
                  width="435"
                  maximize={this.reportsetter}
                  className="modal"
                />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
