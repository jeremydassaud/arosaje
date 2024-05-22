const request = require('supertest');
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { login } = require('../login.js');
const app = express();

app.use(express.json());
app.post('/login', login);

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('POST /login', () => {
  let prisma;

  beforeAll(() => {
    prisma = new PrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });


  it('should return 401 if password is incorrect', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: 'hashedpassword',
      userRole: [{ roleId: 1 }],
    };
    prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);
    bcrypt.compareSync.mockReturnValue(false);

    const response = await request(app).post('/login').send({
      email: 'test@example.com',
      password: 'Invalid1!',
    });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('not allowed');
  });

  it('should return 200 and token if login is successful', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: 'hashedpassword',
      userRole: [{ roleId: 1 }],
    };
    prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);
    bcrypt.compareSync.mockReturnValue(true);
    const mockToken = 'mockToken';
    jwt.sign.mockReturnValue(mockToken);

    const response = await request(app).post('/login').send({
      email: 'test@example.com',
      password: 'Valid1!',
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBe(mockToken);
  });

});
