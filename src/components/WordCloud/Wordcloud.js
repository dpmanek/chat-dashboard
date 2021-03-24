import React from "react";

import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "../Modal/ReportModal.scss";
import loadWordcloud from "highcharts/modules/wordcloud.js";

require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/offline-exporting")(Highcharts);

loadWordcloud(Highcharts);

class Wordcloud extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: "",
      rawdata: [],
    };
  }
  componentDidMount() {
    var str = "";
    var bot = this.props.bot;
    axios
      .get("http://localhost:4000/getTextForWordCloud?bot=" + bot)
      .then((res) => {
        console.log(res.data);
        var test = res.data;
        console.log(test);
        test.forEach(function (ele) {
          str = str + " " + ele.text;
        });
        this.setState({ result: str });
        this.setState({ rawdata: test });
      });
  }
  clicked = () => {
    if (this.props.height || this.props.width) {
      var value = "wordcloud";
      this.props.maximize(value);
    }
  };

  render() {
    var avoidList = [
      "hi",
      "hello",
      "good",
      "morning",
      "night",
      "how",
      "is",
      "of",
      "are",
      "and",
      "yes",
      "no",
      "a",
      "an",
      "the",
      "for",
      "to",
      "i",
      "not",
      "with",
      "am",
      "in",
    ];
    var text = this.state.result;
    var lines = text.split(/[,. ]+/g);
    var max = 0;
    var data = Highcharts.reduce(
      lines,
      function (arr, word) {
        var obj = Highcharts.find(arr, function (obj) {
          if (avoidList.indexOf(word.toLowerCase()) === -1 && isNaN(word)) {
            return obj.name === word.toLowerCase();
          }
        });
        if (obj) {
          obj.weight += 1;
        } else {
          obj = {
            name: word,
            weight: 1,
          };
          arr.push(obj);
        }
        if (obj.weight > max) {
          max = obj.weight;
        }
        return arr;
      },
      []
    );
    var wc = [];
    console.log(max);
    var threshold = 0.1 * max;
    console.log(threshold);
    data.forEach(function (ele) {
      if (ele.weight > threshold) {
        wc.push(ele);
      }
    });
    Highcharts.seriesTypes.wordcloud.prototype.deriveFontSize = function (
      relativeWeight
    ) {
      var minFontSize = 25;
      // Will return a fontSize between 0px and 25px.
      return Math.floor(minFontSize * relativeWeight);
    };
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
        //width: 700,
        height: this.props.height ? this.props.height : 400,
        width: this.props.width ? this.props.width : 700,
        plotBackgroundColor: "#fbfdd3",
      },
      colors: [
        "#e812d1",
        "#ff0000",
        "#660000",
        "#ff6666",
        "#d98cb3",
        "#602040",
        "#ff00bf",
        "#ffd633",
        "#cca300",
        "#ff6600",
        "#b3ff66",
        "#66cc00",
        "#336600",
        "#b380ff",
        "#6600ff",
        "#140033",
        "#00ffff",
        "#009999",
        "#00ff99",
        "#cccc00",
        "#669900",
      ],
      series: [
        {
          type: "wordcloud",
          data: wc,
          name: "Occurrences",
        },
      ],
      title: {
        text: "Frequently used words",
        style: {
          color: "#000",
          fontSize: this.props.height || this.props.width ? "15px" : "20px",
          fontFamily: "Arial",
        },
      },
    };

    return (
      <div className="outer" onClick={this.clicked}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    );
  }
}

export default Wordcloud;
