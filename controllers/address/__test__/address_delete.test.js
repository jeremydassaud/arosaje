const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    address: {
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

const { delete: deleteAddress } = require('../delete.js');

describe('delete address function', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: '1' },
      auth: {
        userId: 1,
        userRole: 1
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    prisma.address.findUnique.mockClear();
    prisma.address.delete.mockClear();
    prisma.role.findUnique.mockClear();
    prisma.$disconnect.mockClear();
  });

  it('should delete the address if user is admin', async () => {
    prisma.role.findUnique.mockResolvedValue(true);
    prisma.address.findUnique.mockResolvedValue({ id: 1, userId: 1 });
    const mockDeletedAddress = { id: 1, number: '123', street: 'Main St', postalCode: '12345', city: 'Anytown', country: 'USA' };
    prisma.address.delete.mockResolvedValue(mockDeletedAddress);

    await deleteAddress(req, res);

    expect(prisma.role.findUnique).toHaveBeenCalledWith({
      where: {
        id: req.auth.userRole,
        content: 'admin'
      }
    });
    expect(prisma.address.findUnique).toHaveBeenCalledWith({
      where: { id: Number(req.params.id) }
    });
    expect(prisma.address.delete).toHaveBeenCalledWith({
      where: { id: Number(req.params.id) }
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'address deleted', data: mockDeletedAddress });
  });

  it('should delete the address if userId matches', async () => {
    req.auth.userId = 1;
    req.params.id = '1';

    prisma.role.findUnique.mockResolvedValue(false);
    prisma.address.findUnique.mockResolvedValue({ id: 1, userId: 1 });
    const mockDeletedAddress = { id: 1, number: '123', street: 'Main St', postalCode: '12345', city: 'Anytown', country: 'USA' };
    prisma.address.delete.mockResolvedValue(mockDeletedAddress);

    await deleteAddress(req, res);

    expect(prisma.address.findUnique).toHaveBeenCalledWith({
      where: { id: Number(req.params.id) }
    });
    expect(prisma.address.delete).toHaveBeenCalledWith({
      where: { id: Number(req.params.id) }
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'address deleted', data: mockDeletedAddress });
  });

  it('should return 403 if not authorized', async () => {
    req.auth.userId = 2;
    req.params.id = '1';

    prisma.role.findUnique.mockResolvedValue(false);
    prisma.address.findUnique.mockResolvedValue({ id: 1, userId: 1 });

    await deleteAddress(req, res);

    expect(prisma.address.delete).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });

  it('should return 500 on error', async () => {
    prisma.role.findUnique.mockRejectedValue(new Error('DB error'));

    await deleteAddress(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error on the delete of the address',
      details: 'Internal Server Error'
    });
  });

  it('should disconnect from prisma', async () => {
    prisma.role.findUnique.mockResolvedValue(true);
    prisma.address.findUnique.mockResolvedValue({ id: 1, userId: 1 });
    const mockDeletedAddress = { id: 1, number: '123', street: 'Main St', postalCode: '12345', city: 'Anytown', country: 'USA' };
    prisma.address.delete.mockResolvedValue(mockDeletedAddress);

    await deleteAddress(req, res);

    expect(prisma.$disconnect).toHaveBeenCalled();
  });
});
