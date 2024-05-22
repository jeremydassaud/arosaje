const request = require('supertest');
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { getOne } = require('../getOne.js'); // Assure-toi que le chemin est correct
const app = express();

app.use(express.json());
app.get('/user/:id', getOne);

jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    user: {
      findUnique: jest.fn(),
    },
    $disconnect: jest.fn(),
  };
  return { PrismaClient: jest.fn(() => mockPrismaClient) };
});

describe('GET /user/:id', () => {
  let prisma;

  beforeEach(() => {
    prisma = new PrismaClient();
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await prisma.$disconnect();
  });

  it('should return 404 if user is not found', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    const response = await request(app).get('/user/1');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('User not found');
  });

  it('should return 200 and user data if user is found', async () => {
    const mockUser = {
      id: 1,
      userName: 'TestUser',
      email: 'test@example.com',
      address: '123 Test St',
      plantsOwned: [],
      plantsGuarded: [],
    };
    prisma.user.findUnique.mockResolvedValue(mockUser);

    const response = await request(app).get('/user/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUser);
  });

  it('should return 404 if there is an error', async () => {
    prisma.user.findUnique.mockRejectedValue(new Error('Database error'));

    const response = await request(app).get('/user/1');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('User not found');
  });
});
