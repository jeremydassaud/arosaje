const jwt = require('jsonwebtoken');
const authMiddleware = require('../auth.js');

jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {
        authorization: 'Bearer valid.token.here',
      },
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it('should set req.auth and call next if token is valid', () => {
    const decodedToken = { userId: 1, role: 'admin' };
    jwt.verify.mockReturnValue(decodedToken);

    authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('valid.token.here', process.env.jwtSignSecret);
    expect(req.auth).toEqual({ userId: 1, userRole: 'admin' });
    expect(next).toHaveBeenCalled();
  });

  it('should return 403 if token is invalid', () => {
    jwt.verify.mockImplementation(() => {
      throw new Error(0);
    });

    authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('valid.token.here', process.env.jwtSignSecret);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 0 });
  });

  it('should return 403 if no token is provided', () => {
    req.headers.authorization = '';

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 0 });
  });

  it('should return 403 if userId in body does not match userId in token', () => {
    const decodedToken = { userId: 1, role: 'admin' };
    jwt.verify.mockReturnValue(decodedToken);

    req.body.userId = 2;

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 0 });
  });

  it('should return 403 if requiredRole in body does not match userRole in token', () => {
    const decodedToken = { userId: 1, role: 'admin' };
    jwt.verify.mockReturnValue(decodedToken);

    req.body.requiredRole = 'user';

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 0 });
  });
});
