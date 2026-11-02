# Tareas JWT - Armando Díaz

API REST desarrollada en **Node.js**, **Express** y **MongoDB (Mongoose)** que registra usuarios, inicia sesión generando un token JWT y ofrece un CRUD de tareas protegido con **Bearer Token**, en el que cada usuario solo puede ver, modificar y eliminar sus propias tareas.

## Cómo instalarlo y ejecutarlo

1. Descargar o clonar este repositorio, abrir la carpeta donde está `package.json` y ejecutar:
   ```bash
   npm install
   ```

2. Crear un archivo `.env` en la raíz del proyecto tomando como base `.env.example` y configurar tus variables (`PORT`, `MONGO_URI` y `JWT_SECRET`):
   ```bash
   cp .env.example .env
   ```

3. Ejecutar el servidor:
   - En modo desarrollo (con `nodemon`):
     ```bash
     npm run server
     ```
   - En modo normal:
     ```bash
     npm start
     ```

## Lista de Endpoints

| Método | Ruta | Descripción | ¿Requiere token? |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/users` | Crear usuario (`crearUser`) | No |
| `POST` | `/api/users/login` | Iniciar sesión y devolver el JWT (`loginUser`) | No |
| `GET` | `/api/users/datos` | Datos del usuario dueño del token (`datosUser`) | Sí |
| `GET` | `/api/tareas` | Listar solo las tareas del usuario logueado (`getTareas`) | Sí |
| `POST` | `/api/tareas` | Crear una tarea asignada al usuario logueado (`createTareas`) | Sí |
| `PUT` | `/api/tareas/:id` | Modificar una tarea propia (`updateTareas`) | Sí |
| `DELETE` | `/api/tareas/:id` | Eliminar una tarea propia (`deleteTareas`) | Sí |

## Configuración local
Requiere Node.js y MongoDB local en ejecución o una conexión a MongoDB Atlas.
En `.env` configura `PORT=5000`, `NODE_ENV=development` y `MONGO_URI` con tu conexión.
Para una base de práctica nueva puedes usar `mongodb://127.0.0.1:27017/tareas_armando_jwt`.
Genera un secreto local con `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
y coloca el resultado en `JWT_SECRET`. No lo publiques.

## Aislamiento de datos
El propietario se toma del JWT verificado. Las consultas de lectura, actualización y
eliminación filtran por `user`. PUT solo acepta `descripcion` y `completada`; no permite
reasignar el propietario. Una tarea ajena o inexistente responde 404.

## Base del proyecto
Adaptación del backend y kit compartidos para la actividad de clase. Se corrigieron
la actualización de propietario, las consultas de mutación y la colección de pruebas.
