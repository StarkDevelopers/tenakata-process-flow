const session = require('express-session');

const SECRET_KEY = process.env.SECRET_KEY;

module.exports = initializeSession;

function initializeSession (app) {
  const sessionStore = getStore();

  app.use(session({
    name: 'tenakata.session',
    secret: SECRET_KEY,
    store: sessionStore,
    cookie: {
      /**
       * Session will be expired after maxAge specified.
       * If rolling is true then maxAge will be counted since session was idle.
       * It will remove the session from store(redisStore) after maxAge.
       */
      maxAge: 31557600000 // milliseconds => 1 Year
    },
    rolling: true, // to increase the expiration time of the session cookie for non-idle session
    resave: false,
    saveUninitialized: false
  }));
}

function getStore() {
  const redisConnect = require('connect-redis')(session);
  const redisClient = require('../services/redis');
  return new redisConnect({
    client: redisClient,
    logErrors: true
  });
}
