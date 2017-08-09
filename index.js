// importing
const get = require("lodash.get");
const axios = require("axios");
const express = require("express");
const app = express();

//db
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const ObjectId = require("mongodb").ObjectID;

const DB_URL = "mongodb://localhost:27017/test";
const API_KEY = "3534c04375dc49649473d58b7892e501";

let db;

MongoClient.connect(DB_URL, function(err, database) {
  db = database;
});

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});

app.get("/", function(req, res) {
  res.send("Server listening");
});

const findLanguage = async function(query) {
  const dbResults = await db
    .collection("guesslang")
    .find({ text: query })
    .toArray();

  if (dbResults.length) {
    return dbResults[0].language;
  }

  return null;
};

const insertDocument = function(query, lang) {
  db.collection("guesslang").insertOne({
    text: query,
    language: lang
  }, function(err, result) {
    assert.equal(err, null);
    console.log(query + " Inserted a document into the guesslang collection.");
  });
};

const detectLanguage = function(req, res, query) {
  let language = "";
  console.log("what come in the detectlang ", query);
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
      documents: [
        {
          id: "test",
          text: query
        }
      ]
    }
  }).then(function(response) {
    language = response.data.documents[0].detectedLanguages[0].name;
    console.log("detected language ", language);
    return language;
  });
};

app.get("/guess", async function(req, res) {
  query = req.query.text;
  let lang = await findLanguage(query);
  if (!lang) {
    lang = await detectLanguage(req, res, query);
    insertDocument(query, lang);
    res.send(lang);
  } else {
    res.send(lang);
  }
});
