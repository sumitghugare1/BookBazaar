const ApiKey = require('../models/ApiKey');
const User = require('../models/User');

// Verify API key middleware
exports.verifyApiKey = async (req, res, next) => {
  const apiKey = req.header('X-API-Key');

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'API key is required'
    });
  }

  try {
    // Find the API key and check if it's active
    const keyRecord = await ApiKey.findOne({
      where: { 
        key: apiKey,
        isActive: true
      },
      include: [{ model: User }]
    });

    if (!keyRecord) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or inactive API key'
      });
    }

    // Check if key is expired
    if (keyRecord.expiresAt && new Date(keyRecord.expiresAt) < new Date()) {
      return res.status(401).json({
        success: false,
        error: 'API key has expired'
      });
    }

    // Attach user to request
    req.apiKey = keyRecord;
    req.user = keyRecord.User;
    
    next();
  } catch (err) {
    console.error('API key verification error:', err);
    return res.status(500).json({
      success: false,
      error: 'Error verifying API key'
    });
  }
};
