const request = require('supertest');
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

const { signup } = require('../signup.js');
app.post('/signup', signup);

jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    role: {
      findUnique: jest.fn(),
    },
    user: {
      create: jest.fn(),
    },
    $disconnect: jest.fn().mockResolvedValue(),
  };
  return { PrismaClient: jest.fn(() => mockPrismaClient) };
});

describe('POST /signup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 412 if password is less than 8 characters', async () => {
    const response = await request(app).post('/signup').send({
      email: `test@example.com`,
      password: 'short',
    });
    expect(response.status).toBe(412);
    expect(response.body.error).toBe('password must be minimum with 8 char');
  });

  it('should return 412 if password does not contain an uppercase', async () => {
    const response = await request(app).post('/signup').send({
      email: `test@example.com`,
      password: 'lowercase1!',
    });
    expect(response.status).toBe(412);
    expect(response.body.error).toBe('password must contain an uppercase');
  });

  it('should return 412 if password does not contain a lowercase', async () => {
    const response = await request(app).post('/signup').send({
      email: `test@example.com`,
      password: 'UPPERCASE1!',
    });
    expect(response.status).toBe(412);
    expect(response.body.error).toBe('password must contain a lowercase');
  });

  it('should return 412 if password does not contain a special char', async () => {
    const response = await request(app).post('/signup').send({
      email: `test@example.com`,
      password: 'Password1',
    });
    expect(response.status).toBe(412);
    expect(response.body.error).toBe('password must contain a special char');
  });

  it('should return 412 if password does not contain a number', async () => {
    const response = await request(app).post('/signup').send({
      email: `test@example.com`,
      password: 'Password!',
    });
    expect(response.status).toBe(412);
    expect(response.body.error).toBe('password must contain a number');
  });

  it('should create a user and return 200 if all conditions are met', async () => {
    const mockRole = { id: 1, content: 'user' };
    prisma.role.findUnique.mockResolvedValue(mockRole);
    prisma.user.create.mockResolvedValue({
      id: 1,
      email: `test@example.com`,
      password: 'hashedpassword',
    });

    const response = await request(app).post('/signup').send({
      email: `test@example.com`,
      password: 'Valid1!',
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User created');
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: expect.stringMatching(/test@example.com/),
        password: expect.any(String),
        userRole: {
          create: {
            roleId: mockRole.id,
          },
        },
      },
    });
  });

});
