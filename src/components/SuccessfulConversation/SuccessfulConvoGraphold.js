import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import axios from "axios";
import "../Modal/ReportModal.scss";

export default class SuccessfulConvoGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resultobj: [],
    };
  }
  componentDidMount() {
    var bot = this.props.bot;
    console.log(bot);
    axios
      .get("http://localhost:4000/successfulconversation?bot=" + bot)
      .then((res) => {
        console.log("return from get");
        console.log(res.data);
        var result = res.data;
        this.setState({ resultobj: result });
        //console.log(this.state.resultobj)
      });

    this.clicked = () => {
      if (this.props.height || this.props.width) {
        var value = "SuccessfulConvoGraph";
        this.props.maximize(value);
      }
    };
  }
  render() {
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

        categories: this.state.resultobj.map(
          (resultobj) => resultobj.conv_date
        ),

        labels:
          this.props.height && this.props.width
            ? false
            : {
                style: {
                  color: "black",
                  fontSize: "10px",
                },
              },
      },
      yAxis: {
        allowDecimals: false,

        lineColor: "#A9A9A9",

        lineWidth: 3,
        min: 0,
        title: {
          style: { fontSize: "15px", fontFamily: "calibri" },
          text:
            this.props.height && this.props.width
              ? false
              : "No of successful conversations",
        },
        labels:
          this.props.height && this.props.width
            ? false
            : {
                style: {
                  color: "black",
                  fontSize: "12px",
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
          name: "Successful Conversations",
          color: "#90EE90",
          showInLegend: false,
          borderRadius: 2,
          borderWidth: 1,
          colorByPoint: false,
          data: this.state.resultobj.map((resultobj) => resultobj.count),
        },
      ],
      title: {
        text: "Timeline wise count of Successful Conversations",
        style: {
          color: "#000",
          fontSize: this.props.height || this.props.width ? "15px" : "20px",
          fontFamily: "Calibri",
        },
      },
    };
    return (
      <div className="outerSC" onClick={this.clicked}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    );
  }
}
