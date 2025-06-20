const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

// Generate a unique API key
exports.generateApiKey = () => {
  return `bkbz_${uuidv4().replace(/-/g, '')}_${crypto.randomBytes(8).toString('hex')}`;
};
