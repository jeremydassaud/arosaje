const request = require('supertest');
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { getAll } = require('../getAll.js'); 
const app = express();

app.use(express.json());
app.get('/users', getAll);

jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    user: {
      findMany: jest.fn(),
    },
    $disconnect: jest.fn(),
  };
  return { PrismaClient: jest.fn(() => mockPrismaClient) };
});

describe('GET /users', () => {
  let prisma;

  beforeEach(() => {
    prisma = new PrismaClient();
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await prisma.$disconnect();
  });

  it('should return 200 and user data if users are found', async () => {
    const mockUsers = [
      { id: 1, userName: 'User1', email: 'user1@example.com' },
      { id: 2, userName: 'User2', email: 'user2@example.com' },
    ];
    prisma.user.findMany.mockResolvedValue(mockUsers);

    const response = await request(app).get('/users');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUsers);
  });

  it('should return 404 if no users are found', async () => {
    prisma.user.findMany.mockResolvedValue([]);

    const response = await request(app).get('/users');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Users not found');
  });
});
