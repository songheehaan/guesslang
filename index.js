// importing
const express = require("express");
const app = express();
const axios = require("axios");

const API_KEY = "asasdsadasdasdasd";
let AUTH_TOKEN = ""; // need to be changed

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});
requestToken();

app.get("/", function(req, res) {
  // entering through / then call back function
  res.send("Server listening");
  //getAccessToken(); // getting the token when the server starts
});


function requestToken() {
  // getting new token every 8 mins
  getAccessToken();
  setInterval(function() {
    console.log("timeout get a new token");
    getAccessToken();
  }, 3000);
}

//getting the text from clients text=djfsaljfdsalf
app.get("/guess", function(req, res) {
  const queryString = req.query.text;
  res.send(queryString);
});

function getAccessToken() {
  // send api key to authentication service
  console.log("getAccessToken function started");
  axios
    .post(
      // `https://api.cognitive.microsoft.com/sts/v1.0/issueToken?Subscription-Key=${API_KEY}`
      "https://api.cognitive.microsoft.com/sts/v1.0/issueToken?Subscription-Key=" +
        API_KEY
    )
    .then(function(response) {
      // store authtoken
      AUTH_TOKEN = response;
      console.log("received auth_token" + AUTH_TOKEN);
    })
    .catch(function(error) {
      console.log(error);
    });
}
