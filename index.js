import initBD from './base-orm/db-init.js';
import animesService from './services/animes.service.js';

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

    const anime = await animesService.postAnime({ nombre: 'The Quintessential Quintuplets' });

    await animesService.postAnime(anime)
        .catch(error => null);

    const anime2 = await animesService.postAnime({ nombre: 'The eminence in shadow' });

    await animesService.postAnime(anime2)
        .catch(error => null);

    const anime3 = await animesService.postAnime({ nombre: 'Sousou no Frieren' });

    await animesService.postAnime(anime3)
        .catch(error => null);

    // Actualizar animes
    await animesService.updateAnimes();

    app.listen(PORT, () => {
        console.log(`\n\nServidor corriendo en http://localhost:${PORT}`);
    });
}