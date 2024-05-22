const request = require('supertest');
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { getAll } = require('../getPlantsForGuardian');
const app = express();

app.use(express.json());
app.get('/plants/:userId/:addressId', getAll);

jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    plant: {
      findMany: jest.fn(),
    },
    $disconnect: jest.fn(),
  };
  return { PrismaClient: jest.fn(() => mockPrismaClient) };
});

describe('GET /plants/:userId/:addressId', () => {
  let prisma;

  beforeEach(() => {
    prisma = new PrismaClient();
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await prisma.$disconnect();
  });

  it('should return 200 and plants data if plants are found', async () => {
    const mockPlants = [
      {
        id: 1,
        name: 'Plant 1',
        owner: { id: 1, name: 'Owner 1' },
        comment: [{ id: 1, content: 'Comment 1' }],
      },
      {
        id: 2,
        name: 'Plant 2',
        owner: { id: 1, name: 'Owner 1' },
        comment: [{ id: 2, content: 'Comment 2' }],
      },
    ];
    prisma.plant.findMany.mockResolvedValue(mockPlants);

    const response = await request(app).get('/plants/1/1');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Plantes proposées à garder récupérées');
    expect(response.body.data).toEqual(mockPlants);
  });

  it('should return 200 and empty array if no plants are found', async () => {
    prisma.plant.findMany.mockResolvedValue([]);

    const response = await request(app).get('/plants/1/1');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Plantes proposées à garder récupérées');
    expect(response.body.data).toEqual([]);
  });

  it('should return 500 if there is an error', async () => {
    const mockError = new Error('Database error');
    prisma.plant.findMany.mockRejectedValue(mockError);

    const response = await request(app).get('/plants/1/1');

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Erreur lors de la récupération des plantes proposées à garder');
    expect(response.body.details).toBe(mockError.message);
  });
});
