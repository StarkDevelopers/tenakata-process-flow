const redis = require('redis');

const REDIS_SERVER = process.env.REDIS_SERVER;
const REDIS_SERVER_PORT = process.env.REDIS_SERVER_PORT;
const REDIS_SERVER_AUTH_PASSWORD = process.env.REDIS_SERVER_AUTH_PASSWORD;

const auth = {};
if (REDIS_SERVER_AUTH_PASSWORD) {
  auth['auth_pass'] = REDIS_SERVER_AUTH_PASSWORD;
}

const redisClient = redis.createClient(REDIS_SERVER_PORT, REDIS_SERVER, auth);

redisClient.on('connect', function () {
    console.log(`REDIS Client Connected to ${REDIS_SERVER}:${REDIS_SERVER_PORT}`);
});

redisClient.on('ready', function () {
    console.log(`REDIS Client is ready to use...`);
});

redisClient.on('error', function (error) {
    console.log('ERROR from REDIS Client... ', error);
});

redisClient.on('warning', function (error) {
    console.log('WARNING from REDIS Client... ', error);
});

redisClient.on('reconnecting', function () {
    console.error('REDIS is trying to reconnect...');
});

redisClient.on('end', function () {
    console.error('Connection with REDIS Client has been closed...');
});

module.exports = redisClient;
