const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

exports.protect = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ success: false, message: 'Access token is required.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.userProfile.findFirst({
    where: { id: decoded.id, status: "ACTIVE" },
      select: { id: true, username: true,  roles: {
            select: {
                roleId: true
            }
        } }
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found or inactive.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired access token.' });
  }
};

exports.authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'You are not allowed to perform this action.' });
  }
  next();
};

exports.checkPermission = (resource, action) => async (req, res, next) => {
  const permission = await prisma.rolePermission.findFirst({
    where: { role: req.user.roleId, resource, action, isAllowed: true }
  });
  
  if (!permission) {
    return res.status(403).json({ success: false, message: `Permission denied for ${resource}:${action}` });
  }
  next();
};
