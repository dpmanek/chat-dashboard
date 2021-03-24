import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import axios from "axios";
import "../Modal/ReportModal.scss";

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

    this.clicked = () => {
      if (this.props.height || this.props.width) {
        var value = "DefaultIntentsGraph";
        this.props.maximize(value);
      }
    };
  }
  render() {
    var datacollection = [];
    var result = this.state.resultobj;
    Object.keys(result).forEach(function (key) {
      datacollection.push(key);
    });
    console.log(datacollection);
    var countArray = [];
    var dateArray = [];
    var dataForTable = [];
    datacollection.forEach(function (date) {
      var flag = 0;
      console.log(date);
      var intents = result[date];
      intents.forEach(function (ele) {
        if (ele.intent === "Drink_fallback") {
          flag = 1;
          dateArray.push(date);
          countArray.push(ele.count);
          let obj = {};
          obj.date = date;
          obj.count = ele.count;
          dataForTable.push(obj);
        }
      });
      if (flag === 0) {
        console.log("flag 0");
        var c = 0;
        dateArray.push(date);
        countArray.push(c);
        let obj = {};
        obj.date = date;
        obj.count = c;
        dataForTable.push(obj);
      }
      console.log(countArray);
      console.log(dateArray);
    });
    console.log(dataForTable);
    const options = {
      chart: {
        type: "column",
        borderWidth: 2,
        borderColor: "grey",
        borderRadius: "2x",
        height: this.props.height ? this.props.height : 400,
        width: this.props.width ? this.props.width : 700,
        plotBackgroundColor: "#fbfdd3",
      },

      title: {
        style: {
          color: "#000",
          fontSize: this.props.height || this.props.width ? "15px" : "20px",
          fontFamily: "Calibri",
        },
        text: "Timeline wise count of when the bot defaulted",
      },
      subtitle: {
        text: "",
      },

      xAxis: {
        scrollbar: {
          enabled: true,
        },

        title: {
          style: { fontSize: "17px", fontWeight: "bold" },
          text: "",
        },
        lineWidth: 3,
        lineColor: "#A9A9A9",

        categories: dateArray,

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
      series: [
        {
          name: "Default Fallback Intents",

          color: "#FFAC33",
          showInLegend: false,
          //showInLegend: this.props.height||this.props.width?false:true,

          /*  borderRadius: 2,
          borderWidth: 1, */
          colorByPoint: false,
          data: countArray,
        },
      ],
    };
    return (
      <div className="outer1" onClick={this.clicked}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    );
  }
}
