import React from "react";
//import Highcharts from "highcharts";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

import axios from "axios";
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/offline-exporting")(Highcharts);
const timestamp = require("tm-timestamp");
//import "../Modal/ReportModal.scss";
const dateformat = require("dateformat");
export default class DefaultIntentsGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resultobj: [],
    };
  }
  componentDidMount() {
    var bot = this.props.bot;
    console.log(bot);

    axios.get("http://localhost:4000/graph?bot=" + bot).then((res) => {
      console.log("return from get");
      console.log(res.data);
      var result = res.data;
      this.setState({ resultobj: result });
      //console.log(this.state.resultobj)
    });
  }
  clicked = () => {
    if (this.props.height || this.props.width) {
      var value = "DefaultIntentsGraph";
      this.props.maximize(value);
    }
  };

  datesetter = (data) => {
    if (!this.props.height || !this.props.width) {
      var date = data;

      this.props.date(date);
    }
  };

  render() {
    var d1 = [];
    Object.keys(this.state.resultobj).forEach(function (d) {
      d1.push(d);
    });

    var temp1 = new Date();
    const firstDate = new Date(temp1);
    const secondDate = new Date(d1[0]);
    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
    console.log("days:" + diffDays);

    var noOfDays = diffDays;
    //var noOfDays = this.props.noOfDays;

    console.log(noOfDays);
    var today = new Date();
    var datacollection = [];
    console.log(today);
    for (let i = noOfDays; i >= 0; i--) {
      var date = new Date();
      date.setDate(today.getDate() - i);
      datacollection.push(dateformat(date, "yyyy-mm-dd"));
    }
    console.log(datacollection);

    var result = this.state.resultobj;

    var countArray = [];
    var dateArray = [];
    var finalarray = [];
    datacollection.forEach(function (date) {
      console.log(date);
      if (result[date] != null) {
        var intents = result[date];
        intents.forEach(function (ele) {
          if (ele.intent === "Default Fallback Intent") {
            dateArray.push(date);
            countArray.push(ele.count);
            finalarray.push([timestamp.getTimeStampNow(date), ele.count]);
          }
        });
      } else {
        var c = 0;
        dateArray.push(date);
        countArray.push(c);
        finalarray.push([timestamp.getTimeStampNow(date), c]);
      }
      console.log(countArray);
      console.log(dateArray);
    });
    const options = {
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

      chart: {
        events: {
          click: function (event) {
            this.datesetter(
              Highcharts.dateFormat("%Y-%m-%d", event.xAxis[0].value)
            );
          }.bind(this),
        },
        type: "column",
        borderWidth: this.props.width || this.props.height ? null : 2,
        borderColor: this.props.width || this.props.height ? null : "grey",
        borderRadius: this.props.width || this.props.height ? null : "2x",
        height: this.props.height ? this.props.height : 400,
        width: this.props.width ? this.props.width : 700,
        plotBackgroundColor: "#fbfdd3",
        // panning: true,
      },

      navigator: {
        enabled: this.props.height || this.props.width ? false : true,
      },
      scrollbar: {
        enabled: this.props.height || this.props.width ? false : true,
      },
      title: {
        style: {
          color: "#000",
          fontSize: this.props.height || this.props.width ? "15px" : "20px",
          fontFamily: "Calibri",
        },
        text: "Exception Scenarios",
      },
      subtitle: {
        text: "",
      },
      tooltip: {
        split: false,
        //headerFormat: "",
        xDateFormat: "%d-%m-%Y",
      },
      xAxis: {
        title: {
          style: { fontSize: "17px", fontWeight: "bold" },
          text: "",
        },
        lineWidth: 3,
        lineColor: "#A9A9A9",

        //  categories: dateArray,

        crosshair: true,
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
      yAxis: {
        allowDecimals: false,
        opposite: false, //for rendering y axis on left
        lineColor: "#A9A9A9",

        lineWidth: 3,
        min: 0,
        title: {
          style: {
            fontSize: "15px",
            fontFamily: "Calibri",
            //fontWeight: "bold",
          },
          text:
            this.props.height && this.props.width
              ? false
              : "No of Default Intents ",
        },
        labels:
          this.props.height && this.props.width
            ? false
            : {
                style: {
                  color: "black",
                  fontSize: "11px",
                  //"fontWeight": "bold"
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
      series: [
        {
          // showInNavigator: true,
          name: "Default Fallback Intents",

          color: "#FFAC33",
          showInLegend: false,
          //showInLegend: this.props.height||this.props.width?false:true,

          /*  borderRadius: 2,
          borderWidth: 1, */
          colorByPoint: false,
          // data: countArray,
          data: finalarray,
        },
      ],
    };
    return (
      <div className="outer1" onClick={this.clicked}>
        <HighchartsReact
          highcharts={Highcharts}
          constructorType={"stockChart"}
          options={options}
        />
      </div>
    );
  }
}
