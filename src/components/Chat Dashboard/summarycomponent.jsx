import React, { Component } from "react";
import "./style.scss";

export default class SummaryComponent extends Component {
  render() {
    if (this.props.sname === "Channel" || this.props.sname === "Engine")
      return (
        <div>
          <img src={`Channels/${this.props.Type}.png`} alt="ChannelPIC" />
        </div>
      );
    else
      var css = this.props.color ? "circle css_" + this.props.color : "circle";
    return (
      <div className={css}>
        <div className="data">{this.props.Type}</div>
      </div>
    );
  }
}
