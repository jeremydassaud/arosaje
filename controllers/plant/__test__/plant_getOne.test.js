const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    plant: {
      findUnique: jest.fn(),
    },
    $disconnect: jest.fn(),
  };
  return {
    PrismaClient: jest.fn(() => mockPrisma),
  };
});

const { getOne } = require('../getOne.js');

describe('getOne plant function', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { plantId: '1' }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    prisma.plant.findUnique.mockClear();
    prisma.$disconnect.mockClear();
  });

  it('should return the plant if found', async () => {
    const mockPlant = {
      id: 1,
      common_name: 'Rose',
      scientific_name: 'Rosa',
      image_url: 'http://example.com/rose.jpg',
      ownerId: 1,
      guardianId: null,
      addressId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      comment: [
        {
          id: 1,
          content: 'Beautiful plant!',
          userId: 2,
          user: { id: 2, userName: 'Jane Doe' }
        }
      ],
      owner: { id: 1, userName: 'John Doe' }
    };
    prisma.plant.findUnique.mockResolvedValue(mockPlant);

    await getOne(req, res);

    expect(prisma.plant.findUnique).toHaveBeenCalledWith({
      where: { id: parseInt(req.params.plantId) },
      include: {
        comment: {
          include: {
            User: true
          }
        },
        owner: true
      }
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Plants retrieved', data: mockPlant });
  });

  it('should return 500 on error', async () => {
    prisma.plant.findUnique.mockRejectedValue(new Error('DB error'));

    await getOne(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error retrieving plants',
      details: 'DB error'
    });
  });

  it('should disconnect from prisma', async () => {
    const mockPlant = {
      id: 1,
      common_name: 'Rose',
      scientific_name: 'Rosa',
      image_url: 'http://example.com/rose.jpg',
      ownerId: 1,
      guardianId: null,
      addressId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      comment: [
        {
          id: 1,
          content: 'Beautiful plant!',
          userId: 2,
          user: { id: 2, userName: 'Jane Doe' }
        }
      ],
      owner: { id: 1, userName: 'John Doe' }
    };
    prisma.plant.findUnique.mockResolvedValue(mockPlant);

    await getOne(req, res);

    expect(prisma.$disconnect).toHaveBeenCalled();
  });
});
