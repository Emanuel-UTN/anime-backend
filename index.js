import initBD from './base-orm/db-init.js';

import express from 'express';
const app = express();
app.use(express.json());

// Importar libreria cors
import cors from 'cors';
app.use(cors());

// Importar routers
import contenidosRouter from './routers/contenidosRouter.js';   // CONTENIDOS
app.use('/api/contenidos', contenidosRouter);
import animesRouter from './routers/animesRouter.js';           // ANIMES
app.use('/api/animes', animesRouter);

// Levantar servidor
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 3000;

    await initBD(); // Iniciar Base de Datos

    app.listen(PORT, () => {
        console.log(`\n\nServidor corriendo en http://localhost:${PORT}`);
    });
}