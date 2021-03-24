import React from "react";

import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import "../Modal/ReportModal.scss";
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/offline-exporting")(Highcharts);

//import exporting from "highcharts/modules/exporting";
//import ofx from "highcharts/modules/offline-exporting";
//exporting(Highcharts);
//ofx(Highcharts);

class Rating extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: [],
    };
  }

  componentDidMount() {
    var i = 0;

    var bot = this.props.bot;
    axios
      .get("http://localhost:4000/getRatingForPieChart?bot=" + bot)
      .then((res) => {
        console.log(res.data);
        var test = res.data;
        var count = Array(11).fill(0);
        test.forEach(function (ele) {
          var str = ele.message;
          var json = str.substring(28);
          var obj = JSON.parse(json);
          console.log(obj);
          var intent = obj[0].queryResult.intent.displayName;
          if (intent === "feedback_rating") {
            var rating =
              obj[0].queryResult.parameters.fields.rating.stringValue;
            rating = Number(rating);
            count[rating] += 1;
          }
        });
        var totalCount = 0;
        count.forEach(function (item) {
          totalCount += item;
        });
        var resultobj = [];
        for (i = 1; i <= 5; i++) {
          var resobj = {};
          resobj.name = "Rating " + i;
          resobj.y = (count[i] * 100) / totalCount;
          /* if(i==1){
                resobj.sliced=true;
                resobj.selected=true;
            } */
          resultobj.push(resobj);
        }
        this.setState({ result: resultobj });
        console.log("hi:" + JSON.stringify(resultobj));
      });
  }
  clicked = () => {
    if (this.props.height || this.props.width) {
      var value = "Rating";
      this.props.maximize(value);
    }
  };

  render() {
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
        borderWidth: this.props.width || this.props.height ? null : 2,
        borderColor: this.props.width || this.props.height ? null : "grey",
        type: "pie",
        height: this.props.height ? this.props.height : 400,
        width: this.props.width ? this.props.width : 700,
        plotBackgroundColor: "#fbfdd3",
      },
      colors: ["#adebad", "#70db70", "#33cc33", "#248f24", "#145214"],

      //colors: ["#b3b3ff", "#6666ff", "#0000cc", "#000099", "#00004d"],

      title: {
        text: "User Feedback Rating",
        style: {
          color: "#000",
          fontSize: this.props.height || this.props.width ? "15px" : "20px",
          fontFamily: "Arial",
        },
      },

      tooltip: {
        pointFormat: "{point.name}: <b>{point.percentage:.1f}%</b>",
      },
      accessibility: {
        point: {
          valueSuffix: "%",
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>:<br/>{point.percentage:.1f} %",
            style: {
              fontSize: "10px",
            },
            //fontSize: "3px",
            /*             distance: -40,
            filter: {
              property: "percentage",
              operator: ">",
              value: 4,
            }, */
          },
        },
      },
      series: [
        {
          name: "Rating",
          colorByPoint: true,
          data: this.state.result,
          showInLegend: true,
        },
      ],

      legend:
        this.props.width || this.props.height
          ? false
          : {
              title: {
                text:
                  'RATING:<br/><span style="font-size: 9px; color: #666; font-weight: normal">(Highest:Rating 5 , Lowest: Rating 1)</span>',
                style: {
                  fontStyle: "Calibri",
                },
              },
              layout: "vertical",
              align: "right",
              verticalAlign: "top",
              x: -10,
              y: 100,
            },
    };
    console.log(options);
    return (
      <div className="outer" onClick={this.clicked}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    );
  }
}

export default Rating;
