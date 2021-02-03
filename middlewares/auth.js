const jwt = require('jsonwebtoken');

module.exports = auth;

function auth() {
  return (req, res, next) => {
    const authToken = req.headers['authorization'];

    if (!authToken) {
      return unauthorized(res);
    }

    jwt.verify(authToken, 'TENAKATA_APP_SECRET', error => {
      if (error) {
        return unauthorized(res);
      }
      return next();
    });
  };
}

function unauthorized(res) {
  return res.status(401).send('Not authorized to use this service.')
}
