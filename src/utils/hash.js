const crypto = require('crypto');

exports.hashToken = (value) => crypto.createHash('sha256').update(String(value)).digest('hex');
