const { JsonWebTokenError } = require('jsonwebtoken');
const UserService = require('../user/userService');

async function requireAuth(req, res, next) {
  const authToken = req.get('Authorization') || '';

  let bearerToken;
  if (!authToken.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'Missing bearer token' });
  } else {
    bearerToken = authToken.slice(7, authToken.length);
  }

  try {
    const payload = UserService.verifyJwt(bearerToken);

    const user = await UserService.getUserWithUserName(
      req.app.get('db'),
      payload.sub
    );

    if (!user) return res.status(401).json({ error: 'Unauthorized request' });

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError)
      return res.status(401).json({ error: 'Unauthorized request' });

    next(error);
  }
}

module.exports = {
  requireAuth
};
