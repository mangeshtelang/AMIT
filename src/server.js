'use strict';

require('dotenv').config();

const http = require('http');

const app = require('./app');
const prisma = require('./config/prisma');
const logger = require('./config/logger');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

/**
 * Start HTTP Server
 */
server.listen(PORT, () => {
  logger.info(`🚀 Server is running on port ${PORT}`);
  logger.info(`🌍 Environment : ${process.env.NODE_ENV}`);
  logger.info(`📡 Health Check : http://localhost:${PORT}/api/v1/health`);
});

/**
 * Handle Server Errors
 */
server.on('error', (error) => {
  logger.error('Server Error', error);
  process.exit(1);
});

/**
 * Graceful Shutdown
 */
const shutdown = async (signal) => {
  logger.warn(`${signal} received. Shutting down application...`);

  server.close(async () => {
    try {
      await prisma.$disconnect();
      logger.info('Database connection closed.');
      logger.info('Server stopped successfully.');
      process.exit(0);
    } catch (error) {
      logger.error('Error while shutting down.', error);
      process.exit(1);
    }
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

/**
 * Handle Uncaught Exceptions
 */
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', error);
  process.exit(1);
});

/**
 * Handle Unhandled Promise Rejections
 */
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Promise Rejection', reason);

  server.close(() => {
    process.exit(1);
  });
});