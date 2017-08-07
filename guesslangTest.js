let db;

MongoClient.connect(url, function(err, database) {
  assert.equal(null, err);
  db = database;
});

var findRestaurants = function(db) {
  return Promise((resolve, reject) => {
    var cursor = db.collection("restaurants").find();
    cursor.each(function(err, doc) {
      if (err) {
        reject(err);
      }
      if (doc) {
        resolve(doc);
      }
    });
  });
};

findRestaurants(db).then(doc => {
  console.log(doc);
});

var findLanguage = function(query) {
  return db
    .collection("guesslang")
    .find({ text: query })
    .toArray()
    .then(array => {
      return array[0].language;
    });
};

findLanguage().then(lang => {});

var insertDocument = function(db, callback, query, language) {
  db.collection("guesslang").insertOne({
    text: query,
    language: language
  }, function(err, result) {
    assert.equal(err, null);
    console.log(query + " Inserted a document into the guesslang collection.");
    callback();
  });
};

var detectLanguage = function(req, res, query) {
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
      //console.log(JSON.stringify(response.data));
      return language;
    })
    .catch(function(error) {
      // console.error(error);
      res.send("OOPS");
    });
  callback();
};

app.get("/guess", function(req, res) {
  query = req.query.text;
  const lang = findLanguage(query);
  if (lang == null) {
    // couldn't find in the db
    lang = detectLanguage(query, req, res);
    insertDocument(query, language);
  }
  res.send(lang);
});
