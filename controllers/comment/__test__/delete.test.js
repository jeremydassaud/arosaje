const request = require('supertest');
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { delete: deleteComment } = require('../delete'); // Assurez-vous que le chemin est correct
const app = express();

app.use(express.json());

// Middleware simulant l'authentification et ajoutant req.auth
app.use((req, res, next) => {
  req.auth = {
    userId: 1,
    userRole: 1
  };
  next();
});

app.delete('/comment/:commentId', deleteComment);

jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    comment: {
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    role: {
      findUnique: jest.fn(),
    },
    $disconnect: jest.fn(),
  };
  return { PrismaClient: jest.fn(() => mockPrismaClient) };
});

describe('DELETE /comment/:commentId', () => {
  let prisma;

  beforeEach(() => {
    prisma = new PrismaClient();
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await prisma.$disconnect();
  });

  it('should return 200 and deleted comment data if user is authorized', async () => {
    const mockCommentId = 1;
    const mockUserIdFromToken = 1;
    const mockUserRoleFromToken = 1;
    const mockComment = { id: mockCommentId, userId: mockUserIdFromToken };
    const mockDeletedComment = { id: mockCommentId, content: 'Test comment' };

    prisma.comment.findUnique.mockResolvedValue(mockComment);
    prisma.role.findUnique.mockResolvedValue({ content: 'admin' });
    prisma.comment.delete.mockResolvedValue(mockDeletedComment);

    const response = await request(app)
      .delete(`/comment/${mockCommentId}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Comment deleted');
    expect(response.body.data).toEqual(mockDeletedComment);
  });

  it('should return 403 if user is not authorized to delete', async () => {
    const mockCommentId = 1;
    const mockUserIdFromToken = 1;
    const mockUserRoleFromToken = 2;
    const mockComment = { id: mockCommentId, userId: 2 };

    prisma.comment.findUnique.mockResolvedValue(mockComment);
    prisma.role.findUnique.mockResolvedValue(null); 

    const response = await request(app)
      .delete(`/comment/${mockCommentId}`);

    expect(response.status).toBe(403);
    expect(response.body.error).toBe('Unauthorized');
  });

  it('should return 404 if comment is not found', async () => {
    const mockCommentId = 1;
    const mockUserIdFromToken = 1;
    const mockUserRoleFromToken = 1;

    prisma.comment.findUnique.mockResolvedValue(null);

    const response = await request(app)
      .delete(`/comment/${mockCommentId}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Comment not found');
  });

  it('should return 500 if there is an error', async () => {
    const mockCommentId = 1;
    const mockUserIdFromToken = 1;
    const mockUserRoleFromToken = 1;
    const mockError = new Error('Database error');

    prisma.comment.findUnique.mockRejectedValue(mockError);

    const response = await request(app)
      .delete(`/comment/${mockCommentId}`);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Error deleting comment');
    expect(response.body.details).toBe(mockError.message);
  });
});
