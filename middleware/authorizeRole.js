function authorizeRole(allowedRoles) {
    return (req, res, next) => {
        const userRole = req.user.role;
        if (allowedRoles.includes(userRole)) {
            next();
        } else {
            return res.status(403).send('Access denied.');
        }
    };
}

module.exports = authorizeRole;
