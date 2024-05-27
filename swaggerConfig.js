const swaggerJSDoc = require('swagger-jsdoc');

const options= {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Kaptive backend assignment api',
      version: '1.0.0',
      description: 'Your API Description',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./route/*.js'], // Path to your API documentation
};

const swaggerDocs = swaggerJSDoc(options);




module.exports = {swaggerDocs};
