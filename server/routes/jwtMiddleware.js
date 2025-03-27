const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.cookies.token; // Get token from cookies

  if (!token) {
    return res.status(401).json({ message: 'Access denied.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to request
    next(); // Allow the request to proceed
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token.' });
  }
};


  const verifyAdmin = (req, res, next) => {
    // Check if the user object exists and has the 'admin' role
    if (req.user && req.user.role === 'admin') {
      next(); // Allow the request to proceed
    } else {
      res.status(403).json({ message: 'Access denied. Admin role required.' }); // 403 Forbidden
    }
  };
  
  module.exports = {verifyToken, verifyAdmin};