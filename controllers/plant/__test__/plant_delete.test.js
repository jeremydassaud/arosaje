const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    plant: {
      findUnique: jest.fn(),
      delete: jest.fn(),
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

const { delete: deletePlant } = require('../delete.js');

describe('delete plant function', () => {
  let req, res;

  beforeEach(() => {
    req = {
      auth: {
        userId: 1,
        userRole: 1
      },
      params: { id: '1' }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    prisma.plant.findUnique.mockClear();
    prisma.plant.delete.mockClear();
    prisma.role.findUnique.mockClear();
    prisma.$disconnect.mockClear();
  });

  it('should delete the plant if user is admin', async () => {
    prisma.role.findUnique.mockResolvedValue(true);
    prisma.plant.findUnique.mockResolvedValue({
      id: 1,
      user: { id: 1 }
    });

    await deletePlant(req, res);

    expect(prisma.role.findUnique).toHaveBeenCalledWith({
      where: {
        id: req.auth.userRole,
        content: 'admin'
      }
    });
    expect(prisma.plant.findUnique).toHaveBeenCalledWith({
      where: { id: parseInt(req.params.id) },
      include: {
        user: true
      }
    });
    expect(prisma.plant.delete).toHaveBeenCalledWith({
      where: { id: parseInt(req.params.id) }
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Plant deleted' });
  });

  it('should delete the plant if userId matches the owner of the plant', async () => {
    req.auth.userId = 1;
    req.params.id = '1';

    prisma.role.findUnique.mockResolvedValue(false);
    prisma.plant.findUnique.mockResolvedValue({
      id: 1,
      user: { id: 1 }
    });

    await deletePlant(req, res);

    expect(prisma.plant.findUnique).toHaveBeenCalledWith({
      where: { id: parseInt(req.params.id) },
      include: {
        user: true
      }
    });
    expect(prisma.plant.delete).toHaveBeenCalledWith({
      where: { id: parseInt(req.params.id) }
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Plant deleted' });
  });

  it('should return 401 if not authorized', async () => {
    req.auth.userId = 2;
    req.params.id = '1';

    prisma.role.findUnique.mockResolvedValue(false);
    prisma.plant.findUnique.mockResolvedValue({
      id: 1,
      user: { id: 1 }
    });

    await deletePlant(req, res);

    expect(prisma.plant.delete).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });

  it('should return 500 on error', async () => {
    prisma.role.findUnique.mockRejectedValue(new Error('DB error'));

    await deletePlant(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error deleting plant',
      details: 'DB error'
    });
  });

  it('should disconnect from prisma', async () => {
    prisma.role.findUnique.mockResolvedValue(true);
    prisma.plant.findUnique.mockResolvedValue({
      id: 1,
      user: { id: 1 }
    });

    await deletePlant(req, res);

    expect(prisma.$disconnect).toHaveBeenCalled();
  });
});
