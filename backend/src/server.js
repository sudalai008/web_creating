const express = require("express");
const morgan = require("morgan");
const database = require("./database");

function createApp(db = database) {
  const app = express();

  app.use(express.json());
  app.use(morgan("common"));

  app.get("/", function(req, res, next) {
    db.raw("select VERSION() version")
      .then(([rows]) => rows[0])
      .then(row => res.json({ message: `Hello, my DB is ${row.version}` }))
      .catch(next);
  });

  app.get("/healthz", function(req, res) {
    res.send("I am happy and healthy\n");
  });

  app.get("/readyz", function(req, res, next) {
    db.raw("select 1")
      .then(() => res.json({ status: "ready" }))
      .catch(next);
  });

  app.use(function(error, req, res, next) {
    if (res.headersSent) {
      return next(error);
    }
    console.error("Request failed:", error.message);
    res.status(503).json({ error: "Backend dependency unavailable" });
  });

  return app;
}

module.exports = createApp;
