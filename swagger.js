const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'My Express API',
        version: '1.0.0',
        description: 'API documentation for my Express app',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
      servers: [
        {
          url: `${process.env.SWAGGERURL}`,
        },
      ],
    },
    apis: ['./docs/*.js'], // Assurez-vous que ce chemin est correct
  };
  



const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerUi, swaggerSpec };
