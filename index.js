// importing
const express = require("express");
const app = express();
const axios = require("axios");

const API_KEY = "3534c04375dc49649473d58b7892e501";

app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});

app.get("/", function (req, res) {
  // entering through / then call back function
  res.send("Server listening");
});

//getting the text from clients text=djfsaljfdsalf
app.get("/guess", function (req, res) {
  const query = req.query.text;

  axios({
    method: "post",
    url:
    "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/languages",
    headers: {
      "Ocp-Apim-Subscription-Key": API_KEY,
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    data: {
      "documents": [
        {
          "id": "test",
          "text": query
        }
      ]
    }
  })
    .then(function (response) {
      //console.log(JSON.stringify(response.data));
      res.send(response.data.documents[0].detectedLanguages[0].name)
    })
    .catch(function (error) {
     // console.error(error);
      res.send('OOPS')
    });
});
