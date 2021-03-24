import React from "react";
import { slideDown, slideUp } from "./anim";
import "./index.css";
import $ from "jquery";
//import "bootstrap";
//import "bootstrap/dist/css/bootstrap.css";
//import "bootstrap/dist/js/bootstrap.js";
var axios = require("axios");
//var dialogflow = require("./config/properties");

export default class TableRow extends React.Component {
  state = {
    expanded: false,
    entityValue: "",
    selectedIntent: "",
    tableCollection: [],
    tableLoading: true,
  };

  listEntities = async (instance, callback) => {
    var projectid = this.props.projectid;
    var url =
      "http://localhost:4000/listentities?projectid=" +
      projectid +
      "&instance=" +
      instance;

    await axios.get(url).then(function (result) {
      callback(result.data);
    });
  };

  highlightValueHandler = (rowId, text) => {
    if (this.props.tableCollection !== undefined) {
      var tableCollection = this.props.tableCollection;
      var entityColours = this.props.entityColours;

      tableCollection.forEach((data) => {
        var entitycolor = entityColours[data.name];
        text = text.replace(
          data.value,
          '<span style = "background-color: ' + entitycolor + '">$&</span>'
        );
      });
      $("#collapsibletable " + rowId + " #utterance").html(text);
    } else {
      $("#collapsibletable " + rowId + " #utterance").html(text);
      setTimeout(() => {
        this.highlightValueHandler(rowId, text);
      }, 5000);
    }
  };

  /* 
  highlightValueHandler = (rowId, text) => {
    var tableCollection = this.props.tableCollection;
    var entityColours = this.props.entityColours;

    tableCollection.forEach((data) => {
      var entitycolor = entityColours[data.name];
      text = text.replace(
        data.value,
        '<span style = "background-color: ' + entitycolor + '">$&</span>'
      );
    });
    $("#collapsibletable " + rowId + " #utterance").html(text);
  };
 */

  // refreshtable = async (instance, utterance, callback) => {
  /*    console.log("NOW GOING TO REFRESH");
    this.props.refresh(); */

  /*     var delete_url =
      "http://localhost:4000/deleterecord?utterance=" +
      utterance +
      "&instance=" +
      instance;

    await axios.get(delete_url).then((result) => {
      console.log(result);
      if (result.data === "success") {
        this.reff();
        callback("hogaya refrsh");
      }
    });
  }; */
  getSelectedText = (callback) => {
    var text;
    if (window.getSelection) {
      text = window.getSelection().toString();
    } else if (document.selection && document.selection.type !== "Control") {
      text = document.selection.createRange().text;
    }
    callback(text);
  };

  toggleExpander = (rowId) => {
    var currentRow = "#" + rowId;
    if (!this.state.expanded) {
      this.setState({ expanded: true }, () => {
        if (this.refs.expanderBody) {
          /* this.setState({
            tableCollection: this.props.tableCollection,
          }); */
          var text = $(
            "#collapsibletable " + currentRow + " #utterance"
          ).html();
          this.highlightValueHandler(currentRow, text);

          slideDown(this.refs.expanderBody);

          $("#collapsibletable " + currentRow + " #utterance").mouseup(() => {
            this.getSelectedText((text) => {
              if (
                text === "" ||
                text === " " ||
                text.startsWith(" ") ||
                text.endsWith(" ")
              ) {
                alert("Please select value again");
              } else {
                console.log(text);
                this.setState({
                  entityValue: text,
                });
              }
            });
          });

          $("#collapsibletable " + currentRow + " #selectintent").mouseup(
            () => {
              var intentid = $(
                "#collapsibletable " + currentRow + " #selectintent"
              ).val();
              this.setState({
                selectedIntent: intentid,
              });
            }
          );

          $("#collapsibletable " + currentRow + " #selectentity").mouseup(
            () => {
              var entityValue = this.state.entityValue;

              if (entityValue === "") {
                alert("Select Entity Value first");
              } else {
                var text = $(
                  "#collapsibletable " + currentRow + " #utterance"
                ).text();
                $("#collapsibletable " + currentRow + " #utterance").html(text);

                var entityType = $(
                  "#collapsibletable " +
                    currentRow +
                    " #selectentity option:selected"
                ).text();

                var tableCollection = this.state.tableCollection;
                var entityColours = this.props.entityColours;
                var valueIndex = [],
                  indices = [],
                  tempCollection = [];

                if (entityType !== "Select Entity") {
                  tableCollection.forEach((data) => {
                    if (data.value !== entityValue) {
                      tempCollection.push(data);
                    }
                  });
                  tableCollection = tempCollection;

                  tableCollection.push({
                    name: entityType,
                    value: entityValue,
                  });

                  tableCollection.forEach((data) => {
                    var index = text.indexOf(data.value);
                    valueIndex.push({
                      name: data.name,
                      value: data.value,
                      index: index,
                    });
                    indices.push(index);
                  });
                  tableCollection = [];
                  indices.sort(function (a, b) {
                    return a - b;
                  });
                  indices.forEach((index) => {
                    valueIndex.forEach((data) => {
                      if (index === data.index) {
                        tableCollection.push({
                          name: data.name,
                          value: data.value,
                        });
                      }
                    });
                  });
                  tableCollection.forEach((data) => {
                    var entitycolor = entityColours[data.name];
                    text = text.replace(
                      data.value,
                      '<span style = "background-color: ' +
                        entitycolor +
                        '">$&</span>'
                    );
                  });

                  this.setState({
                    tableCollection: tableCollection,
                  });
                  $("#collapsibletable " + currentRow + " #utterance").html(
                    text
                  );
                }
              }
            }
          );

          $("#collapsibletable " + currentRow + " #updatebtn").click(() => {
            var intentid = this.state.selectedIntent;
            if (intentid === "" || intentid === "Select Intent") {
              alert("No Intent selected !");
            } else {
              var instance = "'" + this.props.bot + "'";
              this.listEntities(instance, (entitylist) => {
                var resolvedvalue = [];
                var updatedEntityList = [];

                entitylist.forEach((data) => {
                  data.value.forEach((val) => {
                    resolvedvalue.push(JSON.parse(val));
                  });
                  updatedEntityList.push({
                    id: data.id,
                    name: data.name,
                    value: resolvedvalue,
                  });
                  resolvedvalue = [];
                });
                console.log("updated:" + JSON.stringify(updatedEntityList));

                var projectid = this.props.projectid;
                var utterance = this.props.trainingPhrase.utterance;
                var entityCollection = this.state.tableCollection;
                var ec = JSON.stringify(entityCollection);
                var entities = JSON.stringify(updatedEntityList);

                var url =
                  "http://localhost:4000/updateintent?projectid=" +
                  projectid +
                  "&intentid=" +
                  intentid +
                  "&entities=" +
                  entities +
                  "&utterance=" +
                  utterance +
                  "&ec=" +
                  ec +
                  "&instance=" +
                  instance;

                var flag;
                // var func = this.props.refresh();
                axios.get(url).then(function (result) {
                  alert(result.data);
                  flag = result.data;

                  console.log("value of flag:" + flag);
                  if (flag === "Utterance added to Agent Successfully !") {
                    var delete_url =
                      "http://localhost:4000/deleterecord?utterance=" +
                      utterance +
                      "&instance=" +
                      instance;

                    axios.get(delete_url).then((result) => {
                      if (result.data === "Failed to delete the record!") {
                        alert(result.data);
                      }
                      //console.log(result);
                    });
                  }
                });
                setTimeout(() => {
                  this.props.refresh();
                }, 3000);
              });
              //this.props.refresh();
            }
          });
          $("#collapsibletable " + currentRow + " #resetbtn").click(() => {
            var text = $(
              "#collapsibletable " + currentRow + " #utterance"
            ).text();
            $("#collapsibletable " + currentRow + " #utterance").html(text);

            this.setState({
              entityValue: "",
              tableCollection: [],
            });
          });
        }
      });
    } else {
      slideUp(this.refs.expanderBody, {
        onComplete: () => {
          this.setState({ expanded: false });
        },
      });
    }
  };

