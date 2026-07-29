const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const { hashToken } = require('../utils/hash');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');

const getRefreshExpiryDate = () => {
  const now = new Date();
  now.setDate(now.getDate() + 7);
  return now;
};

exports.issueTokens = async ({ user, req, res }) => {
  const accessToken = generateAccessToken({ id: user.id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user.id, role: user.role });

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: getRefreshExpiryDate(),
      userAgent: req.headers['user-agent'] || null,
      ipAddress: req.ip || null
    }
  });

  res.cookie(process.env.REFRESH_TOKEN_COOKIE_NAME || 'library_refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  return { accessToken, refreshToken };
};

exports.rotateRefreshToken = async ({ token, req, res }) => {
  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const tokenHash = hashToken(token);

  const dbToken = await prisma.refreshToken.findFirst({
    where: {
      tokenHash,
      userId: decoded.id,
      isRevoked: false,
      expiresAt: { gt: new Date() }
    },
    include: { user: true }
  });

  if (!dbToken || dbToken.user.isDeleted || !dbToken.user.isActive) {
    throw new Error('Invalid refresh token.');
  }

  await prisma.refreshToken.update({ where: { id: dbToken.id }, data: { isRevoked: true } });

  return this.issueTokens({ user: dbToken.user, req, res });
};

exports.revokeRefreshToken = async (token) => {
  if (!token) return;
  const tokenHash = hashToken(token);
  await prisma.refreshToken.updateMany({ where: { tokenHash }, data: { isRevoked: true } });
};
