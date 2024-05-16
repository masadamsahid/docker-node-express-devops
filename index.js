const express = require('express');
const app = express();

const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require('./config/config');


const redis = require("redis");
const session = require("express-session");
let RedisStore = require("connect-redis").default;
let redisClient = redis.createClient({ url: `redis://${REDIS_URL}:${REDIS_PORT}` });
redisClient.connect().catch(console.error);

const mongoose = require('mongoose');

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

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 30000,
  },
}));
app.use(express.json());

app.get("/", (req, res) => res.send("<h2>Hi There</h2>"));

const postRouter = require('./routes/postRoutes');
const userRouter = require('./routes/userRoutes');
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

