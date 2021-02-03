const path = require('path');
const morgan = require('morgan');
const rotatingFileStream = require('rotating-file-stream');

morgan.token('steps', req => {
  return req.session.step || 1;
});
morgan.token('query', req => {
  return JSON.stringify(req.query);
});
morgan.token('params', req => {
  return JSON.stringify(req.params);
});

module.exports = registerMorgan;

const requestPattern = '[:date[iso]] ":method :url HTTP/:http-version" :status :response-time[3] :remote-addr :remote-user "Step - :steps" ":referrer"';
const paramPattern = '[:date[iso]] ":method :url" "Step - :steps" "Query - :query" "Params - :params"';

function registerMorgan(app) {
  const requestLogStream = getRotatingFileStream('requests.log');
  app.use(morgan(requestPattern, { stream: requestLogStream }));

  const paramLogStream = getRotatingFileStream('parameters.log');
  app.use(morgan(paramPattern, { stream: paramLogStream }));
}

function getRotatingFileStream(fileName) {
  return rotatingFileStream.createStream(fileName, {
    interval: '1d',
    path: path.join(__dirname, '..', 'log')
  });
}
