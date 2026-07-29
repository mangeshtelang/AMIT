const prisma = require('../config/prisma');

exports.createAuditLog = async ({ userId, action, entity, entityId, method, route, ipAddress, userAgent, oldValues, newValues }) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId: entityId ? String(entityId) : null,
        method,
        route,
        ipAddress,
        userAgent,
        oldValues,
        newValues
      }
    });
  } catch (error) {
    console.error('Audit log failed:', error.message);
  }
};
