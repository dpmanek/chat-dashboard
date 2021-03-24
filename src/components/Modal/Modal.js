import React from "react";

import "../Modal/ReportModal.scss";
import Wordcloud from "../WordCloud/Wordcloud";
import WordcloudTableP from "../WordCloud/WordcloudTableP";

import Topthreeintents from "../TopIntents/Topthreeintents";
import Topintentstable from "../TopIntents/Topintentstable";

import DefaultIntentsGraph from "../DefaultIntents/DefaultIntentsGraph";
import DefaultIntentsTable from "../DefaultIntents/DefaultIntentsTable";

import NoOfUsers from "../NoOfUsers/NoOfUsers";
//import NoOfUsersTable from "../NoOfUsers/NoOfUsersTable";

import Rating from "../Rating/Rating";
import RatingTable from "../Rating/RatingTable";

import SuccessfulConvoGraph from "../SuccessfulConversation/SuccessfulConvoGraph";
import SuccessfulConvoTable from "../SuccessfulConversation/SuccessfulConvoTable";

import UpdateIntent from "../Failed Utterances/UpdateIntent";

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: "reset",
      failmodal: false,
      //  refreshfail: "reset",
      //newdatecame: null,
    };
  }

  handleClose = () => {
    this.props.close();
  };

  dateclicked = (data) => {
    this.setState({ date: null });
    //this.setState({ newdatecame: null });
    //this.setState({ newdatecame: true });
    this.setState({ date: data });
  };

  datereset = () => {
    this.setState({ date: "reset" });
  };

  failmodal = () => {
    this.setState({ failmodal: !this.state.failmodal });
  };

  refreshfail = () => {
    this.setState({ failmodal: false });
    this.setState({ failmodal: true });
    /*  setTimeout(() => {
      this.setState({ failmodal: true });
    }, 1000); */
  };
  render() {
    var bot = this.props.bot;

    console.log(bot);
    if (!this.state.failmodal) {
      return (
        <div className="modal display-block">
          <section className="modal-main">
            <table>
              <tr>
                <td className="GraphData">
                  {this.props.reportType === "wordcloud" && (
                    <Wordcloud bot={this.props.bot} />
                  )}

                  {this.props.reportType === "Topthreeintents" && (
                    <Topthreeintents
                      bot={this.props.bot}
                      noOfDays="15"
                      date={this.dateclicked}
                    />
                  )}

                  {this.props.reportType === "DefaultIntentsGraph" && (
                    <DefaultIntentsGraph
                      bot={this.props.bot}
                      noOfDays="600"
                      date={this.dateclicked}
                    />
                  )}

                  {this.props.reportType === "NoOfUsers" && (
                    <NoOfUsers bot={this.props.bot} /* noOfDays="600" */ />
                  )}

                  {this.props.reportType === "Rating" && (
                    <Rating bot={this.props.bot} />
                  )}

                  {this.props.reportType === "SuccessfulConvoGraph" && (
                    <SuccessfulConvoGraph
                      bot={this.props.bot}
                      date={this.dateclicked}
                    />
                  )}
                </td>

                <td
                  className={
                    this.props.reportType === "Topthreeintents"
                      ? "MakeTableData1"
                      : "MakeTableData"
                  }
                >
                  {this.props.reportType === "wordcloud" && (
                    <WordcloudTableP bot={this.props.bot} />
                  )}
                  {this.state.date === "reset" &&
                    this.props.reportType === "Topthreeintents" && (
                      <Topintentstable bot={this.props.bot} />
                    )}

                  {this.state.date !== "reset" &&
                    this.state.date !== null &&
                    this.state.date &&
                    this.props.reportType === "Topthreeintents" && (
                      <Topintentstable
                        bot={this.props.bot}
                        date={this.state.date}
                      />
                    )}

                  {this.state.date === "reset" &&
                    this.props.reportType === "DefaultIntentsGraph" && (
                      <DefaultIntentsTable bot={this.props.bot} />
                    )}

                  {this.state.date !== "reset" &&
                    this.state.date !== null &&
                    this.state.date &&
                    this.props.reportType === "DefaultIntentsGraph" && (
                      <DefaultIntentsTable
                        bot={this.props.bot}
                        date={this.state.date}
                      />
                    )}

                  {/* 
                {this.props.reportType === "NoOfUsers" && (
                  <NoOfUsersTable bot={this.props.bot} />
                )} */}
                  {this.props.reportType === "Rating" && (
                    <RatingTable bot={this.props.bot} />
                  )}

                  {this.state.date === "reset" &&
                    this.props.reportType === "SuccessfulConvoGraph" && (
                      <SuccessfulConvoTable bot={this.props.bot} />
                    )}

                  {this.state.date !== "reset" &&
                    this.state.date !== null &&
                    this.state.date &&
                    this.props.reportType === "SuccessfulConvoGraph" && (
                      <SuccessfulConvoTable
                        bot={this.props.bot}
                        date={this.state.date}
                      />
                    )}
                </td>

                <td>
                  <button className="Button" onClick={this.handleClose}>
                    X
                  </button>
                </td>
              </tr>
            </table>
            <div>
              {this.props.reportType === "SuccessfulConvoGraph" ||
              this.props.reportType === "DefaultIntentsGraph" ||
              this.props.reportType === "Topthreeintents" ? (
                <div className="description">
                  *Please click on the tip of the bar for more details
                </div>
              ) : null}
              <div className="reset1">
                {this.props.reportType === "SuccessfulConvoGraph" ||
                this.props.reportType === "DefaultIntentsGraph" ||
                this.props.reportType === "Topthreeintents" ? (
                  <button className="resetbutton" onClick={this.datereset}>
                    Reset
                  </button>
                ) : null}
              </div>
              <div className="failutterances">
                {this.props.reportType === "DefaultIntentsGraph" ? (
                  <button className="failbutton " onClick={this.failmodal}>
                    Failed Utterances
                  </button>
                ) : null}
              </div>
            </div>
          </section>
        </div>
      );
    } else if (this.state.failmodal) {
      return (
        <div className="modal display-block">
          <section className="modal-main">
            <table>
              <tr>
                <td>
                  <button className="Button" onClick={this.handleClose}>
                    X
                  </button>
                </td>
              </tr>
            </table>
            <button className="failbutton" onClick={this.failmodal}>
              back
            </button>

            <UpdateIntent refresh={this.refreshfail} bot={this.props.bot} />
          </section>
        </div>
      );
    }
  }
}

export default Modal;
