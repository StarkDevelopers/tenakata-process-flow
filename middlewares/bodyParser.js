const bodyParser = require('body-parser')

module.exports = registerBodyParser;

function registerBodyParser(app) {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
}
