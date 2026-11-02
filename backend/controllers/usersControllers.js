const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/usersModel');

// Función auxiliar para firmar el JWT con el id del usuario
const generarToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Registrar un nuevo usuario
// @route   POST /api/users
// @access  Public
const crearUser = asyncHandler(async (req, res) => {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
        res.status(400);
        throw new Error('Por favor completa todos los campos obligatorios (nombre, email, password)');
    }

    // Verificar si el correo ya está registrado
    const userExiste = await User.findOne({ email });
    if (userExiste) {
        res.status(400);
        throw new Error('Ese correo electrónico ya se encuentra registrado');
    }

    // Cifrar la contraseña con bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear el usuario en la base de datos
    const user = await User.create({
        nombre,
        email,
        password: hashedPassword
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            nombre: user.nombre,
            email: user.email,
            mensaje: 'Usuario registrado correctamente'
        });
    } else {
        res.status(400);
        throw new Error('Datos de usuario inválidos');
    }
});

// @desc    Autenticar (iniciar sesión) a un usuario y devolver su JWT
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Por favor ingresa tu email y password');
    }

    // Buscar al usuario por su correo electrónico
    const user = await User.findOne({ email });

    // Verificar usuario y comparar contraseña contra el hash almacenado
    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user.id,
            nombre: user.nombre,
            email: user.email,
            token: generarToken(user.id)
        });
    } else {
        res.status(401);
        throw new Error('Credenciales inválidas: correo o contraseña incorrectos');
    }
});

// @desc    Obtener los datos del usuario dueño del token
// @route   GET /api/users/datos
// @access  Private (requiere Bearer Token)
const datosUser = asyncHandler(async (req, res) => {
    res.status(200).json({
        _id: req.user.id,
        nombre: req.user.nombre,
        email: req.user.email
    });
});

module.exports = {
    crearUser,
    loginUser,
    datosUser
};
