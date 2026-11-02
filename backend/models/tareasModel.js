const mongoose = require('mongoose');

const tareaSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        descripcion: {
            type: String,
            required: [true, 'Por favor teclea una descripción para la tarea']
        },
        completada: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Tarea', tareaSchema);
