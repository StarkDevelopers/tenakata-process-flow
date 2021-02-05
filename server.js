require('dotenv').config();
const express = require('express');
const registerMorgan = require('./middlewares/morgan');
const initializeSession = require('./middlewares/session');
const registerBodyParser = require('./middlewares/bodyParser');
const responses = require('./response.json');

const app = express();

registerBodyParser(app);
initializeSession(app);
registerMorgan(app);

app.post('*', (req, res) => {
  const step = req.session.step;
  const response = responses[`STEP ${step}`];
  return res.send(response || 'You reached the end!!!');
});

app.all('*', (req, res) => {
  return res.send('Only POST Method is implemented for this service.');
});

app.listen(process.env.PORT, () => {
  console.log(`listening on ${process.env.PORT}`);
});
