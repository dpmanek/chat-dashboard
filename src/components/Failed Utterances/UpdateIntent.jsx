import React from "react";
//import { render } from 'react-dom';
import TableRow from "./TableRow";
import "./index.css";
//import "bootstrap";
//import "bootstrap/dist/css/bootstrap.css";
//import "bootstrap/dist/js/bootstrap.js";
import FadeLoader from "react-spinners/FadeLoader";
var axios = require("axios");
//var dialogflow = require("./config/properties");

export default class UpdateIntent extends React.Component {
  state = {
    credentials: [],
    intents: [],
    entities: [],
    entityColours: {},
    trainingPhrase: "",
    failedTrainingPhrases: [],
    tableCollection: {},
    pageLoading: true,
  };

  getCredentials = async (instance, callback) => {
    var url =
      "http://localhost:4000/failedutterancedatabase?instance=" + instance;
    await axios.get(url).then(function (result) {
      callback(result.data);
    });
  };

  retrieveFailedUtterances = async (instance, callback) => {
    var url = "http://localhost:4000/failedutterances?instance=" + instance;
    await axios.get(url).then(function (result) {
      callback(result.data);
    });
  };

  listIntents = async (instance, callback) => {
    var projectid = this.state.credentials[0].value;
    var url =
      "http://localhost:4000/listintents?projectid=" +
      projectid +
      "&instance=" +
      instance;

    await axios.get(url).then(function (result) {
      callback(result.data);
    });
  };

  listEntities = async (instance, callback) => {
    var projectid = this.state.credentials[0].value;
    var url =
      "http://localhost:4000/listentities?projectid=" +
      projectid +
      "&instance=" +
      instance;

    await axios.get(url).then(function (result) {
      callback(result.data);
    });
  };

  searchEntityValue = async (entityType, callback) => {
    var result = "";

    var trainingPhrase = this.state.trainingPhrase;
    var entities = this.state.entities;
    var trainingPhraseTokens = trainingPhrase.split(" ");

    if (entityType === "all") {
      await entities.forEach((entity) => {
        trainingPhraseTokens.forEach((token) => {
          entity.value.forEach((element) => {
            var synonyms = element.synonyms;
            if (token === element.value) {
              result = element.value;
              callback(result);
            }
            synonyms.forEach((synonym) => {
              if (token === synonym) {
                result = synonym;
                callback(result);
              }
            });
          });
        });
        result = "Not Found";
        callback(result);
      });
    } else {
      await entities.forEach((entity) => {
        if (entity.name === entityType) {
          trainingPhraseTokens.forEach((token) => {
            entity.value.forEach((element) => {
              var synonyms = element.synonyms;
              if (token === element.value) {
                result = element.value;
                callback(result);
              }
              synonyms.forEach((synonym) => {
                if (token === synonym) {
                  result = synonym;
                  callback(result);
                }
              });
            });
          });
          result = "Not Found";
          callback(result);
        }
      });
    }
  };

  searchEntityType = async (entityValue, callback) => {
    var entities = this.state.entities;
    var result = "";

    await entities.forEach((entity) => {
      var token = entityValue;
      entity.value.forEach((element) => {
        var synonyms = element.synonyms;
        if (token === element.value) {
          result = entity.name;
          callback(result);
        }
        synonyms.forEach((synonym) => {
          if (token === synonym) {
            result = entity.name;
            callback(result);
          }
        });
      });
      result = "Not Found";
      callback(result);
    });
  };

  generateEntityColours = async (instance, entityTypeList, callback) => {
    var entitycolours = [
      "#66ffff",
      "#ffff66",
      "#ff00ff",
      "#66ff66",
      "#ff1a66",
      "#ff751a",
      "#9c27b042",
      "#ff3333",
      "#FFFB00",
      "#da557d",
      "#4466e2",
      "#00ff99",
      "#ff9966",
      "#A1B0E5",
      "#d8d8d8",
      "#00ccff",
    ];
    //var entitycolours = dialogflow["'entitycolours'"];
    //var entitycolours = dialogflow[instance][entitycolours];
    //console.log(entityColours);
    var entityColours = {};

    for (var i = 0; i < entityTypeList.length; i++) {
      entityColours[entityTypeList[i]] = entitycolours[i];
    }
    this.setState({
      entityColours: entityColours,
    });
    callback(entityColours);
  };

  setLoading = () => {
    this.setState({
      pageLoading: false,
    });
  };

