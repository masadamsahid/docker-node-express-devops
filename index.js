const express = require('express');


const app = express();

const mongoose = require('mongoose');
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT } = require('./config/config');

const postRouter = require('./routes/postRoutes');

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

app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h2>Hi There</h2>")
});

app.use("/api/v1/posts", postRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

