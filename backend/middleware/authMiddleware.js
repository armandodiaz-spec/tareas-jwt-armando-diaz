const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/usersModel');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && /^Bearer\s+\S+$/i.test(req.headers.authorization)) {
        try {
            // Obtener el token del header Authorization: Bearer <token>
            token = req.headers.authorization.split(/\s+/)[1];

            // Verificar la firma del token con el secreto
            const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });

            // Obtener el usuario del token verificado (sin el password) y asignarlo a req.user
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                res.status(401);
                throw new Error('Acceso no autorizado, el usuario del token no existe');
            }

            return next();
        } catch (error) {
            res.status(401);
            throw new Error('Acceso no autorizado, token inválido o expirado');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Acceso no autorizado, no se proporcionó ningún token');
    }
});

module.exports = {
    protect
};
