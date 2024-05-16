const express = require('express');

const app = express();

const mongoose = require('mongoose');
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT } = require('./config/config');

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
  mongoose.connect(mongoURL)
  .then(() => {
    console.log("Success connect to DB");
  }).catch((e) => {
    console.log(e);
    setTimeout(connectWithRetry, 5000);
  });
}

connectWithRetry();

app.get("/", (req, res) => {
  res.send("<h2>Hi There</h2>")
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

