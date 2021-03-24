var express = require("express");
var mysql = require("mysql");
var app = express();
var cors = require("cors");
app.use(cors());
//const timestamp = require("tm-timestamp");
const dateformat = require("dateformat");
const Properties = require("./properties.js");
var fetch = require("node-fetch");
var googleAuth = require("google-oauth-jwt");
var dialogflow = require("../Failed Utterances/config/properties");

var obj_properties1 = new Properties();
obj_properties1.getProperties(function (cred) {
  //agentsClient = new dialogflow.v2.AgentsClient(cred.config);
  //agent = cred.agentValues;

  var con = mysql.createConnection({
    host: cred.host,
    user: cred.user,
    password: cred.password,
    database: cred.database,
  });

  con.connect(function (err) {
    if (err) throw err;

    //for summary data
    app.get("/database", function (req, res) {
      var instance_name = req.query.instancename;
      console.log(instance_name);
      var botname = "'" + instance_name + "'";

      var bot_data = {
        channel: "",
        engine: "",
        total_users: null,
        conversations: null,
        Success_Rate: null,
        Failure_Rate: null,
      };
      var mc = {
        table: "",
      }; //message collection table
      //to fetch channel and engine data and instead of instance name pass your botname
      var fetch_channelengine =
        "select i.instance_name , e.entity_name , e.entity_type from instance i,entity e , entity_instance ei where ei.instance_id=i.id AND ei.entity_id =e.id AND i.instance_name =" +
        botname +
        "AND e.entity_type IN ('channel','aiengine')";

      con.query(fetch_channelengine, function (err, result, fields) {
        if (err) throw err;
        bot_data.engine = result[0].entity_name;
        bot_data.channel = result[1].entity_name;
      });

      var message_collection_query =
        "select eip.value from instance i,entity e,entity_attributes ea ,entity_instance ei , entity_instance_parameters eip    where e.id=ea.entity_id and i.id=ei.instance_id and e.id=ei.entity_id and  eip.entity_instance_id=ei.id and eip.entity_attribute_id= ea.id     and i.instance_name=" +
        botname +
        " and eip.entity_attribute_id=26";
      con.query(message_collection_query, function (err, result, fields) {
        if (err) throw err;
        mc.table = result[0].value;
        console.log("mc:" + mc.table);

        // total users

        var fetch_total_users =
          "select count(distinct userid) as Total_users from " +
          mc.table +
          " where botname =" +
          botname;
        con.query(fetch_total_users, function (err, result, fields) {
          if (err) throw err;
          bot_data.total_users = result[0].Total_users;
        });

        // for total conversations just change botname
        var total_conversations =
          "select count(botresponse) as Total_Conversations from " +
          mc.table +
          " where botname =" +
          botname;
        con.query(total_conversations, function (err, result, fields) {
          if (err) throw err;
          bot_data.conversations = result[0].Total_Conversations;
          console.log("BOT DATA:" + JSON.stringify(bot_data));
        });

        //for success and failure rate
        var rate_calculator =
          "select * from entity_messages_logs eml ,entity_instance ei , instance i, entity e where eml.entity_instance_id = ei.id and ei.instance_id =i.id and ei.entity_id = e.id  and e.entity_type = 'aiengine'and eml.message like 'Response from DialogflowAi%' and i.instance_name=" +
          botname;
        con.query(rate_calculator, function (err, result, fields) {
          if (err) throw err;
          //console.log(result[0].message);
          var success = 0;
          var failure = 0;
          result.forEach((element) => {
            var object = JSON.parse(
              element.message.substring(
                element.message.indexOf("["),
                element.message.lastIndexOf("]") + 1
              )
            );

            var intent = object[0].queryResult.intent.displayName;
            console.log("Intent:" + intent);
            // if (intent != "Default Fallback Intent") {
            if (intent != "Default Fallback Intent") {
              success++;
              console.log("success:" + success);
              console.log("failure:" + failure);
            } else {
              failure++;
              console.log("success:" + success);
              console.log("failure:" + failure);
            }
          });
          var temp = success + failure;
          success = (success / temp) * 100;
          failure = (failure / temp) * 100;
          console.log("Success Rate:" + success + "%");
          console.log("Failure Rate:" + failure + "%");
          bot_data.Success_Rate =
            temp == 0 ? 0 + "%" : Math.round(success) + "%";
          bot_data.Failure_Rate =
            temp == 0 ? 0 + "%" : Math.round(failure) + "%";

          //res.send(result[0].message);
          res.send(JSON.stringify(bot_data));
        });
      });
    });

    //for starting screen list of bots
    app.get("/list-of-instance", function (req, res) {
      var instance_details =
        "SELECT instance_name as instance,description FROM instance;";
      con.query(instance_details, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.send(JSON.stringify(result));
      });
    });

    //for wordcloud
    app.get("/getTextForWordCloud", function (req, res) {
      var bot = req.query.bot;
      console.log(bot);
      console.log("Fetching Value from database");
      var getMessageTable =
        'select eip.value from instance i,entity e, entity_attributes ea ,entity_instance ei ,entity_instance_parameters eip where instance_name=? and e.id=ea.entity_id and i.id=ei.instance_id and e.id=ei.entity_id and eip.entity_instance_id=ei.id and eip.entity_attribute_id= ea.id and ea.entity_attribute_name="messages-collection"';
      con.query(getMessageTable, [bot], function (err, result) {
        console.log(result);
        var table = result[0].value;
        console.log(table);
        var fetchTextForWordCloud = "select text from ?? where botname=?";
        con.query(fetchTextForWordCloud, [table, bot], function (err, result1) {
          console.log(result1);
          res.send(JSON.stringify(result1));
        });
      });
    });

    //top 3 intents
    app.get("/topintents", function (req, res) {
      var instance_name = req.query.instance;
      var bot = "'" + instance_name + "'";
      con.query(
        "select date_FORMAT(message_date,'%Y-%m-%d') conv_date, message from entity_messages_logs eml ,entity_instance ei , instance i, entity e where eml.entity_instance_id = ei.id and ei.instance_id =i.id and ei.entity_id = e.id  and e.entity_type = 'aiengine'and eml.message like 'Response from DialogflowAi%' and i.instance_name=" +
          bot +
          ";",
        function (err, result, fields) {
          if (err) throw err;
          var i, j, k;
          var final = [];
          var datecollection = [];
          var countobj = [];
          var resultobj = {};
          var resobj = {};
          result.forEach(function (item) {
            var temp = item.message.substr(
              item.message.indexOf("["),
              item.message.lastIndexOf("]") + 1
            );
            var responseobj = JSON.parse(temp);
            if (
              responseobj[0].queryResult.intent != null &&
              responseobj[0].queryResult.intent.displayName != "" &&
              responseobj[0].queryResult.intent.displayName !=
                "Default Fallback Intent" &&
              responseobj[0].queryResult.intent.displayName !=
                "Default Welcome Intent"
            ) {
              var intentname = responseobj[0].queryResult.intent.displayName;
              final.push({ date: item.conv_date, intent: intentname });
            }
          });

          for (i = 0; i < final.length; i++) {
            var date = final[i].date;
            var intent = final[i].intent;
            var temp = resultobj[date];
            var flag = true;

            if (date in resultobj) {
              for (j = 0; j < temp.length; j++) {
                if (intent === temp[j].intent) {
                  temp[j].count++;
                  flag = false;
                  break;
                }
              }
              if (flag) {
                temp[temp.length] = { intent: intent, count: 1 };
              }
            } else {
              resultobj[date] = [];
              resultobj[date][0] = { intent: intent, count: 1 };
            }
          }
          console.log("------------Result obj-----------------");
          console.log(resultobj);

          Object.keys(resultobj).forEach(function (key) {
            datecollection.push(key);
          });

          for (i = 0; i < datecollection.length; i++) {
            var currentdate = datecollection[i];
            var temp = resultobj[currentdate];
            for (j = 0; j < temp.length; j++) {
              countobj.push(temp[j].count);
            }
            countobj.sort(function (a, b) {
              return b - a;
            });
            var t1 = countobj[0];
            var t2 = countobj[1];
            var t3 = countobj[2];
            countobj = [];
            resobj[currentdate] = [];
            for (k = 0; k < temp.length; k++) {
              var length = resobj[currentdate].length;
              if (length === 3) {
                break;
              }
              if (
                temp[k].count === t1 ||
                temp[k].count === t2 ||
                temp[k].count === t3
              ) {
                if (length === 0) {
                  resobj[currentdate][0] = temp[k];
                } else {
                  resobj[currentdate][length] = temp[k];
                }
              }
            }
          }
          console.log(
            "-----------------------------------------------------------------"
          );
          console.log(resobj);
          res.end(JSON.stringify(resobj));
        }
      );
    });

    app.get("/topintentstable", function (req, res) {
      var instance_name = req.query.instance;
      var bot = "'" + instance_name + "'";
      con.query(
        "select date_FORMAT(message_date,'%d-%m-%y') conv_date, message from entity_messages_logs eml ,entity_instance ei , instance i, entity e where eml.entity_instance_id = ei.id and ei.instance_id =i.id and ei.entity_id = e.id  and e.entity_type = 'aiengine'and eml.message like 'Response from DialogflowAi%' and i.instance_name=" +
          bot +
          ";",
        function (err, result, fields) {
          if (err) throw err;
          var i, j, k;
          var final = [];
          var datecollection = [];
          var countobj = [];
          var resultobj = {};
          var resobj = {};
          result.forEach(function (item) {
            var temp = item.message.substr(
              item.message.indexOf("["),
              item.message.lastIndexOf("]") + 1
            );
            var responseobj = JSON.parse(temp);
            if (
              responseobj[0].queryResult.intent != null &&
              responseobj[0].queryResult.intent.displayName != "" &&
              responseobj[0].queryResult.intent.displayName !=
                "Default Fallback Intent" &&
              responseobj[0].queryResult.intent.displayName !=
                "Default Welcome Intent"
            ) {
              var intentname = responseobj[0].queryResult.intent.displayName;
              final.push({ date: item.conv_date, intent: intentname });
            }
          });

          for (i = 0; i < final.length; i++) {
            var date = final[i].date;
            var intent = final[i].intent;
            var temp = resultobj[date];
            var flag = true;

            if (date in resultobj) {
              for (j = 0; j < temp.length; j++) {
                if (intent === temp[j].intent) {
                  temp[j].count++;
                  flag = false;
                  break;
                }
              }
              if (flag) {
                temp[temp.length] = { intent: intent, count: 1 };
              }
            } else {
              resultobj[date] = [];
              resultobj[date][0] = { intent: intent, count: 1 };
            }
          }
          /*         console.log("------------Result obj-----------------");
        console.log(resultobj); */

          Object.keys(resultobj).forEach(function (key) {
            datecollection.push(key);
          });

          for (i = 0; i < datecollection.length; i++) {
            var currentdate = datecollection[i];
            var temp = resultobj[currentdate];
            for (j = 0; j < temp.length; j++) {
              countobj.push(temp[j].count);
            }
            countobj.sort(function (a, b) {
              return b - a;
            });
            var t1 = countobj[0];
            var t2 = countobj[1];
            var t3 = countobj[2];
            countobj = [];
            resobj[currentdate] = [];
            for (k = 0; k < temp.length; k++) {
              var length = resobj[currentdate].length;
              if (length === 3) {
                break;
              }
              if (
                temp[k].count === t1 ||
                temp[k].count === t2 ||
                temp[k].count === t3
              ) {
                if (length === 0) {
                  resobj[currentdate][0] = temp[k];
                } else {
                  resobj[currentdate][length] = temp[k];
                }
              }
            }
          }
          /*         console.log(
          "-----------------------------------------------------------------"
        );
        console.log(resobj); */
          res.end(JSON.stringify(resobj));
        }
      );
    });

    app.get("/topintentstablefilter", function (req, res) {
      var date = "'" + req.query.date + "'";
      var date1 = new Date(date);
      var firstDate = "'" + dateformat(date1, "dd-mm-yy") + "'";
      //console.log("date passed from chart is ::::" + firstDate);

      var instance_name = req.query.instance;
      var bot = "'" + instance_name + "'";
      con.query(
        "select date_FORMAT(message_date,'%d-%m-%y') conv_date, message from entity_messages_logs eml ,entity_instance ei , instance i, entity e where eml.entity_instance_id = ei.id and ei.instance_id =i.id and ei.entity_id = e.id  and e.entity_type = 'aiengine'and eml.message like 'Response from DialogflowAi%' and i.instance_name=" +
          bot +
          " and date_FORMAT(message_date,'%d-%m-%y') =" +
          firstDate +
          ";",
        function (err, result, fields) {
          if (err) throw err;
          var i, j, k;
          var final = [];
          var datecollection = [];
          var countobj = [];
          var resultobj = {};
          var resobj = {};
          result.forEach(function (item) {
            var temp = item.message.substr(
              item.message.indexOf("["),
              item.message.lastIndexOf("]") + 1
            );
            var responseobj = JSON.parse(temp);
            if (
              responseobj[0].queryResult.intent != null &&
              responseobj[0].queryResult.intent.displayName != "" &&
              responseobj[0].queryResult.intent.displayName !=
                "Default Fallback Intent" &&
              responseobj[0].queryResult.intent.displayName !=
                "Default Welcome Intent"
            ) {
              var intentname = responseobj[0].queryResult.intent.displayName;
              final.push({ date: item.conv_date, intent: intentname });
            }
          });

          for (i = 0; i < final.length; i++) {
            var date = final[i].date;
            var intent = final[i].intent;
            var temp = resultobj[date];
            var flag = true;

            if (date in resultobj) {
              for (j = 0; j < temp.length; j++) {
                if (intent === temp[j].intent) {
                  temp[j].count++;
                  flag = false;
                  break;
                }
              }
              if (flag) {
                temp[temp.length] = { intent: intent, count: 1 };
              }
            } else {
              resultobj[date] = [];
              resultobj[date][0] = { intent: intent, count: 1 };
            }
          }
          /*         console.log("------------Result obj-----------------");
        console.log(resultobj); */

          Object.keys(resultobj).forEach(function (key) {
            datecollection.push(key);
          });

          for (i = 0; i < datecollection.length; i++) {
            var currentdate = datecollection[i];
            var temp = resultobj[currentdate];
            for (j = 0; j < temp.length; j++) {
              countobj.push(temp[j].count);
            }
            countobj.sort(function (a, b) {
              return b - a;
            });
            var t1 = countobj[0];
            var t2 = countobj[1];
            var t3 = countobj[2];
            countobj = [];
            resobj[currentdate] = [];
            for (k = 0; k < temp.length; k++) {
              var length = resobj[currentdate].length;
              if (length === 3) {
                break;
              }
              if (
                temp[k].count === t1 ||
                temp[k].count === t2 ||
                temp[k].count === t3
              ) {
                if (length === 0) {
                  resobj[currentdate][0] = temp[k];
                } else {
                  resobj[currentdate][length] = temp[k];
                }
              }
            }
          }
          /* console.log(
          "-----------------------------------------------------------------"
        ); */
          // console.log(resobj);
          res.end(JSON.stringify(resobj));
        }
      );
    });
    //Default intent
    app.get("/graph", function (req, res) {
      var bot = req.query.bot;

      var sql =
        "select date_FORMAT(message_date,'%Y-%m-%d') conv_date, message from entity_messages_logs eml ,entity_instance ei , instance i, entity e where eml.entity_instance_id = ei.id and ei.instance_id =i.id and ei.entity_id = e.id  and e.entity_type = 'aiengine'and eml.message like 'Response from DialogflowAi%' and i.instance_name=? ";

      con.query(sql, [bot], function (err, result, fields) {
        if (err) throw err;
        var i, j, k;
        var final = [];
        var resultobj = {};
        var resobj = {};
        result.forEach(function (item) {
          var length = item.message.length;
          var temp = item.message.substr(28, length);
          var responseobj = JSON.parse(temp);
          if (
            responseobj[0].queryResult.intent != null &&
            responseobj[0].queryResult.intent.displayName ===
              "Default Fallback Intent"
          ) {
            var intentname = responseobj[0].queryResult.intent.displayName;
            final.push({ date: item.conv_date, intent: intentname });
          }
          //console.log(final)
        });
        for (i = 0; i < final.length; i++) {
          var date = final[i].date;
          var intent = final[i].intent;
          var temp = resultobj[date];
          var flag = true;
          if (date in resultobj) {
            for (j = 0; j < temp.length; j++) {
              if (intent === temp[j].intent) {
                temp[j].count++;
                flag = false;
                break;
              }
            }
            if (flag) {
              temp[temp.length] = { intent: intent, count: 1 };
            }
          } else {
            resultobj[date] = [];
            resultobj[date][0] = { intent: intent, count: 1 };
          }
        }
        console.log(resultobj);
        console.log("Heloo");
        res.send(JSON.stringify(resultobj));
      });
    });

    app.get("/defaultintent", function (req, res) {
      var bot = req.query.bot;
      console.log(bot);
      var sql =
        "select date_FORMAT(message_date,'%d-%m-%y') date, message from entity_messages_logs eml ,entity_instance ei , instance i, entity e where eml.entity_instance_id = ei.id and ei.instance_id =i.id and ei.entity_id = e.id  and e.entity_type = 'aiengine'and eml.message like 'Response from DialogflowAi%' and i.instance_name=?";
      con.query(sql, [bot], function (err, result) {
        if (err) throw err;
        var final = [];

        result.forEach(function (item) {
          var length = item.message.length;
          var temp = item.message.substr(28, length);
          var responseobj = JSON.parse(temp);
          if (
            responseobj[0].queryResult.intent != null &&
            responseobj[0].queryResult.intent.displayName ===
              "Default Fallback Intent"
          ) {
            var queryText = responseobj[0].queryResult.queryText;
            final.push({ date: item.date, msg: queryText });
          }
          //console.log(final)
        });

        res.send(JSON.stringify(final));
      });
    });

    app.get("/defaultintentfilter", function (req, res) {
      var bot = "'" + req.query.bot + "'";
      var date = "'" + req.query.date + "'";
      var date1 = new Date(date);
      var firstDate = "'" + dateformat(date1, "dd-mm-yy") + "'";
      console.log("date passed from chart is ::::" + firstDate);

      var sql1 =
        "select date_FORMAT(message_date,'%d-%m-%y') date, message from entity_messages_logs eml ,entity_instance ei , instance i, entity e where eml.entity_instance_id = ei.id and ei.instance_id =i.id and ei.entity_id = e.id  and e.entity_type = 'aiengine'and eml.message like 'Response from DialogflowAi%' and i.instance_name=" +
        bot +
        " and date_FORMAT(message_date,'%d-%m-%y') =" +
        firstDate;

      console.log(bot);

      con.query(sql1, function (err, result) {
        if (err) throw err;
        var final = [];

        result.forEach(function (item) {
          var length = item.message.length;
          var temp = item.message.substr(28, length);
          var responseobj = JSON.parse(temp);
          if (
            responseobj[0].queryResult.intent != null &&
            responseobj[0].queryResult.intent.displayName ===
              "Default Fallback Intent"
          ) {
            var queryText = responseobj[0].queryResult.queryText;
            final.push({ date: item.date, msg: queryText });
          }
          //console.log(final)
        });

        res.send(JSON.stringify(final));
      });
    });

    //No of user
    app.get("/noofusers", function (req, res) {
      var instance_name = req.query.instance;
      var botname = "'" + instance_name + "'";

      var mc = {
        table: "",
      };

      var message_collection_query =
        "select eip.value from instance i,entity e,entity_attributes ea ,entity_instance ei , entity_instance_parameters eip where e.id=ea.entity_id and i.id=ei.instance_id and e.id=ei.entity_id and  eip.entity_instance_id=ei.id and eip.entity_attribute_id= ea.id and i.instance_name=" +
        botname +
        " and ea.entity_attribute_name='messages-collection' ";
      con.query(message_collection_query, function (err, result) {
        if (err) throw err;
        mc.table = result[0].value;
        console.log("mc:" + mc.table);

        fetch_total_users =
          "select COUNT(DISTINCT userid) as count, date_FORMAT(botmessagetimestamp,'%d-%m-%y') as date from " +
          mc.table +
          " where botname =" +
          botname +
          " group by date(botmessagetimestamp)";

        con.query(fetch_total_users, function (error, results) {
          if (error) throw error;
          var resultToDisplay = [];
          results.forEach(function (data) {
            resultToDisplay.push({ count: data.count, date: data.date });
          });
          res.send(JSON.stringify(resultToDisplay));
        });
      });
    });
    app.get("/noofusers1", function (req, res) {
      var instance_name = req.query.instance;
      var botname = "'" + instance_name + "'";

      var mc = {
        table: "",
      };

      var message_collection_query =
        "select eip.value from instance i,entity e,entity_attributes ea ,entity_instance ei , entity_instance_parameters eip where e.id=ea.entity_id and i.id=ei.instance_id and e.id=ei.entity_id and  eip.entity_instance_id=ei.id and eip.entity_attribute_id= ea.id and i.instance_name=" +
        botname +
        " and ea.entity_attribute_name='messages-collection' ";
      con.query(message_collection_query, function (err, result) {
        if (err) throw err;
        mc.table = result[0].value;
        console.log("mc:" + mc.table);

        fetch_total_users =
          "select COUNT(DISTINCT userid) as count, date_FORMAT(botmessagetimestamp,'%Y-%m-%d') as date from " +
          mc.table +
          " where botname =" +
          botname +
          " group by date(botmessagetimestamp)";

        con.query(fetch_total_users, function (error, results) {
          if (error) throw error;
          var resultToDisplay = [];
          results.forEach(function (data) {
            // let dateholder = timestamp.getTimeStampNow(data.date);
            resultToDisplay.push({ date: data.date, count: data.count });
            //resultToDisplay.push([dateholder, data.count]);
          });

          res.send(JSON.stringify(resultToDisplay));
        });
      });
    });

    //successful conversation

    app.get("/graphForSuccessful", function (req, res) {
      var bot = req.query.bot;

      var sql =
        "select date_FORMAT(message_date,'%Y-%m-%d') conv_date, message from entity_messages_logs eml ,entity_instance ei , instance i, entity e where eml.entity_instance_id = ei.id and ei.instance_id =i.id and ei.entity_id = e.id  and e.entity_type = 'aiengine'and eml.message like 'Response from DialogflowAi%' and i.instance_name=? ";

      con.query(sql, [bot], function (err, result, fields) {
        if (err) throw err;
        var i, j, k;
        var final = [];
        var resultobj = {};
        var resobj = {};
        result.forEach(function (item) {
          var length = item.message.length;
          var temp = item.message.substr(28, length);
          var responseobj = JSON.parse(temp);
          if (
            responseobj[0].queryResult.intent != null &&
            responseobj[0].queryResult.intent.displayName !==
              "Default Fallback Intent" &&
            responseobj[0].queryResult.intent.displayName !=
              "Default Welcome Intent"
          ) {
            var intentname = responseobj[0].queryResult.intent.displayName;
            final.push({ date: item.conv_date, intent: intentname });
          }
          //console.log(final)
        });
        for (i = 0; i < final.length; i++) {
          var date = final[i].date;
          var intent = final[i].intent;
          var temp = resultobj[date];
          var flag = true;
          if (date in resultobj) {
            for (j = 0; j < temp.length; j++) {
              if (intent === temp[j].intent) {
                temp[j].count++;
                flag = false;
                break;
              }
            }
            if (flag) {
              temp[temp.length] = { intent: intent, count: 1 };
            }
          } else {
            resultobj[date] = [];
            resultobj[date][0] = { intent: intent, count: 1 };
          }
        }
        // console.log(resultobj);
        console.log("Heloo");
        res.send(JSON.stringify(resultobj));
      });
    });

    app.get("/successfulconversationtablenofilter", function (req, res) {
      var bot = "'" + req.query.bot + "'";

      var sql =
        "select date_FORMAT(message_date,'%d-%m-%y') date, message from entity_messages_logs eml ,entity_instance ei , instance i, entity e where eml.entity_instance_id = ei.id and ei.instance_id =i.id and ei.entity_id = e.id  and e.entity_type = 'aiengine'and eml.message like 'Response from DialogflowAi%' and i.instance_name=" +
        bot;

      //   var query = req.query.date == "reset" ? sql : sql1;
      con.query(sql, function (err, result) {
        if (err) throw err;
        var final = [];

        result.forEach(function (item) {
          var length = item.message.length;
          var temp = item.message.substr(28, length);
          var responseobj = JSON.parse(temp);
          if (
            responseobj[0].queryResult.intent != null &&
            responseobj[0].queryResult.intent.displayName !==
              "Default Fallback Intent" &&
            responseobj[0].queryResult.intent.displayName !=
              "Default Welcome Intent"
          ) {
            var queryText = responseobj[0].queryResult.queryText;
            final.push({ date: item.date, msg: queryText });
          }
          //  console.log(final);
        });

        res.send(JSON.stringify(final));
      });
    });

    app.get("/successfulconversationtablefilter", function (req, res) {
      var bot = "'" + req.query.bot + "'";

      var date = "'" + req.query.date + "'";
      var date1 = new Date(date);
      var firstDate = "'" + dateformat(date1, "dd-mm-yy") + "'";
      console.log("date passed from chart is ::::" + firstDate);

      var sql1 =
        "select date_FORMAT(message_date,'%d-%m-%y') date, message from entity_messages_logs eml ,entity_instance ei , instance i, entity e where eml.entity_instance_id = ei.id and ei.instance_id =i.id and ei.entity_id = e.id  and e.entity_type = 'aiengine'and eml.message like 'Response from DialogflowAi%' and i.instance_name=" +
        bot +
        " and date_FORMAT(message_date,'%d-%m-%y') =" +
        firstDate;

      con.query(sql1, function (err, result) {
        if (err) throw err;
        var final = [];

        result.forEach(function (item) {
          var length = item.message.length;
          var temp = item.message.substr(28, length);
          var responseobj = JSON.parse(temp);
          if (
            responseobj[0].queryResult.intent != null &&
            responseobj[0].queryResult.intent.displayName !==
              "Default Fallback Intent" &&
            responseobj[0].queryResult.intent.displayName !=
              "Default Welcome Intent"
          ) {
            var queryText = responseobj[0].queryResult.queryText;
            final.push({ date: item.date, msg: queryText });
          }
          //console.log(final);
        });

        res.send(JSON.stringify(final));
      });
    });

    //get rating
    app.get("/getRatingForPieChart", function (req, res) {
      console.log("Helooooo");
      var bot = req.query.bot;
      var getMessageTable =
        "select date_FORMAT(message_date,'%d-%m-%y') date, message from entity_messages_logs eml ,entity_instance ei , instance i, entity e where eml.entity_instance_id = ei.id and ei.instance_id =i.id and ei.entity_id = e.id  and e.entity_type = 'aiengine'and eml.message like '%feedback_rating%' and i.instance_name=?";
      con.query(getMessageTable, [bot], function (err, result) {
        console.log(result);
        res.send(JSON.stringify(result));
      });
    });

    //summary top 3
    app.get("/summarytopthreeintents", function (req, res) {
      var bot = "'" + req.query.bot + "'";
      var query =
        "select message from entity_messages_logs eml ,entity_instance ei , instance i, entity e where eml.entity_instance_id = ei.id and ei.instance_id =i.id and ei.entity_id = e.id  and e.entity_type = 'aiengine'and eml.message like 'Response from DialogflowAi%' and i.instance_name=" +
        bot;
      con.query(query, function (err, result) {
        var allintent = [];
        var final = [];
        result.forEach((element) => {
          var object = JSON.parse(
            element.message.substring(
              element.message.indexOf("["),
              element.message.lastIndexOf("]") + 1
            )
          );

          var intent = object[0].queryResult.intent.displayName;
          console.log("Intent:" + intent);
          allintent.push(intent);
        });
        // console.log("final::::" + allintent);

        const distinct = (value, index, self) => {
          return self.indexOf(value) === index;
        };
        const distinctintents = allintent.filter(distinct);
        console.log("Distinct :::" + distinctintents);

        distinctintents.forEach((dintent) => {
          var obj = {};
          obj.name = dintent;
          var count = 0;
          if (
            dintent != "Default Fallback Intent" &&
            dintent != "Default Welcome Intent"
          ) {
            allintent.forEach((aintent) => {
              if (dintent === aintent) {
                count += 1;
              }
            });
            obj.count = count;
            final.push(obj);
          }
        });
        // console.log("final unique:" + JSON.stringify(final));

        for (let i = 0; i < final.length; i++) {
          for (let j = 0; j < final.length - 1; j++) {
            if (final[j].count < final[j + 1].count) {
              var temp = final[j];
              final[j] = final[j + 1];
              final[j + 1] = temp;
            }
          }
        }
        // console.log("@@@@@@" + JSON.stringify(final));
        if (final[0] != null) {
          var result = {
            t1name: final[0].name,
            t2name: final[1].name,
            t3name: final[2].name,
            t1count: final[0].count,
            t2count: final[1].count,
            t3count: final[2].count,
          };
        } else {
          var result = {
            t1name: "",
            t2name: "",
            t3name: "",
            t1count: 0,
            t2count: 0,
            t3count: 0,
          };
        }
        //console.log("%%%" + JSON.stringify(result));
        res.send(JSON.stringify(result));
      });
    });

    //for failed utterances
    app.get("/failedutterancedatabase", function (req, res) {
      var instance = req.query.instance;

      con.query(
        "SELECT value FROM entity_instance_parameters eip, entity_instance ei, instance i, entity e where eip.entity_instance_id = ei.id and ei.instance_id = i.id and ei.entity_id = e.id and e.entity_type = 'aiengine' and i.instance_name = " +
          instance +
          ";",
        function (err, result, fields) {
          if (err) throw err;
          res.end(JSON.stringify(result));
        }
      );
    });

    app.get("/failedutterances", function (req, res) {
      /*   var con = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: config.development.database,
    }); */

      var instance = req.query.instance;

      con.query(
        "select date_FORMAT(message_date,'%d-%m-%y') date,message from entity_messages_logs eml ,entity_instance ei , instance i, entity e where eml.entity_instance_id = ei.id and ei.instance_id =i.id and ei.entity_id = e.id  and e.entity_type = 'aiengine'and eml.message like 'Response from DialogflowAi%' and i.instance_name=" +
          instance,

        function (err, result, fields) {
          var final = [];
          result.forEach(function (item) {
            var length = item.message.length;
            var temp = item.message.substr(28, length);
            var responseobj = JSON.parse(temp);
            if (
              responseobj[0].queryResult.intent != null &&
              responseobj[0].queryResult.intent.displayName ===
                "Default Fallback Intent"
            ) {
              var queryText = responseobj[0].queryResult.queryText;
              //final.push(queryText);
              final.push({ date: item.date, utterance: queryText });
            }
            ////console.log(final)
          });

          // console.log(JSON.stringify(final));
          res.end(JSON.stringify(final));
        }
      );

      app.get("/updateintent", function (req, res) {
        var projectid = req.query.projectid;
        var intentid = req.query.intentid;
        var utterance = req.query.utterance;
        var updated_intent;
        var entityCollection = req.query.ec;
        var entities = req.query.entities;
        var instance = req.query.instance;

        var privatekey = dialogflow[instance].privatekey;
        var clientemail = dialogflow[instance].clientemail;

        var entityCollectionObj = JSON.parse(entityCollection);
        var entityList = JSON.parse(entities);

        async function detectNewValues(entityCollection, entities, callback) {
          var newentity = {},
            entityobj = [];

          await entityCollection.forEach((data) => {
            var flag = 0;
            entities.forEach((entity) => {
              if (data.name === entity.name) {
                entity.value.forEach((element) => {
                  var synonyms = element.synonyms;
                  if (data.value === element.value) {
                    flag = 1;
                  }
                  synonyms.forEach((synonym) => {
                    if (data.value === synonym) {
                      flag = 1;
                    }
                  });
                });
                if (flag === 0) {
                  //console.log(data.name, data.value);
                  newentity["name"] = data.name;
                  newentity["value"] = data.value;
                  entityobj.push(newentity);
                  newentity = {};
                }
              }
            });
          });
          callback(entityobj);
        }

        async function searchEntityId(entities, entityType, callback) {
          await entities.forEach((entity) => {
            if (entity.name === entityType) {
              callback(entity.id);
            }
          });
        }

        async function getToken(callback) {
          //console.log("Inside getToken function");
          await googleAuth.authenticate(
            {
              email: clientemail,
              key: privatekey,
              scopes: [
                "https://www.googleapis.com/auth/cloud-platform",
                "https://www.googleapis.com/auth/dialogflow",
              ],
            },
            function (err, token) {
              callback(token);
            }
          );
        }

        async function getIntent(token, callback) {
          var intent;
          //console.log("Inside getIntent function");
          var url =
            "https://dialogflow.googleapis.com/v2/projects/" +
            projectid +
            "/agent/intents/" +
            intentid +
            "?intentView=INTENT_VIEW_FULL";
          var options = {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          };

          await fetch(url, options)
            .then((res) => res.json())
            .then((json) => {
              intent = json;
            });
          //console.log(intent);
          callback(intent);
        }

        async function getEntity(token, entityid, callback) {
          var entity;
          //console.log("Inside getEntity function");
          var url =
            "https://dialogflow.googleapis.com/v2/projects/" +
            projectid +
            "/agent/entityTypes/" +
            entityid;
          var options = {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          };

          await fetch(url, options)
            .then((res) => res.json())
            .then((json) => {
              entity = json;
            });
          //console.log(entity);
          callback(entity);
        }

        function retrieveEntityIndices(trainingPhrase) {
          var regex = /[/]/g,
            resultobj,
            indices = [];
          while ((resultobj = regex.exec(trainingPhrase))) {
            indices.push(resultobj.index);
          }
          return indices;
        }

        function createEachPart(text, entityType) {
          var part = {};
          if (entityType === null) {
            part["text"] = text;
            part["entityType"] = "";
            part["alias"] = "";
            part["userDefined"] = true;
          } else {
            part["text"] = text;
            part["entityType"] = "@" + entityType;
            part["alias"] = entityType;
            part["userDefined"] = true;
          }
          return part;
        }

        function createParts(utterance, entityCollection) {
          var trainingPhrase = utterance;
          var part = {},
            parts = [],
            indices = [],
            phrase = "";
          var lowerlimit, upperlimit, i, diff;

          // Utterance with no entities
          if (entityCollection.length === 0) {
            part = createEachPart(trainingPhrase, null);
            parts.push(part);
          } else {
            entityCollection.forEach((entity) => {
              trainingPhrase = trainingPhrase.replace(entity.value, "/");
            });
            indices = retrieveEntityIndices(trainingPhrase);

            for (i = 0; i < entityCollection.length; i++) {
              // handling section before first entity value
              if (i === 0) {
                if (indices[i] > 0) {
                  phrase = trainingPhrase.substr(0, indices[i]);
                  part = createEachPart(phrase, null);
                  parts.push(part);
                }
              }

              // regex is encountered
              part = createEachPart(
                entityCollection[i].value,
                entityCollection[i].name
              );
              parts.push(part);

              // handling section after last entity value
              if (i === entityCollection.length - 1) {
                if (indices[i] < trainingPhrase.length - 1) {
                  diff = trainingPhrase.length - 1 - (indices[i] + 1);
                  phrase = trainingPhrase.substr(indices[i] + 1, diff + 1);
                  part = createEachPart(phrase, null);
                  parts.push(part);
                }
              } else {
                lowerlimit = indices[i] + 1;
                upperlimit = indices[i + 1] - 1;
                if (lowerlimit === upperlimit) {
                  phrase = trainingPhrase.substr(lowerlimit, 1);
                  part = createEachPart(phrase, null);
                  parts.push(part);
                } else {
                  diff = upperlimit - lowerlimit;
                  phrase = trainingPhrase.substr(lowerlimit, diff + 1);
                  part = createEachPart(phrase, null);
                  parts.push(part);
                }
              }
            }
          }
          return parts;
        }

        detectNewValues(entityCollectionObj, entityList, (newValues) => {
          if (newValues.length > 0) {
            newValues.forEach((newValue) => {
              searchEntityId(entityList, newValue.name, (entityId) => {
                //console.log(entityId, newValue.name);

                // Insert New Values to Entities
                getToken(function (token) {
                  getEntity(token, entityId, async function (entity) {
                    //console.log("Callback function");
                    //console.log(entity);

                    await entity.entities.push({
                      value: newValue.value,
                      synonyms: [newValue.value],
                    });

                    getToken(function (token) {
                      //console.log("Inside FETCH method");
                      var url =
                        "https://dialogflow.googleapis.com/v2/projects/" +
                        projectid +
                        "/agent/entityTypes/" +
                        entityId;
                      var options = {
                        method: "PATCH",
                        body: JSON.stringify(entity),
                        headers: {
                          Authorization: "Bearer " + token,
                          "Content-Type": "application/json",
                        },
                      };

                      fetch(url, options)
                        .then((res) => res.json())
                        .then((json) => console.log(""));
                    });
                  });
                });
              });
            });
          }

          getToken(function (token) {
            getIntent(token, async function (intent) {
              //console.log("Callback function");
              //console.log(intent);
              var parts = await createParts(utterance, entityCollectionObj);
              intent.trainingPhrases.push({
                type: "EXAMPLE",
                parts: parts,
              });
              //console.log(intent);
              updated_intent = intent;
              getToken(async function (token) {
                //console.log("Inside FETCH method");
                var url =
                  "https://dialogflow.googleapis.com/v2/projects/" +
                  projectid +
                  "/agent/intents/" +
                  intentid +
                  "?intentView=INTENT_VIEW_FULL";
                var options = {
                  method: "PATCH",
                  body: JSON.stringify(updated_intent),
                  headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
                  },
                };

                await fetch(url, options)
                  .then((res) => res.json())
                  .then((json) => {
                    console.log("check:" + JSON.stringify(json));
                    if ("error" in json) {
                      res.end("Failed to add Utterance !");
                    } else {
                      res.end("Utterance added to Agent Successfully !");
                    }
                  });
              });
            });
          });

          // res.end("Utterance added to Agent Successfully !");
        });
      });

      app.get("/listintents", function (req, res) {
        var projectid = req.query.projectid;
        var instance = req.query.instance;
        console.log(instance);
        var privatekey = dialogflow[instance].privatekey;
        console.log(privatekey);
        var clientemail = dialogflow[instance].clientemail;
        console.log(clientemail);

        async function getToken(callback) {
          //console.log("Inside getToken function");
          await googleAuth.authenticate(
            {
              email: clientemail,
              key: privatekey,
              scopes: [
                "https://www.googleapis.com/auth/cloud-platform",
                "https://www.googleapis.com/auth/dialogflow",
              ],
            },
            function (err, token) {
              callback(token);
            }
          );
        }

        async function getIntentList(token, callback) {
          var intentList;
          //console.log("Inside getIntentList function");
          var url =
            "https://dialogflow.googleapis.com/v2/projects/" +
            projectid +
            "/agent/intents?intentView=INTENT_VIEW_FULL";
          var options = {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          };

          await fetch(url, options)
            .then((res) => res.json())
            .then((json) => {
              intentList = json;
            });
          //console.log(intentList);
          callback(intentList);
        }

        getToken(function (token) {
          getIntentList(token, function (intentList) {
            //console.log("Callback function");
            var intents = [];
            intentList.intents.forEach((element) => {
              var intentid = element.name;
              var id = intentid.substr(
                intentid.lastIndexOf("/") + 1,
                intentid.length
              );
              var intentname = element.displayName;

              intents.push({
                id: id,
                name: intentname,
              });
            });
            //console.log(intents);
            res.end(JSON.stringify(intents));
          });
        });
      });

      app.get("/listentities", function (req, res) {
        var projectid = req.query.projectid;
        var instance = req.query.instance;

        var privatekey = dialogflow[instance].privatekey;
        var clientemail = dialogflow[instance].clientemail;

        async function getToken(callback) {
          //console.log("Inside getToken function");
          await googleAuth.authenticate(
            {
              email: clientemail,
              key: privatekey,
              scopes: [
                "https://www.googleapis.com/auth/cloud-platform",
                "https://www.googleapis.com/auth/dialogflow",
              ],
            },
            function (err, token) {
              callback(token);
            }
          );
        }

        async function getEntityList(token, callback) {
          var entityList;
          //console.log("Inside getEntityList function");
          var url =
            "https://dialogflow.googleapis.com/v2/projects/" +
            projectid +
            "/agent/entityTypes?intentView=INTENT_VIEW_FULL";
          var options = {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          };

          await fetch(url, options)
            .then((res) => res.json())
            .then((json) => {
              entityList = json;
            });
          callback(entityList);
        }

        getToken(function (token) {
          getEntityList(token, function (entityList) {
            //console.log("-------------------------------------");
            //console.log("Callback function");
            entityList.entityTypes.forEach((data) => {
              //console.log(data.entities);
              //console.log("-----------------");
            });
            var entities = [];
            entityList.entityTypes.forEach((element) => {
              var entityid = element.name;
              var id = entityid.substr(
                entityid.lastIndexOf("/") + 1,
                entityid.length
              );
              var entityname = element.displayName;
              var entityvalue = element.entities;
              var stringifyvalue = [];

              entityvalue.forEach((entity) => {
                stringifyvalue.push(JSON.stringify(entity));
              });

              entities.push({
                id: id,
                name: entityname,
                value: stringifyvalue,
              });
            });

            console.log(entities);
            res.end(JSON.stringify(entities));
          });
        });
      });

      //for deleting row of failed utterances
      app.get("/deleterecord", function (req, res) {
        var utterance = '"' + req.query.utterance + '"';
        var instance = req.query.instance;
        //   var privatekey = dialogflow.instance.privatekey;
        // var clientemail = dialogflow.instance.clientemail;

        console.log("inside the get call");
        /*   var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: config.development.database
    }); */

        con.query(
          "select entity_instance_id  from entity_messages_logs eml ,entity_instance ei , instance i, entity e where eml.entity_instance_id = ei.id and ei.instance_id =i.id and ei.entity_id = e.id  and e.entity_type = 'aiengine'and eml.message like 'Response from DialogflowAi%' and i.instance_name=" +
            instance +
            "group by  i.instance_name;",
          function (err, result, fields) {
            if (err) throw err;

            var entityinstance = result[0].entity_instance_id;
            console.log(entityinstance);
            console.log("utterance:" + utterance);
            var query =
              "delete from entity_messages_logs where message like " +
              "'" +
              "%" +
              '"queryText":' +
              utterance +
              "%" +
              "'" +
              " and entity_instance_id=" +
              entityinstance;
            console.log("query:::::" + query);
            con.query(query, function (err, result, fields) {
              if (err) res.end("Failed to delete the record!");
              console.log(result);
              res.end("success");
            });

            /* con.query("delete from entity_messages_logs where message like '%"text":{"text":["+ utterance +"]%' and entity_instance_id="+ entity_instance_id +";", function (err, result, fields) {
                if(err) throw err;
                console.log('Deleted from database');
            }); */
          }
        );
      });
    });

    //port 4000 for server
    app.listen(4000, function () {
      console.log("Example app listening on port 4000.");
    });
  });
});
