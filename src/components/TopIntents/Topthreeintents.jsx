import React from "react";
//import Highcharts from "highcharts";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
const dateformat = require("dateformat");
const timestamp = require("tm-timestamp");
let axios = require("axios");

export default class Topthreeintents extends React.Component {
  state = {
    resultobj: [],
  };

  componentDidMount() {
    var bot = this.props.bot;
    var url = "http://localhost:4000/topintents?instance=" + bot;

    axios.get(url).then((result) => {
      // Top 3 Intents datewise
      //    console.log(result.data);
      var result1 = result.data;
      this.setState({ resultobj: result1 });
    });
  }

  clicked = () => {
    if (this.props.height || this.props.width) {
      var value = "Topthreeintents";
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
      //console.log("test:" + d1);
    });

    var temp1 = new Date();
    const firstDate = new Date(temp1);
    const secondDate = new Date(d1[0]);
    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
    //  console.log("days:" + diffDays);
    // console.log("second  date:" + secondDate);

    var noOfDays = diffDays;
    //var noOfDays = this.props.noOfDays;
    //var noOfDays = 24;
    var object = this.state.resultobj;
    //console.log(noOfDays);
    var today = new Date();
    var datacollection = [];
    //console.log(today);
    for (let i = noOfDays; i >= 0; i--) {
      var dateobj = new Date();
      dateobj.setDate(today.getDate() - i);
      datacollection.push(dateformat(dateobj, "yyyy-mm-dd"));
    }

    var responseobj = {};
    datacollection.forEach((element) => {
      if (element in object) {
        responseobj[element] = object[element];
      } else {
        responseobj[element] = {};
      }
    });
    // console.log(responseobj);

    //var responseobj = object;
    var intents = [];
    var date = [];
    var countobj = [];
    var data1 = [];
    var data2 = [];
    var data3 = [];
    var final = {};
    var i, j, k, temp, element;
    //var finalarray = [];
    var high = [];
    var medium = [];
    var low = [];

    // Date Array
    Object.keys(responseobj).forEach(function (data) {
      date.push(data);
    });

    // Intents Array
    for (i = 0; i < date.length; i++) {
      var currentdate = date[i];
      temp = responseobj[currentdate];
      var length = temp.length;
      for (j = 0; j < length; j++) {
        if (!intents.includes(temp[j].intent)) {
          intents[intents.length] = temp[j].intent;
        } else if (intents.length === 0) {
          intents[0] = temp[j].intent;
        }
      }
    }

    // Occurrence of Intents on different dates
    for (i = 0; i < date.length; i++) {
      temp = responseobj[date[i]];
      for (j = 0; j < temp.length; j++) {
        element = temp[j];
        if (i === 0) {
          final[element.intent] = [];
        }
        final[element.intent][i] = element.count;
      }
      if (i === 0) {
        for (j = 0; j < intents.length; j++) {
          element = intents[j];
          if (!(element in final)) {
            final[element] = [];
            final[element][0] = 0;
          }
        }
      } else {
        for (j = 0; j < intents.length; j++) {
          element = intents[j];
          if (final[element].length === i) {
            final[element][i] = 0;
          }
        }
      }
    }
    //console.log("Final:" + JSON.stringify(final));

    for (i = 0; i < date.length; i++) {
      for (j = 0; j < intents.length; j++) {
        element = intents[j];
        var t = final[element][i];
        countobj.push(t);
      }
      countobj.sort(function (a, b) {
        return b - a;
      });
      for (j = 0; j < 3; j++) {
        for (k = 0; k < intents.length; k++) {
          element = intents[k];
          if (countobj[j] === final[element][i]) {
            if (j === 0 && data1.length === i) {
              data1.push({
                y: final[element][i],
                intent: element,
              });
            } else if (
              j === 1 &&
              data2.length === i &&
              element !== data1[i].intent
            ) {
              data2.push({
                y: final[element][i],
                intent: element,
              });
            } else if (
              j === 2 &&
              data3.length === i &&
              element !== data1[i].intent &&
              element !== data2[i].intent
            ) {
              data3.push({
                y: final[element][i],
                intent: element,
              });
            }
          }
        }
      }
      high.push([
        timestamp.getTimeStampNow(datacollection[i]),
        data1[i].y,
        data1[i].intent,
      ]);
      medium.push([
        timestamp.getTimeStampNow(datacollection[i]),
        data2[i].y,
        data2[i].intent,
      ]);
      low.push([
        timestamp.getTimeStampNow(datacollection[i]),
        data3[i].y,
        data3[i].intent,
      ]);

      countobj = [];
    }
    console.log("HIGH:::: " + JSON.stringify(high));
    console.log("MEDIUM:::: " + JSON.stringify(medium));
    console.log("LOW:::: " + JSON.stringify(low));

    var options = {
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
        height: this.props.height ? this.props.height : 400,
        width: this.props.width ? this.props.width : 700,
        type: "column",
        borderColor: this.props.width || this.props.height ? null : "grey",
        borderWidth: this.props.width || this.props.height ? null : 2,
        plotBackgroundColor: "#fbfdd3",
      },

      navigator: {
        enabled: this.props.height || this.props.width ? false : true,
      },
      scrollbar: {
        enabled: this.props.height || this.props.width ? false : true,
      },

      xAxis: {
        //categories: this.state.date,
        // categories: date,
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
      },
      yAxis: {
        opposite: false,
        lineWidth: 3,
        lineColor: "#A9A9A9",
        min: 0,
        title: {
          text: this.props.height && this.props.width ? false : "No of Intents",
          style: {
            fontSize: "15px",
            fontFamily: "Calibri",
          },
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
        stackLabels: {
          style: {
            //fontWeight: "bold",
            color:
              // theme
              (Highcharts.defaultOptions.title.style &&
                Highcharts.defaultOptions.title.style.color) ||
              "gray",
          },
        },
      },
      legend:
        this.props.height && this.props.width
          ? false
          : {
              enabled: true,
              align: "right",
              x: -30,
              verticalAlign: "top",
              y: 85,
              floating: true,
              backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || "white",
              borderColor: "#CCC",
              borderWidth: this.props.height ? 0 : 1,
              shadow: false,
            },
      tooltip: {
        split: false,
        xDateFormat: "%d-%m-%Y",
        pointFormat: "<br/>Count: {point.y}",
      },
      /*      tooltip: {
        split: false,
        xDateFormat: "%d-%m-%Y",
        // headerFormat: "",
      }, */
      plotOptions: {
        column: {
          stacking: "normal",
          dataLabels: {
            enabled: false,
          },
        },
      },
      rangeSelector: {
        //zoomType: "",
        enabled: this.props.height || this.props.width ? false : true,
        //        selected: 0,
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
          name: "High",
          //data: this.state.data1,
          data: high,
        },

        {
          name: "Medium",
          //data: this.state.data2,
          data: medium,
        },

        {
          name: "Low",
          //data: this.state.data3,
          data: low,
        },
      ],
      title: {
        text: "Top 3 topics discussed",

        style: {
          color: "#000",
          fontSize: this.props.height || this.props.width ? "15px" : "20px",
          fontFamily: "Calibri",
        },
      },
    };

    return (
      <div onClick={this.clicked}>
        <HighchartsReact
          highcharts={Highcharts}
          constructorType={"stockChart"}
          options={options}
        />
      </div>
    );
  }
}
