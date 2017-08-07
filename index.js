// importing
const get = require("lodash.get");
const express = require("express");
const app = express();

//db
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const ObjectId = require("mongodb").ObjectID;

const DB_URL = "mongodb://localhost:27017/test";
const API_KEY = "3534c04375dc49649473d58b7892e501";

let db = null;
MongoClient.connect(url, function(err, database) {
  db = database;
  findDocument(database, function() {
    database.close();
  });
});

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

  fetchDb(db, query).then(lang => {
    res.send(lang);
    return;
  });

  fetchService(query)
    .then(lang => {
      storeQuery(db, lang);
      return lang;
    })
    .then(lang => {
      res.send(lang);
    });

  const fetchDb = (db, query) => {
    return db
      .collection("guesslang")
      .find({ text: query })
      .toArray()
      .then(documents => {
        if (documents.length) {
          return documents[0].language;
        }
      });
  };

  const fetchService = query => {
    return axios({
      method: "post",
      url:
        "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/languages",
      headers: {
        "Ocp-Apim-Subscription-Key": API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      data: {
        documents: [{ id: "test", text: query }]
      }
    }).then(response => {
      return get(response, "data.documents[0].detectedLanguages[0].name");
    });
  };

  const storeQuery = (db, language) => {
    db.collection("guesslang").insertOne({
      text: query,
      language: language
    });
  };

  res.send("Did not undertand");
});
