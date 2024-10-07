const authorizeRole = (allowedRoles) => (req, res, next) => {
  if (!req.session.user || !allowedRoles.includes(req.session.user.role)) {
    return res.status(403).send('Access denied');
  }
  next();
};

module.exports = authorizeRole;
