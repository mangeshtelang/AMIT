module.exports = (req, res, next) => {
  req.context = {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'] || 'unknown'
  };
  next();
};
