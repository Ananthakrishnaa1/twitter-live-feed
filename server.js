const express = require("express");
const app = express();

var ttt = require("dotenv").config();

app.set("port", process.env.PORT || 3001);

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

const app_conf = {
  consumer_key: "3UYua3JRZABRdv5ziMz7xVcqs",
  consumer_secret: "lY0rzcMLJRG82YS1ge460s9zjQjNU5QPOqBtR8AD3NwfqXUiSg",
  access_token: "1000619341644099586-V4qfwPGRQFy7j2GDFPcognAdUwCAms",
  access_token_secret: "aQASTHQ2uasHZWQZEvEAYrPqjJZuJ5ux35DPhEeotkB2X",
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
};

const Twit = require("twit");
const T = new Twit(app_conf);

app.get("/api/tweets", function (req, res) {
  const param = req.query.q;
  const max_id = req.query.max_id;

  if (!param && !max_id) {
    res.json({
      error: "Missing required parameter `q` and `max_id`",
    });
  } else if (!max_id) {
    searchTweets(param, res);
  } else {
    fetchMoreTweets(param, max_id, res);
  }
});

function searchTweets(param, res) {
  T.get("search/tweets", { q: "#" + param, count: 20 }, function (err, reply) {
    res.json(reply);
  });
}

function fetchMoreTweets(param, max_id, res) {
  T.get(
    "search/tweets",
    { q: param, max_id: max_id, include_entities: 1, count: 20 },
    function (err, reply) {
      res.json(reply);
    }
  );
}

app.get("/api/trends", function (req, res) {
  searchTrends(res);
});

function searchTrends(res) {
  T.get("trends/place", { id: 1 }, function (err, reply) {
    res.json(reply);
  });
}

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});
