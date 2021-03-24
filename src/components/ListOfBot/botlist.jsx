import React, { Component } from "react";
import axios from "axios";
import BotCard from "./botcard";
import "./style.scss";
import Dashboard from "../Chat Dashboard/Dashboard";
export default class Botlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      botname: "",
      instancename: "",
      clicked: false,
      BotData: [],
    };
  }

  botnamehandler = (value) => {
    this.setState({ botname: value });
    this.setState({ clicked: true });
  };

  instancenamehandler = (value) => {
    this.setState({ instancename: value });
  };

  componentDidMount() {
    axios.get(`http://localhost:4000/list-of-instance`).then((res) => {
      const Data = res.data;
      console.log("list of instances:" + JSON.stringify(Data));
      this.setState({ BotData: Data });
    });
  }

  render() {
    if (!this.state.clicked)
      return (
        <div className="app">
          <div className="headerdiv">
            <div className="list">List of Bots</div>
          </div>

          <div className="BotCard-Holder">
            {this.state.BotData.map((data) => {
              return (
                <div>
                  <BotCard
                    botname={data.description}
                    instancename={data.instance}
                    botnamesetter={this.botnamehandler}
                    instancenamesetter={this.instancenamehandler}
                  />
                </div>
              );
            })}
          </div>
        </div>
      );
    if (this.state.clicked) {
      return (
        <div>
          <Dashboard
            Bot={this.state.botname}
            Instancename={this.state.instancename}
          />
        </div>
      );
    }
  }
}
