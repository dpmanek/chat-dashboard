import React from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";

import "../Modal/ReportModal.scss";

export default class Topintentstable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      offset: 0,
      data: [],
      perPage: 10,
      currentPage: 0,
      pageCount: null,
      date: [],
      final: [],
    };
    this.handlePageClick = this.handlePageClick.bind(this);
  }

  receivedData() {
    let date = this.props.date;

    var nofilter =
      "http://localhost:4000/topintentstable?instance=" + this.props.bot;

    var filter =
      "http://localhost:4000/topintentstablefilter?instance=" +
      this.props.bot +
      "&date=" +
      date;

    var getcall = this.props.date ? filter : nofilter;
    axios.get(getcall).then((res) => {
      var responseobj = res.data;
      var date = [];
      var final = [];
      var data = [];
      // Date Array
      Object.keys(responseobj).forEach(function (data) {
        date.push(data);
      });

      date.forEach(function (day) {
        var temp = responseobj[day];
        var info = [];
        if (temp.length === 1) {
          info.push(temp[0].intent + " : " + temp[0].count);
        } else {
          temp.forEach(function (data) {
            info.push(data.intent + " : " + data.count + " | ");
          });
        }
        final.push(info);
      });
      for (let i = 0; i < date.length; i++) {
        data.push({ element: date[i], topic: final[i] });
      }
      //console.log(final);
      /*         date.forEach(function (data2) {
          final.forEach(function (data1) {
            data.push({ element: data2, topic: data1 });
          });
        }); */
      console.log("DATE ARRAY::::" + JSON.stringify(data));
      const slice = data.slice(
        this.state.offset,
        this.state.offset + this.state.perPage
      );
      const postData = slice.map((ele, index) => {
        const { element, topic } = ele;
        return (
          <tr className="TableRow">
            <td>{element}</td>
            <td className="TableData3">{topic}</td>
          </tr>
        );
      });

      this.setState({
        pageCount: Math.ceil(date.length / this.state.perPage),
        postData,
      });
    });
  }

  handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * this.state.perPage;

    this.setState(
      {
        currentPage: selectedPage,
        offset: offset,
      },
      () => {
        this.receivedData();
      }
    );
  };

  componentDidMount() {
    this.receivedData();
  }

  render() {
    return (
      <div className="modaltable">
        <tr>
          <ReactPaginate
            previousLabel={"prev"}
            nextLabel={"next"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={this.state.pageCount}
            marginPagesDisplayed={0}
            pageRangeDisplayed={2}
            onPageChange={this.handlePageClick}
            containerClassName={"pagination1"}
            subContainerClassName={"pages pagination"}
            activeClassName={"active"}
          />
        </tr>

        <tr>
          <table className="Table">
            <tr className="TableRow">
              <th className="TableHeader1">Date</th>
              <th className="TableHeader">Topics</th>
            </tr>
            <tbody className="TableData3">{this.state.postData}</tbody>
          </table>
        </tr>
      </div>
    );
  }
}
