const redis = require('../helpers/redis');

module.exports = initializeSession;

function initializeSession (app) {
  app.post('*', async (req, res, next) => {
    const {
      sessionId,
      phoneNumber,
      serviceCode,
      networkCode,
      text
    } = req.body;

    if (sessionId) {
      let session = await redis.getJSON(sessionId);
      if (session) {
        // Session Exists
        session.step += 1;
        session.text = text;
      } else {
        // Session Does Not Exist, Create One
        session = {
          phoneNumber,
          serviceCode,
          networkCode,
          text,
          step: 1,
          previousState: null
        };
      }

      await redis.setJSON(sessionId, session);
      req.session = session;
    } else {
      req.session = {
        step: 1
      };
    }
    next();
  });
}
