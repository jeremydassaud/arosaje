const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    plant: {
      create: jest.fn(),
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

const { create } = require('../create.js');

describe('create plant function', () => {
  let req, res;

  beforeEach(() => {
    req = {
      auth: {
        userId: 1,
        userRole: 1
      },
      params: { id: '1' },
      body: {
        common_name: 'Rose',
        scientific_name: 'Rosa',
        image_url: 'http://example.com/rose.jpg',
        addressId: 1
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    prisma.plant.create.mockClear();
    prisma.role.findUnique.mockClear();
    prisma.$disconnect.mockClear();
  });

  it('should create a plant if user is admin', async () => {
    prisma.role.findUnique.mockResolvedValue(true);
    const mockPlant = {
      id: 1,
      common_name: 'Rose',
      scientific_name: 'Rosa',
      image_url: 'http://example.com/rose.jpg',
      owner: { id: 1, userName: 'John Doe' },
      address: { id: 1, location: 'Garden' },
      guardian: null,
      comment: []
    };
    prisma.plant.create.mockResolvedValue(mockPlant);

    await create(req, res);

    expect(prisma.role.findUnique).toHaveBeenCalledWith({
      where: {
        id: req.auth.userRole,
        content: 'admin'
      }
    });
    expect(prisma.plant.create).toHaveBeenCalledWith({
      data: {
        common_name: req.body.common_name,
        scientific_name: req.body.scientific_name,
        image_url: req.body.image_url,
        owner: { connect: { id: req.auth.userId } },
        address: { connect: { id: req.body.addressId } }
      },
      include: {
        owner: true,
        guardian: true,
        address: true,
        comment: true
      }
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Plante created', data: mockPlant });
  });

  it('should create a plant if userId matches', async () => {
    req.auth.userId = 1;
    req.params.id = '1';

    prisma.role.findUnique.mockResolvedValue(false);
    const mockPlant = {
      id: 1,
      common_name: 'Rose',
      scientific_name: 'Rosa',
      image_url: 'http://example.com/rose.jpg',
      owner: { id: 1, userName: 'John Doe' },
      address: { id: 1, location: 'Garden' },
      guardian: null,
      comment: []
    };
    prisma.plant.create.mockResolvedValue(mockPlant);

    await create(req, res);

    expect(prisma.plant.create).toHaveBeenCalledWith({
      data: {
        common_name: req.body.common_name,
        scientific_name: req.body.scientific_name,
        image_url: req.body.image_url,
        owner: { connect: { id: req.auth.userId } },
        address: { connect: { id: req.body.addressId } }
      },
      include: {
        owner: true,
        guardian: true,
        address: true,
        comment: true
      }
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Plante created', data: mockPlant });
  });

  it('should return 401 if not authorized', async () => {
    req.auth.userId = 2;
    req.params.id = '1';

    prisma.role.findUnique.mockResolvedValue(false);

    await create(req, res);

    expect(prisma.plant.create).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorize' });
  });

  it('should return 500 on error', async () => {
    prisma.role.findUnique.mockRejectedValue(new Error('DB error'));

    await create(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error creating plant',
      details: 'DB error'
    });
  });

  it('should disconnect from prisma', async () => {
    prisma.role.findUnique.mockResolvedValue(true); 
    const mockPlant = {
      id: 1,
      common_name: 'Rose',
      scientific_name: 'Rosa',
      image_url: 'http://example.com/rose.jpg',
      owner: { id: 1, userName: 'John Doe' },
      address: { id: 1, location: 'Garden' },
      guardian: null,
      comment: []
    };
    prisma.plant.create.mockResolvedValue(mockPlant);

    await create(req, res);

    expect(prisma.$disconnect).toHaveBeenCalled();
  });
});
