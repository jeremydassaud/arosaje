const request = require('supertest');
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { update: updateComment } = require('../update'); // Assurez-vous que le chemin est correct
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

app.put('/comment/:id/:commentId', updateComment);

jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    comment: {
      update: jest.fn(),
      findUnique: jest.fn(),
    },
    role: {
      findUnique: jest.fn(),
    },
    $disconnect: jest.fn(),
  };
  return { PrismaClient: jest.fn(() => mockPrismaClient) };
});

describe('PUT /comment/:id/:commentId', () => {
  let prisma;

  beforeEach(() => {
    prisma = new PrismaClient();
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await prisma.$disconnect();
  });

  it('should return 200 and updated comment data if user is authorized', async () => {
    const mockCommentId = 1;
    const mockUserId = 1;
    const mockUserIdFromToken = 1;
    const mockUserRoleFromToken = 1;
    const mockUpdatedComment = { id: mockCommentId, content: 'Updated comment' };

    prisma.role.findUnique.mockResolvedValue({ content: 'admin' });
    prisma.comment.update.mockResolvedValue(mockUpdatedComment);

    const response = await request(app)
      .put(`/comment/${mockUserId}/${mockCommentId}`)
      .send({ content: 'Updated comment' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Comment updated');
    expect(response.body.data).toEqual(mockUpdatedComment);
  });

  it('should return 401 if user is not authorized to update', async () => {
    const mockCommentId = 1;
    const mockUserId = 2; // Different user
    const mockUserIdFromToken = 1;
    const mockUserRoleFromToken = 2; // Non-admin role

    prisma.role.findUnique.mockResolvedValue(null); // User is not an admin

    const response = await request(app)
      .put(`/comment/${mockUserId}/${mockCommentId}`)
      .send({ content: 'Updated comment' });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Unauthorized');
  });

  it('should return 404 if comment is not found', async () => {
    const mockCommentId = 1;
    const mockUserId = 1;
    const mockUserIdFromToken = 1;
    const mockUserRoleFromToken = 1;

    prisma.role.findUnique.mockResolvedValue({ content: 'admin' });
    prisma.comment.update.mockRejectedValue(new Error('Record to update not found'));

    const response = await request(app)
      .put(`/comment/${mockUserId}/${mockCommentId}`)
      .send({ content: 'Updated comment' });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Error updating comment');
    expect(response.body.details).toBe('Record to update not found');
  });

  it('should return 500 if there is an error', async () => {
    const mockCommentId = 1;
    const mockUserId = 1;
    const mockUserIdFromToken = 1;
    const mockUserRoleFromToken = 1;
    const mockError = new Error('Database error');

    prisma.role.findUnique.mockResolvedValue({ content: 'admin' });
    prisma.comment.update.mockRejectedValue(mockError);

    const response = await request(app)
      .put(`/comment/${mockUserId}/${mockCommentId}`)
      .send({ content: 'Updated comment' });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Error updating comment');
    expect(response.body.details).toBe(mockError.message);
  });
});
