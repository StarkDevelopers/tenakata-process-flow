require('dotenv').config();
const express = require('express');
const registerMorgan = require('./middlewares/morgan');
const initializeSession = require('./middlewares/session');
const auth = require('./middlewares/auth');
const responses = require('./response.json');

const app = express();

initializeSession(app);
registerMorgan(app);
app.use(auth());

app.get('/', (req, res) => {
  if (req.session.step) {
    req.session.step++;
  } else {
    req.session.step = 1;
  }
  const step = req.session.step;
  const response = responses[`STEP ${step}`];
  return res.send(response || 'You reached the end!!!');
});

app.listen(process.env.PORT, () => {
  console.log(`listening on ${process.env.PORT}`);
});
