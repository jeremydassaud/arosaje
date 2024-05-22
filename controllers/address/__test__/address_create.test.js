const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    address: {
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

describe('create address function', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { userId: '1' },
      auth: {
        userId: 1,
        userRole: 1
      },
      body: {
        number: '123',
        street: 'Main St',
        postalCode: '12345',
        city: 'Anytown',
        country: 'USA',
        lat: 45.764043,
        lng: 4.835659
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    prisma.address.create.mockClear();
    prisma.role.findUnique.mockClear();
    prisma.$disconnect.mockClear();
  });

  it('should create an address if user is admin', async () => {
    prisma.role.findUnique.mockResolvedValue(true);
    const mockAddress = {
      id: 1,
      number: '123',
      street: 'Main St',
      postalCode: '12345',
      city: 'Anytown',
      country: 'USA',
      lat: 45.764043,
      lng: 4.835659,
      userId: 1
    };
    prisma.address.create.mockResolvedValue(mockAddress);

    await create(req, res);

    expect(prisma.role.findUnique).toHaveBeenCalledWith({
      where: {
        id: req.auth.userRole,
        content: 'admin'
      }
    });
    expect(prisma.address.create).toHaveBeenCalledWith({
      data: {
        number: req.body.number,
        street: req.body.street,
        postalCode: req.body.postalCode,
        city: req.body.city,
        country: req.body.country,
        lat: parseFloat(req.body.lat),
        lng: parseFloat(req.body.lng),
        userId: parseInt(req.params.userId)
      }
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Address created', data: mockAddress });
  });

  it('should create an address if userId matches', async () => {
    req.auth.userId = 1;
    req.params.userId = '1';

    prisma.role.findUnique.mockResolvedValue(false);
    const mockAddress = {
      id: 1,
      number: '123',
      street: 'Main St',
      postalCode: '12345',
      city: 'Anytown',
      country: 'USA',
      lat: 45.764043,
      lng: 4.835659,
      userId: 1
    };
    prisma.address.create.mockResolvedValue(mockAddress);

    await create(req, res);

    expect(prisma.address.create).toHaveBeenCalledWith({
      data: {
        number: req.body.number,
        street: req.body.street,
        postalCode: req.body.postalCode,
        city: req.body.city,
        country: req.body.country,
        lat: parseFloat(req.body.lat),
        lng: parseFloat(req.body.lng),
        userId: parseInt(req.params.userId)
      }
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Address created', data: mockAddress });
  });

  it('should return 403 if not authorized', async () => {
    req.auth.userId = 2;
    req.params.userId = '1';

    prisma.role.findUnique.mockResolvedValue(false);

    await create(req, res);

    expect(prisma.address.create).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });

  it('should return 500 on error', async () => {
    prisma.role.findUnique.mockRejectedValue(new Error('DB error'));

    await create(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error unable to create the address',
      details: 'Internal Server Error'
    });
  });

  it('should disconnect from prisma', async () => {
    prisma.role.findUnique.mockResolvedValue(true);
    const mockAddress = {
      id: 1,
      number: '123',
      street: 'Main St',
      postalCode: '12345',
      city: 'Anytown',
      country: 'USA',
      lat: 45.764043,
      lng: 4.835659,
      userId: 1
    };
    prisma.address.create.mockResolvedValue(mockAddress);

    await create(req, res);

    expect(prisma.$disconnect).toHaveBeenCalled();
  });
});
