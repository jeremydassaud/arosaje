const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    plant: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    role: {
      findUnique: jest.fn(),
    },
    $disconnect: jest.fn(),
  };
  return {
    PrismaClient: jest.fn(() => mockPrisma),
  };
});

const { update } = require('../addGuardian.js');

describe('update plant guardian function', () => {
  let req, res;

  beforeEach(() => {
    req = {
      auth: {
        userId: 1,
        userRole: 1
      },
      params: { plantId: '1' }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    prisma.plant.findUnique.mockClear();
    prisma.plant.update.mockClear();
    prisma.role.findUnique.mockClear();
    prisma.$disconnect.mockClear();
  });

  it('should add a guardian to the plant if plant exists and has no guardian', async () => {
    prisma.role.findUnique.mockResolvedValue(true);
    prisma.plant.findUnique.mockResolvedValue({
      id: 1,
      owner: { id: 1 },
      guardian: null,
      address: {},
      comment: []
    });
    const updatedPlant = {
      id: 1,
      owner: { id: 1 },
      guardian: { id: 1 },
      address: {},
      comment: []
    };
    prisma.plant.update.mockResolvedValue(updatedPlant);

    await update(req, res);

    expect(prisma.plant.findUnique).toHaveBeenCalledWith({
      where: { id: parseInt(req.params.plantId) },
      include: {
        owner: true,
        guardian: true,
        address: true,
        comment: true
      }
    });
    expect(prisma.plant.update).toHaveBeenCalledWith({
      where: { id: parseInt(req.params.plantId) },
      data: {
        guardianId: req.auth.userId
      },
      include: {
        owner: true,
        guardian: true,
        address: true,
        comment: true
      }
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Gardian added ', data: updatedPlant });
  });

  it('should return 404 if plant not found', async () => {
    prisma.role.findUnique.mockResolvedValue(true);
    prisma.plant.findUnique.mockResolvedValue(null);

    await update(req, res);

    expect(prisma.plant.findUnique).toHaveBeenCalledWith({
      where: { id: parseInt(req.params.plantId) },
      include: {
        owner: true,
        guardian: true,
        address: true,
        comment: true
      }
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Plant not found' });
  });

  it('should return 400 if plant already has a guardian', async () => {
    prisma.role.findUnique.mockResolvedValue(true);
    prisma.plant.findUnique.mockResolvedValue({
      id: 1,
      owner: { id: 1 },
      guardian: { id: 2 },
      address: {},
      comment: []
    });

    await update(req, res);

    expect(prisma.plant.findUnique).toHaveBeenCalledWith({
      where: { id: parseInt(req.params.plantId) },
      include: {
        owner: true,
        guardian: true,
        address: true,
        comment: true
      }
    });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Plant already have a guardian' });
  });

  it('should return 500 on error', async () => {
    prisma.role.findUnique.mockRejectedValue(new Error('DB error'));

    await update(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error adding guardian',
      details: 'DB error'
    });
  });

  it('should disconnect from prisma', async () => {
    prisma.role.findUnique.mockResolvedValue(true);
    prisma.plant.findUnique.mockResolvedValue({
      id: 1,
      owner: { id: 1 },
      guardian: null,
      address: {},
      comment: []
    });
    const updatedPlant = {
      id: 1,
      owner: { id: 1 },
      guardian: { id: 1 },
      address: {},
      comment: []
    };
    prisma.plant.update.mockResolvedValue(updatedPlant);

    await update(req, res);

    expect(prisma.$disconnect).toHaveBeenCalled();
  });
});
