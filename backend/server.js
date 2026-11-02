const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

const port = process.env.PORT || 5000;

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
    throw new Error('Configura MONGO_URI y JWT_SECRET en .env');
}

const app = express();

// Middlewares para parsear JSON y formularios urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Montaje de rutas de la API
app.use('/api/users', require('./routes/usersRoutes'));
app.use('/api/tareas', require('./routes/tareasRoutes'));

// Middleware centralizado de manejo de errores
app.use(errorHandler);

connectDB().then(() => {
    app.listen(port, () => console.log(`Servidor iniciado en el puerto ${port}`.yellow.bold));
});
