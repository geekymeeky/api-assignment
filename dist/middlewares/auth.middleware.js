import jwt from 'jsonwebtoken';
export const protect = (req, res, next) => {
    const bearer = req.headers.authorization;
    if (!bearer) {
        res.status(401).json({ message: 'not authorized' });
        return;
    }
    const [, token] = bearer.split(' ');
    if (!token) {
        res.status(401).json({ message: 'not valid token' });
        return;
    }
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    }
    catch (e) {
        console.error(e);
        res.status(401).json({ message: 'not valid token' });
        return;
    }
};
//# sourceMappingURL=auth.middleware.js.map