// authorizeRole.js
function authorizeRole(allowedRoles) {
    return (req, res, next) => {
      if (!req.user || !req.user.role) {
        return res.status(403).send('Access denied. No user role provided.');
      }
  
      const userRole = req.user.role;
      if (allowedRoles.includes(userRole)) {
        next(); // Ako uloga odgovara, prelazi dalje
      } else {
        return res.status(403).send('Access denied. Insufficient role permissions.');
      }
    };
  }
  
  module.exports = authorizeRole;
  