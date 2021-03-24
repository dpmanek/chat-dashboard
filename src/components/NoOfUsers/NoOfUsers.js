import React from "react";
//import Highcharts from "highcharts";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import axios from "axios";
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/offline-exporting")(Highcharts);
const dateformat = require("dateformat");
const timestamp = require("tm-timestamp");

export default class NoOfUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resultToDisplay: [],
    };
  }
  componentDidMount() {
    var bot = this.props.bot;
    var url = "http://localhost:4000/noofusers1?instance=" + bot;
    axios.get(url).then((res) => {
      console.log(res.data);
      const resultToDisplay = res.data;
      this.setState({ resultToDisplay });
    });
  }
  clicked = () => {
    if (this.props.height) {
      var value = "NoOfUsers";
      this.props.maximize(value);
    }
  };
  render() {
    var temp = new Date();
    var temp1 = dateformat(temp, "yyyy-mm-dd");
    var tdate = [];

    var object = this.state.resultToDisplay;
    object.forEach(function (data) {
      tdate.push(data.date);
    });
    const firstDate = new Date(temp1);
    const secondDate = new Date(tdate[0]);
    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
    console.log("days:" + diffDays);

    // var noOfDays = this.props.noOfDays;
    var noOfDays = diffDays;
    console.log("log:" + noOfDays);
    var today = new Date();
    var datacollection = [];
    console.log(today);
    for (let i = noOfDays; i >= 0; i--) {
      var date = new Date();
      date.setDate(today.getDate() - i);
      // datacollection.push(dateformat(date, "dd-mm-yy"));
      //let dateholder = dateformat(date, "yyyy-mm-dd");
      //timestamp.getTimeStampNow(dateholder)
      datacollection.push(dateformat(date, "yyyy-mm-dd"));
      //datacollection.push(timestamp.getTimeStampNow(dateholder));
    }
    console.log(datacollection);

    var result = this.state.resultToDisplay;
    //var countArray = [];
    //var dateArray = [];
    var finalarray = [];
    //1549863000000 == 1549881750000
    datacollection.forEach(function (date) {
      var enter = 0;

      result.forEach(function (obj) {
        if (date === obj.date) {
          enter = 1;
          //countArray.push(obj.count);
          //dateArray.push(obj.date);
          finalarray.push([timestamp.getTimeStampNow(obj.date), obj.count]);
        }
      });
      if (enter === 0) {
        var count = 0;
        //countArray.push(count);
        //dateArray.push(date);
        finalarray.push([timestamp.getTimeStampNow(date), count]);
        // finalarray.push([date, count]);
      }
    });
    //console.log("final:" + finalarray);
    // console.log("countArray:" + countArray);
    //console.log("dateArray:" + dateArray);
    var chartoption;

    chartoption = {
      type: "column",
      borderWidth: this.props.width || this.props.height ? null : 2,
      borderColor: this.props.width || this.props.height ? null : "grey",
      //width:700,
      height: this.props.height ? this.props.height : 480,
      width: this.props.width ? this.props.width : 1175,
      plotBackgroundColor: "#fbfdd3",
    };

    const options = {
      chart: chartoption,
      exporting:
        this.props.height || this.props.width
          ? false
          : {
              chartOptions: {
                // specific options for the exported image
                plotOptions: {
                  series: {
                    dataLabels: {
                      enabled: true,
                    },
                  },
                },
              },
              fallbackToExportServer: false,
            },
      title: {
        text: "User Engagement",
        style: {
          color: "#000",
          fontSize: this.props.height || this.props.width ? "15px" : "20px",
          fontFamily: "Calibri",
        },
      },

      subtitle: {
        text: "",
      },
      xAxis: {
        /*         categories: this.state.resultToDisplay.map(
          (resultToDisplay) => resultToDisplay.date
        ), */
        // type: "datetime",
        // categories: dateArray,

        lineWidth: 3,
        lineColor: "#A9A9A9",
        labels:
          this.props.height && this.props.width
            ? false
            : {
                style: {
                  color: "black",
                  fontSize: "11px",
                },
              },
        crosshair: true,
      },
      yAxis: {
        min: 0,
        lineWidth: 3,
        lineColor: "#A9A9A9",
        opposite: false, //for rendering y axis on left

        title: {
          style: {
            fontSize: "15px",
            fontFamily: "Calibri",
          },
          text:
            this.props.height && this.props.width
              ? false
              : "No of interactions",
        },
        labels:
          this.props.height && this.props.width
            ? false
            : {
                style: {
                  color: "black",
                  fontSize: "11px",
                },
              },
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
        },
      },

      rangeSelector: {
        //zoomType: "",
        enabled: this.props.height || this.props.width ? false : true,
        //selected: 0,
        allButtonsEnabled: true,
        buttons: [
          {
            type: "day",
            count: 7,
            text: "1w",
          },
          {
            type: "month",
            count: 1,
            text: "1m",
          },
          {
            type: "month",
            count: 3,
            text: "3m",
          },
          {
            type: "month",
            count: 6,
            text: "6m",
          },
          {
            type: "ytd",
            text: "YTD",
          },
          {
            type: "year",
            count: 1,
            text: "1y",
          },
          {
            type: "all",
            text: "All",
          },
        ],
      },
      /*   buttons: [
          {
            enabled: true,
          },
        ], */
      //allButtonsEnabled: true,
      //selected: 1,
      /*         inputDateFormat: "%d-%m-%Y",
        inputEditDateFormat: "%d-%m-%Y", */

      navigator: {
        enabled: this.props.height || this.props.width ? false : true,
      },
      scrollbar: {
        enabled: this.props.height || this.props.width ? false : true,
      },
      tooltip: {
        split: false,
        // headerFormat: "",
        xDateFormat: "%d-%m-%Y",
      },
      series: [
        {
          color: "#7FC8B8 ",
          showInLegend: false,
          name: "Days on which bot is used",
          colorByPoint: false,
          /*           data: this.state.resultToDisplay.map(
            (resultToDisplay) => resultToDisplay.count
          ), */
          data: finalarray,
          // data: this.state.resultToDisplay,
        },
      ],
    };
    return (
      <div className="outer1" onClick={this.clicked}>
        <HighchartsReact
          constructorType={"stockChart"}
          highcharts={Highcharts}
          options={options}
        />
      </div>
    );
  }
}
