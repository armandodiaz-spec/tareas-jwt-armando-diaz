const asyncHandler = require('express-async-handler');
const Tarea = require('../models/tareasModel');

function camposPermitidos(body, obligatorio = false) {
    const campos = {};
    if (obligatorio || Object.hasOwn(body, 'descripcion')) {
        if (typeof body.descripcion !== 'string' || !body.descripcion.trim()) {
            const err = new Error('La descripción debe ser un texto no vacío');
            err.statusCode = 400;
            throw err;
        }
        campos.descripcion = body.descripcion.trim();
    }
    if (Object.hasOwn(body, 'completada')) {
        if (typeof body.completada !== 'boolean') {
            const err = new Error('completada debe ser un booleano');
            err.statusCode = 400;
            throw err;
        }
        campos.completada = body.completada;
    }
    return campos;
}

function filtroPropio(req) {
    if (!/^[a-f0-9]{24}$/i.test(req.params.id)) {
        const err = new Error('Identificador de tarea inválido');
        err.statusCode = 400;
        throw err;
    }
    return { _id: req.params.id, user: req.user.id };
}

const getTareas = asyncHandler(async (req, res) => {
    res.status(200).json(await Tarea.find({ user: req.user.id }));
});

const createTareas = asyncHandler(async (req, res) => {
    const tarea = await Tarea.create({ ...camposPermitidos(req.body, true), user: req.user.id });
    res.status(201).json(tarea);
});

const updateTareas = asyncHandler(async (req, res) => {
    const campos = camposPermitidos(req.body);
    if (!Object.keys(campos).length) {
        res.status(400);
        throw new Error('Envía descripcion o completada');
    }
    const tarea = await Tarea.findOneAndUpdate(filtroPropio(req), { $set: campos },
        { new: true, runValidators: true });
    if (!tarea) {
        res.status(404);
        throw new Error('Tarea no encontrada para este usuario');
    }
    res.status(200).json(tarea);
});

const deleteTareas = asyncHandler(async (req, res) => {
    const tarea = await Tarea.findOneAndDelete(filtroPropio(req));
    if (!tarea) {
        res.status(404);
        throw new Error('Tarea no encontrada para este usuario');
    }
    res.status(200).json({ id: req.params.id, mensaje: 'Tarea eliminada correctamente' });
});

module.exports = { getTareas, createTareas, updateTareas, deleteTareas };
