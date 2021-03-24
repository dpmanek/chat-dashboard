import React from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";

import "../Modal/ReportModal.scss";

export default class NoOfUsersTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      offset: 0,
      data: [],
      perPage: 10,
      currentPage: 0,
      pageCount: null,
    };
    this.handlePageClick = this.handlePageClick.bind(this);
  }

  receivedData() {
    axios
      .get("http://localhost:4000/noofusers?instance=" + this.props.bot)
      .then((res) => {
        const data = res.data;
        const slice = data.slice(
          this.state.offset,
          this.state.offset + this.state.perPage
        );
        const postData = slice.map((ele, index) => {
          const { date, count } = ele;
          return (
            <tr className="TableRow">
              <td className="TableData">{date}</td>
              <td className="TableData">{count}</td>
            </tr>
          );
        });

        this.setState({
          pageCount: Math.ceil(data.length / this.state.perPage),
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
      <div>
        <tr>
          <table className="tableusers" width="300px">
            <tr className="TableRow">
              <th className="TableHeader">Date</th>
              <th className="TableHeader">Number of users</th>
            </tr>
            <tbody className="TableDatawc">{this.state.postData}</tbody>
          </table>
        </tr>

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
            containerClassName={"pagination"}
            subContainerClassName={"pages pagination"}
            activeClassName={"active"}
          />
        </tr>
      </div>
    );
  }
}
