import React, { Component } from "react";
//import Header from "./components/Header/header";
import Botlist from "../ListOfBot/botlist";
import Footer from "../Footer/footer";

import "../../App.scss";
export default class Homepage extends Component {
  render() {
    return (
      <div className="App">
        {/*  <Header /> */}
        <Botlist />
        <Footer />
      </div>
    );
  }
}
