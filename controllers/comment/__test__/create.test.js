const request = require('supertest');
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { create } = require('../create.js'); // Assurez-vous que le chemin est correct
const app = express();

app.use(express.json());
app.post('/user/:id/plant/:plantId/comment', create);

jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    comment: {
      create: jest.fn(),
    },
    $disconnect: jest.fn(),
  };
  return { PrismaClient: jest.fn(() => mockPrismaClient) };
});

describe('POST /user/:id/plant/:plantId/comment', () => {
  let prisma;

  beforeEach(() => {
    prisma = new PrismaClient();
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await prisma.$disconnect();
  });

  it('should return 201 and created comment data', async () => {
    const mockUserId = 1;
    const mockPlantId = 1;
    const mockRequestBody = {
      content: 'Test comment',
      byteImage: 'base64-encoded-image',
    };
    const mockCreatedComment = {
      id: 1,
      content: mockRequestBody.content,
      byteImage: mockRequestBody.byteImage,
      User: { id: mockUserId },
      Plant: { id: mockPlantId },
    };
    prisma.comment.create.mockResolvedValue(mockCreatedComment);

    const response = await request(app)
      .post(`/user/${mockUserId}/plant/${mockPlantId}/comment`)
      .send(mockRequestBody);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Comment created');
    expect(response.body.data).toEqual(mockCreatedComment);
  });

  it('should return 500 if there is an error', async () => {
    const mockUserId = 1;
    const mockPlantId = 1;
    const mockRequestBody = {
      content: 'Test comment',
      byteImage: 'base64-encoded-image',
    };
    const mockError = new Error('Database error');
    prisma.comment.create.mockRejectedValue(mockError);

    const response = await request(app)
      .post(`/user/${mockUserId}/plant/${mockPlantId}/comment`)
      .send(mockRequestBody);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Error creating comment');
    expect(response.body.details).toBe(mockError.message);
  });
});
