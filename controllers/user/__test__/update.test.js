const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { update } = require('../update.js');

jest.mock('bcryptjs');
jest.mock('@prisma/client', () => {
    return {
        PrismaClient: jest.fn().mockImplementation(() => {
            return {
                role: {
                    findUnique: jest.fn()
                },
                user: {
                    update: jest.fn().mockResolvedValue({ message: "User updated" })
                },
                $disconnect: jest.fn()
            };
        })
    };
});

describe('Update Function Tests', () => {
    let mockRequest, mockResponse;
    beforeEach(() => {
        mockRequest = {
            params: { id: '1' },
            body: {
                email: 'test@example.com',
                userName: 'Username1',
                password: 'Password1!',
                imageSrc: 'image.jpg',
                plantOwned: [],
                plantGuarded: [],
                address: '123 Main St'
            },
            auth: {
                userId: 1,
                userRole: 1
            }
        };
        mockResponse = {
            status: jest.fn(() => mockResponse),
            json: jest.fn()
        };
        bcrypt.genSaltSync.mockReturnValue(10);
        bcrypt.hashSync.mockReturnValue('hashedpassword');
        const prisma = new PrismaClient();
        prisma.role.findUnique.mockResolvedValue({ content: "admin" });
    });

    it('should update a user as admin', async () => {
        await update(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: "User updated", data: { message: "User updated" } });
    });

    it('should fail to update when not authorized', async () => {
        mockRequest.auth.userId = 2;
        await update(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(403);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: "Unauthorized" });
    });

});