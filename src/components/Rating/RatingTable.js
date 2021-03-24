import React from "react";
import "../Modal/ReportModal.scss";
import axios from "axios";

class RatingTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }
  componentDidMount() {
    axios
      .get("http://localhost:4000/getRatingForPieChart?bot=" + this.props.bot)
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
        /* var totalCount=0;
        count.forEach(function(item){
            totalCount+=item;
        }); */
        var resultobj = [];
        for (let i = 1; i <= 5; i++) {
          var resobj = {};
          resobj.name = i;
          resobj.y = count[i];
          /* if(i==1){
                resobj.sliced=true;
                resobj.selected=true;
            } */
          resultobj.push(resobj);
        }
        this.setState({ data: resultobj });
        console.log(this.state.data);
      });
  }
  renderTableData() {
    //{y.toFixed(2)+'%'}
    return this.state.data.map((ele, index) => {
      const { name, y } = ele;
      return (
        <tr className="TableRow">
          <td className="TableData">{name}</td>
          <td className="TableData">{y}</td>
        </tr>
      );
    });
  }

  render() {
    return (
      <table className="TableRating">
        <tr className="TableRow">
          <th className="TableHeader">Rating</th>
          <th className="TableHeader">Count</th>
        </tr>
        <tbody className="TableData">{this.renderTableData()}</tbody>
      </table>
    );
  }
}

export default RatingTable;