  render() {
    var intentoptions = this.props.intents.map((data) => (
      <option value={data.id}>{data.name}</option>
    ));

    var entityoptions = this.props.entities.map((data) => (
      <option value={data.name}>{data.name}</option>
    ));

    var retrieveTableState = () => {
      console.log("Success");
      return this.state.tableCollection.map((data) => (
        <tr>
          <td>{data.name}</td>
          <td>{data.value}</td>
        </tr>
      ));
    };

    var retrieveTableProps = () => {
      if (this.props.tableCollection !== undefined) {
        console.log("Inside if");
        this.setState({
          tableCollection: this.props.tableCollection,
          tableLoading: false,
        });
      } else {
        console.log("Inside else");
        setTimeout(() => {
          retrieveTableProps();
        }, 5000);
      }
    };

    /* 
    var tableoptions = this.state.tableCollection.map((data) => (
      <tr>
        <td>{data.name}</td>
        <td>{data.value}</td>
      </tr>
    ));
 */
    if (this.props.trainingPhrase !== undefined) {
      var trainingPhrase = this.props.trainingPhrase;
      return [
        <tr key="main" onClick={() => this.toggleExpander(trainingPhrase.id)}>
          <td className="uk-text-nowrap">{this.props.index}.</td>
          <td colSpan={3}>{trainingPhrase.utterance}</td>
          <td colSpan={2}>{trainingPhrase.date}</td>
        </tr>,
        this.state.expanded && (
          <tr className="expandable" key="tr-expander" id={trainingPhrase.id}>
            <td className="uk-background-muted" colSpan={6}>
              <div id="mygrid" ref="expanderBody" className="inner uk-grid">
                <div className="uk-text-center" id="utterance">
                  {trainingPhrase.utterance}
                </div>
                <div id="entitydwn">
                  <select id="selectentity">
                    <option>Select Entity</option>
                    {entityoptions}
                  </select>
                </div>
                <div className="uk-text-center" id="intentoptions">
                  <select id="selectintent">
                    <option>Select Intent</option>
                    {intentoptions}
                  </select>
                </div>
                <div id="mybutton">
                  <td>
                    <button class="uk-button uk-button-default" id="updatebtn">
                      Update
                    </button>
                  </td>
                </div>
                <div id="mytable">
                  <div id="entityCollection">
                    <table class="uk-table uk-table-divider" id="entitytable">
                      <tr>
                        <th>
                          <center>Name</center>
                        </th>
                        <th>
                          <center>Value</center>
                        </th>
                      </tr>
                      {this.state.tableLoading
                        ? retrieveTableProps()
                        : retrieveTableState()}
                    </table>
                  </div>
                </div>
                <div id="resetcontainer">
                  <button class="uk-button uk-button-default" id="resetbtn">
                    Reset
                  </button>
                </div>
              </div>
            </td>
          </tr>
        ),
      ];
    } else {
      return null;
    }
  }
}
