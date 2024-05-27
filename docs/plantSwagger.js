/**
 * @swagger
 * /api/plant/users/{id}/plants:
 *   post:
 *     summary: Create a new plant
 *     tags: [Plants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - common_name
 *               - scientific_name
 *               - addressId
 *             properties:
 *               common_name:
 *                 type: string
 *                 description: Common name of the plant
 *                 example: Rose
 *               scientific_name:
 *                 type: string
 *                 description: Scientific name of the plant
 *                 example: Rosa
 *               image_url:
 *                 type: string
 *                 description: URL of the plant image
 *                 example: http://example.com/rose.jpg
 *               addressId:
 *                 type: integer
 *                 description: ID of the address where the plant is located
 *                 example: 1
 *     responses:
 *       201:
 *         description: Plant created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Plant created
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     common_name:
 *                       type: string
 *                       example: Rose
 *                     scientific_name:
 *                       type: string
 *                       example: Rosa
 *                     image_url:
 *                       type: string
 *                       example: http://example.com/rose.jpg
 *                     address:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 */
/**
 * @swagger
 * /api/plant/{id}:
 *   delete:
 *     summary: Delete a plant by ID
 *     tags: [Plants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The plant ID
 *     responses:
 *       200:
 *         description: Plant deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Plant deleted
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: Plant not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Plant not found
 */
/**
 * @swagger
 * /api/plant/by-coordinates/{lat}/{lng}:
 *   get:
 *     summary: Get plants by coordinates
 *     tags: [Plants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *           format: float
 *         description: Latitude
 *       - in: path
 *         name: lng
 *         required: true
 *         schema:
 *           type: number
 *           format: float
 *         description: Longitude
 *     responses:
 *       200:
 *         description: Plants found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   common_name:
 *                     type: string
 *                     example: Rose
 *                   scientific_name:
 *                     type: string
 *                     example: Rosa
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: Plants not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Plants not found
 */
/**
 * @swagger
 * /api/plant/{plantId}:
 *   get:
 *     summary: Get a plant by ID
 *     tags: [Plants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: plantId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The plant ID
 *     responses:
 *       200:
 *         description: Plant found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 common_name:
 *                   type: string
 *                   example: Rose
 *                 scientific_name:
 *                   type: string
 *                   example: Rosa
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: Plant not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Plant not found
 */
/**
 * @swagger
 * /api/plant/{userId}/{addressId}:
 *   get:
 *     summary: Get plants for a guardian by user ID and address ID
 *     tags: [Plants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The address ID
 *     responses:
 *       200:
 *         description: Plants found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   common_name:
 *                     type: string
 *                     example: Rose
 *                   scientific_name:
 *                     type: string
 *                     example: Rosa
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: Plants not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Plants not found
 */
/**
 * @swagger
 * /api/plant/{plantId}/addGuardian:
 *   put:
 *     summary: Add a guardian to a plant by plant ID
 *     tags: [Plants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: plantId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The plant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - guardianId
 *             properties:
 *               guardianId:
 *                 type: integer
 *                 description: ID of the guardian
 *                 example: 1
 *     responses:
 *       200:
 *         description: Guardian added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Guardian added
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: Plant or guardian not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Plant or guardian not found
 */
/**
 * @swagger
 * /api/plant/{plantId}/removeGuardian:
 *   put:
 *     summary: Remove a guardian from a plant by plant ID
 *     tags: [Plants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: plantId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The plant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - guardianId
 *             properties:
 *               guardianId:
 *                 type: integer
 *                 description: ID of the guardian
 *                 example: 1
 *     responses:
 *       200:
 *         description: Guardian removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Guardian removed
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: Plant or guardian not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Plant or guardian not found
 */
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userName:
 *                     type: string
 *                     example: johndoe
 *                   email:
 *                     type: string
 *                     example: johndoe@example.com
 *                   address:
 *                     type: string
 *                     example: "123 Main St, Springfield"
 *                   plantsOwned:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: "Fern"
 *                         comment:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 1
 *                               content:
 *                                 type: string
 *                                 example: "This plant is great!"
 *                   plantsGuarded:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 2
 *                         name:
 *                           type: string
 *                           example: "Bonsai"
 *                         comment:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 2
 *                               content:
 *                                 type: string
 *                                 example: "This plant needs special care."
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: Users not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Users not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
