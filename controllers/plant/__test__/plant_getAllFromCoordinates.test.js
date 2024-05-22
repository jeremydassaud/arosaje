const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    plant: {
      findMany: jest.fn(),
    },
    $disconnect: jest.fn(),
  };
  return {
    PrismaClient: jest.fn(() => mockPrisma),
  };
});

const { getAll } = require('../getAllFromCoordinates.js');

describe('getAll plants from coordinates function', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { lat: '45.764043', lng: '4.835659' }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    prisma.plant.findMany.mockClear();
    prisma.$disconnect.mockClear();
  });

  it('should return plants if found within coordinates', async () => {
    const mockPlants = [
      {
        id: 1,
        common_name: 'Rose',
        scientific_name: 'Rosa',
        image_url: 'http://example.com/rose.jpg',
        ownerId: 1,
        guardianId: null,
        addressId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        address: { lat: 45.764043, lng: 4.835659 },
        owner: { id: 1, userName: 'John Doe' }
      }
    ];
    prisma.plant.findMany.mockResolvedValue(mockPlants);

    await getAll(req, res);

    const expectedMinLat = 45.764043 - 0.0009;
    const expectedMaxLat = 45.764043 + 0.0009;
    const expectedMinLng = 4.835659 - 0.0009;
    const expectedMaxLng = 4.835659 + 0.0009;

    const actualArgs = prisma.plant.findMany.mock.calls[0][0];

    expect(actualArgs.where.address.AND[0].lat.gte).toBeCloseTo(expectedMinLat);
    expect(actualArgs.where.address.AND[1].lat.lte).toBeCloseTo(expectedMaxLat);
    expect(actualArgs.where.address.AND[2].lng.gte).toBeCloseTo(expectedMinLng);
    expect(actualArgs.where.address.AND[3].lng.lte).toBeCloseTo(expectedMaxLng);
    expect(actualArgs.include).toEqual({
      address: true,
      owner: true
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Plants retrieved',
      data: [
        {
          userId: 1,
          addressId: 1,
          address: { lat: 45.764043, lng: 4.835659 },
          owner: { id: 1, userName: 'John Doe' },
          plants: [
            {
              id: 1,
              common_name: 'Rose',
              scientific_name: 'Rosa',
              image_url: 'http://example.com/rose.jpg',
              ownerId: 1,
              guardianId: null,
              addressId: 1,
              createdAt: mockPlants[0].createdAt,
              updatedAt: mockPlants[0].updatedAt,
            }
          ],
        }
      ],
    });
  });

  it('should return 500 on error', async () => {
    prisma.plant.findMany.mockRejectedValue(new Error('DB error'));

    await getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error retrieving plants',
      details: 'DB error'
    });
  });

  it('should disconnect from prisma', async () => {
    const mockPlants = [
      {
        id: 1,
        common_name: 'Rose',
        scientific_name: 'Rosa',
        image_url: 'http://example.com/rose.jpg',
        ownerId: 1,
        guardianId: null,
        addressId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        address: { lat: 45.764043, lng: 4.835659 },
        owner: { id: 1, userName: 'John Doe' }
      }
    ];
    prisma.plant.findMany.mockResolvedValue(mockPlants);

    await getAll(req, res);

    expect(prisma.$disconnect).toHaveBeenCalled();
  });
});
