import React, { Component } from "react";
import Homepage from "./components/Homepage/Homepage";
import Dashboard from "./components/Chat Dashboard/Dashboard";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
export default class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <Switch>
            <Route path="/" component={Homepage} exact={true} />
            <Route path="/Dashboard" component={Dashboard} />
          </Switch>
        </Router>
      </div>
    );
  }
}
