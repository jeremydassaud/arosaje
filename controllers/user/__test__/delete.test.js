const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    user: {
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

const { delete: deleteUser } = require('../delete.js');

describe('delete user function', () => {
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

    prisma.user.delete.mockClear();
    prisma.role.findUnique.mockClear();
    prisma.$disconnect.mockClear();
  });

  it('should delete the user if admin', async () => {
    prisma.role.findUnique.mockResolvedValue(true);
    prisma.user.delete.mockResolvedValue({ id: 1, name: 'John Doe' });

    await deleteUser(req, res);

    expect(prisma.role.findUnique).toHaveBeenCalledWith({
      where: {
        id: req.auth.userRole,
        content: 'admin'
      }
    });
    expect(prisma.user.delete).toHaveBeenCalledWith({
      where: { id: Number(req.params.id) }
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'User deleted', data: { id: 1, name: 'John Doe' } });
  });

  it('should delete the user if userId matches', async () => {
    req.auth.userId = 1;
    req.params.id = '1';

    prisma.role.findUnique.mockResolvedValue(false);
    prisma.user.delete.mockResolvedValue({ id: 1, name: 'John Doe' });

    await deleteUser(req, res);

    expect(prisma.user.delete).toHaveBeenCalledWith({
      where: { id: Number(req.params.id) }
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'User deleted', data: { id: 1, name: 'John Doe' } });
  });

  it('should return 403 if not authorized', async () => {
    req.auth.userId = 2;
    req.params.id = '1';

    prisma.role.findUnique.mockResolvedValue(false);

    await deleteUser(req, res);

    expect(prisma.user.delete).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });

  it('should return 500 on error', async () => {
    prisma.role.findUnique.mockRejectedValue(new Error('DB error'));

    await deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error on the delete of the user',
      details: 'Internal Server Error'
    });
  });

  it('should disconnect from prisma', async () => {
    prisma.role.findUnique.mockResolvedValue(true);
    prisma.user.delete.mockResolvedValue({ id: 1, name: 'John Doe' });

    await deleteUser(req, res);

    expect(prisma.$disconnect).toHaveBeenCalled();
  });
});