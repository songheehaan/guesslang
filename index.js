// importing
const express = require("express");
const app = express();
const axios = require("axios");

//db
var MongoClient = require("mongodb").MongoClient;
var assert = require("assert");
var ObjectId = require("mongodb").ObjectID;
var url = "mongodb://localhost:27017/test";

const API_KEY = "3534c04375dc49649473d58b7892e501";

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});

app.get("/", function(req, res) {
  // entering through / then call back function
  res.send("Server listening");
});

//getting the text from clients text=djfsaljfdsalf
app.get("/guess", function(req, res) {
  const query = req.query.text;
  let language = "";

  var findDocument = function(db, callback) {
    var cursor = db.collection("guesslang").find({ text: query });
    cursor.each(function(err, doc) {
      assert.equal(err, null); // assert
      if (doc != null) {
        language = doc.language;
        console.dir(language + " was found on our DB");
        // show the user the language
        res.send(language);
      } else {
        // send the text to API
        axios({
          method: "post",
          url:
            "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/languages",
          headers: {
            "Ocp-Apim-Subscription-Key": API_KEY,
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          data: {
            documents: [
              {
                id: "test",
                text: query
              }
            ]
          }
        })
          .then(function(response) {
            language = response.data.documents[0].detectedLanguages[0].name;
            //save it in DB
            var insertDocument = function(db, callback) {
              db.collection("guesslang").insertOne({
                text: query,
                language: language
              }, function(err, result) {
                assert.equal(err, null);
                console.log(
                  query+" Inserted a document into the guesslang collection."
                );
                callback();
              });
            };
            MongoClient.connect(url, function(err, db) {
              assert.equal(null, err);
              insertDocument(db, function() {
                db.close();
              });
            });

            //console.log(JSON.stringify(response.data));
            res.send(language);
          })
          .catch(function(error) {
            // console.error(error);
            res.send("OOPS");
          });
        callback();
      }
    });
  };

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    findDocument(db, function() {
      db.close();
    });
  });
});
