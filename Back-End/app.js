const express = require("express");
const bodyParser = require("body-parser");
const app = express();
process.env.TZ = 'Asia/Dhaka';

const cookieParser = require('cookie-parser');
require("dotenv").config();

const cors = require("cors");
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis').RedisStore;;
const redis = require('./redis');
const winston = require('winston');
const publicRouter = require("./Routes/PublicRoutes");

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

 
 

const jsonParser = bodyParser.json({ limit: '50mb' });
const urlencodedParser = bodyParser.urlencoded({ extended: false, limit: '50mb' });

app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Allowed-Source']
}));
app.use(jsonParser);
app.use(urlencodedParser);

 
 

app.use(rateLimit({
  store: new RedisStore({
 
    sendCommand: (...args) => redis.call(...args),
    prefix: 'rl:'  
  }),
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,  
  legacyHeaders: false,  
  message: { success: false, message: 'Too many requests, please try again later.' }
}));

 
app.get("/", (req, res) => {
  res.send("hi");
});

 
app.use("/api", publicRouter);
 

 
app.use((err, req, res, next) => {
  logger.error('Global error', { error: err.stack });
  res.status(500).json({ success: false, message: 'Server error' });
});

const PORT = process.env.PORT || 8000;

module.exports = { app, PORT };