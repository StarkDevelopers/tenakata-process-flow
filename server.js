require('dotenv').config();
const express = require('express');
const registerMorgan = require('./middlewares/morgan');
const initializeSession = require('./middlewares/session');
const registerBodyParser = require('./middlewares/bodyParser');
const USSDService = require('./services/USSDService');
const buildStates = require('./buildStates');

const app = express();

registerBodyParser(app);
initializeSession(app);
registerMorgan(app);

buildStates();

app.post('*', async (req, res) => {
  const response = await USSDService.run(req);
  return res.send(response || 'You reached the end!!!');
});

app.all('*', (req, res) => {
  return res.send('Only POST Method is implemented for this service.');
});

let port= process.env.PORT || '8080';

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
