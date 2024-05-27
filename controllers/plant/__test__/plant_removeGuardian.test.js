const request = require('supertest');
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// Mock auth middleware
app.use((req, res, next) => {
  req.auth = {
    userId: 1,
    userRole: 1 // Set user role for testing
  };
  next();
});

// Mock controller for testing
const { update } = require('../removeGuardian');
app.put('/plants/:plantId/update', update);

jest.mock('@prisma/client', () => {
  const mPrisma = {
    role: {
      findUnique: jest.fn()
    },
    plant: {
      findUnique: jest.fn(),
      update: jest.fn()
    },
    $disconnect: jest.fn()
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});

describe('Update Plant Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 404 if plant not found', async () => {
    prisma.plant.findUnique.mockResolvedValue(null);

    const res = await request(app).put('/plants/1/update');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Plant not found' });
  });

  it("should return 400 if plant doesn't have guardian", async () => {
    prisma.plant.findUnique.mockResolvedValue({
      id: 1,
      guardian: null,
    });

    const res = await request(app).put('/plants/1/update');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "plant doesn't have guardian" });
  });

  it('should return 200 and update plant if user is admin or guardian', async () => {
    prisma.role.findUnique.mockResolvedValue({ id: 1, content: 'admin' });
    prisma.plant.findUnique.mockResolvedValue({
      id: 1,
      guardian: { id: 1 },
    });
    prisma.plant.update.mockResolvedValue({
      id: 1,
      guardianId: null,
    });

    const res = await request(app).put('/plants/1/update');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Gardian deleted', data: { id: 1, guardianId: null } });
  });

  it('should return 500 if there is an error updating the plant', async () => {
    prisma.role.findUnique.mockResolvedValue({ id: 1, content: 'admin' });
    prisma.plant.findUnique.mockResolvedValue({
      id: 1,
      guardian: { id: 1 },
    });
    prisma.plant.update.mockRejectedValue(new Error('Update failed'));

    const res = await request(app).put('/plants/1/update');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      error: 'Error guardian could not been deleted',
      details: 'Update failed',
    });
  });
});
