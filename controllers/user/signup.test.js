const { signup } = require('./signup');
const { PrismaClient } = require('@prisma/client');

jest.mock('@prisma/client');

describe('Signup Function', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        email: 'helloworld@test.com',
        password: 'Test@1234!',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 if user is successfully created', async () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    PrismaClient.prototype.user.create.mockResolvedValue(mockUser);

    await signup(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'User created' });
  });

  it('should return 412 if password length is less than 7 characters', async () => {
    req.body.password = 'Test@1'; // Password length less than 7 characters

    await signup(req, res);

    expect(res.status).toHaveBeenCalledWith(412);
    expect(res.json).toHaveBeenCalledWith({ error: 'password must be minimum with 8 char' });
  });

  // Add more test cases to cover other conditions such as missing uppercase, lowercase, etc.
});