const express = require('express');
const app = express();

const cors = require('cors');

const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require('./config/config');

console.log({ MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET });

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

app.enable('trust proxy');
app.use(cors({}));
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

app.get("/api/v1/", (req, res) => {
  res.send("<h2>Hi There!!! (It's updated Vesion 2)</h2>");
  console.log("Yeah it ran");
});

const postRouter = require('./routes/postRoutes');
const userRouter = require('./routes/userRoutes');
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

