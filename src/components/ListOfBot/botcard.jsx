import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./style.scss";

export default class BotCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      botname: this.props.botname,
      instancename: this.props.instancename,
    };
  }
  statehandler = () => {
    this.props.botnamesetter(this.props.botname);
    this.props.instancenamesetter(this.props.instancename);
    /* if (this.props.botname === "Honda") this.props.ch("Honda");
    if (this.props.botname === "World Bank") this.props.ch("World Bank"); */
  };
  componentDidMount() {}
  render() {
    return (
      <div>
        <div className="row">
          <div className="column">
            <Link
              style={{ textDecoration: "none" }}
              to={{
                pathname: "/Dashboard",
                state: {
                  Bot: this.state.botname,
                  Instancename: this.state.instancename,
                },
              }}
            >
              <div className="card" /* onClick={this.statehandler} */>
                <h3 className="botname">{this.state.botname}</h3>
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
