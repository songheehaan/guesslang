var MongoClient = require("mongodb").MongoClient;
var assert = require("assert");
var ObjectId = require("mongodb").ObjectID;
var url = "mongodb://localhost:27017/test";

console.log("ignore me senpai");

// search the text in db to check the match

var findDocument = function(db, callback) {
  var cursor = db.collection("guesslang").find({ text: "bonjour" });
  cursor.each(function(err, doc) {
    assert.equal(err, null); // assert
    if (doc != null) {
      var language = doc.language;
      console.dir(language);
      // show the user the language
    } else {
      // send the text to API

      // save the language when it comes
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