  highlightValues = async (failedTrainingPhrases) => {
    var tempCollection = [],
      tableCollection = {};

    await failedTrainingPhrases.forEach((trainingPhrase) => {
      var distinctValues = trainingPhrase.distinctValues;
      var dataCollection = [],
        valueCollection = [];

      distinctValues.forEach((distinctvalue) => {
        this.searchEntityType(distinctvalue, (entityType) => {
          if (entityType !== "Not Found") {
            if (!valueCollection.includes(distinctvalue)) {
              dataCollection.push({
                name: entityType,
                value: distinctvalue,
              });
              valueCollection.push(distinctvalue);
            }
          }
        });
      });

      tempCollection.push({
        id: trainingPhrase.id,
        utterance: trainingPhrase.utterance,
        date: trainingPhrase.date,
        distinctValues: trainingPhrase.distinctValues,
        entityCollection: dataCollection,
      });
    });

    tempCollection.forEach((data1) => {
      var valueIndex = [],
        indices = [];
      data1.entityCollection.forEach((data) => {
        var index = data1.utterance.indexOf(data.value);
        valueIndex.push({
          name: data.name,
          value: data.value,
          index: index,
        });
        indices.push(index);
      });
      var newDataCollection = [];
      indices.sort(function (a, b) {
        return a - b;
      });
      indices.forEach((index) => {
        valueIndex.forEach((data) => {
          if (index === data.index) {
            newDataCollection.push({
              name: data.name,
              value: data.value,
            });
          }
        });
      });

      data1.entityCollection = newDataCollection;
    });

    tempCollection.forEach((data) => {
      tableCollection[data.id] = data.entityCollection;
    });

    this.setState({
      failedTrainingPhrases: tempCollection,
      tableCollection: tableCollection,
    });
  };

  generateDistinctValues = async (callback) => {
    var failedTrainingPhrases = this.state.failedTrainingPhrases;
    var detectedValues,
      distinctValues,
      finalValues = [];

    await failedTrainingPhrases.forEach((data) => {
      var failedUtterance = data.utterance;
      detectedValues = [];
      distinctValues = [];
      this.setState({
        trainingPhrase: failedUtterance,
      });

      this.searchEntityValue("all", (result) => {
        if (result !== "Not Found") {
          detectedValues.push(result);
        }
      });

      distinctValues = detectedValues.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });

      finalValues.push(distinctValues);
    });

    var i = 0;
    while (i < failedTrainingPhrases.length) {
      failedTrainingPhrases[i] = {
        id: failedTrainingPhrases[i].id,
        utterance: failedTrainingPhrases[i].utterance,
        date: failedTrainingPhrases[i].date,
        distinctValues: finalValues[i],
      };
      i++;
    }
    this.setState({
      failedTrainingPhrases: failedTrainingPhrases,
    });
    callback(failedTrainingPhrases);
  };

  componentDidMount() {
    var instance = "'" + this.props.bot + "'";

    this.getCredentials(instance, (credentials) => {
      this.setState({
        credentials: credentials,
      });

      this.retrieveFailedUtterances(instance, (failedUtterances) => {
        var failedTrainingPhrases = [];

        for (var i = 0; i < failedUtterances.length; i++) {
          failedTrainingPhrases[i] = {
            id: i,
            utterance: failedUtterances[i].utterance,
            date: failedUtterances[i].date,
          };
        }

        this.setState(
          {
            failedTrainingPhrases: failedTrainingPhrases,
          },
          () => {
            this.setLoading();
          }
        );

        this.listIntents(instance, (intentlist) => {
          this.setState({
            intents: intentlist,
          });

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
            this.setState({
              entities: updatedEntityList,
            });

            var entityTypeList = [];
            updatedEntityList.forEach((entity) => {
              entityTypeList.push(entity.name);
            });
            this.generateEntityColours(
              instance,
              entityTypeList,
              (entityColours) => {
                console.log(entityColours);
                this.generateDistinctValues((failedTrainingPhrases) => {
                  this.highlightValues(failedTrainingPhrases);
                });
              }
            );
          });
        });
      });
    });
  }

  reff = () => {
    this.props.refresh();
  };

  render() {
    return (
      <div>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.0.0-beta.31/css/uikit.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"
        />
        <div className="table-container">
          <div className="uk-overflow-auto">
            <table
              style={{ height: "300px" }}
              className="uk-table uk-table-hover uk-table-middle uk-table-divider"
              id="collapsibletable"
            >
              <thead>
                <tr id="thead">
                  <th className="uk-table-shrink" />

                  <th id="theadcol" colSpan={3}>
                    <center>Utterance</center>
                  </th>
                  <th id="theadcol" colSpan={2}>
                    <center>Date</center>
                  </th>
                </tr>
              </thead>
              <tbody>
                {this.state.pageLoading ? (
                  <tr>
                    <td id="loader" colSpan={6}>
                      <FadeLoader
                        size={150}
                        color={"#1e90ff"}
                        loading={this.state.pageLoading}
                      />
                    </td>
                  </tr>
                ) : (
                  this.state.failedTrainingPhrases.map(
                    (trainingPhrase, index) => (
                      <TableRow
                        bot={this.props.bot}
                        refresh={this.reff}
                        key={index}
                        index={index + 1}
                        trainingPhrase={trainingPhrase}
                        tableCollection={
                          this.state.tableCollection[trainingPhrase.id]
                        }
                        intents={this.state.intents}
                        entities={this.state.entities}
                        entityColours={this.state.entityColours}
                        projectid={this.state.credentials[0].value}
                      />
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
