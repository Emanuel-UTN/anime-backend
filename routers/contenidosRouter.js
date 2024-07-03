import { Router } from "express";
const contenidosRouter = Router();

import { ValidationError } from "sequelize";

// Importar el servicio
import contenidosService from "../services/contenidos.service.js";

// Definir las rutas
contenidosRouter.get("/", async (req, res) => {
    try {
        const contenidos = await contenidosService.getContenidos(req.query);

        if (contenidos.length === 0) {
            res.status(404).json({ error: "No se encontraron contenidos" });
        } else {
            res.status(200).json(contenidos);
        }
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

contenidosRouter.get("/:id_anime/:orden", async (req, res) => {
    try {
        const contenido = await contenidosService.getContenidoById(req.params.id_anime, req.params.orden);

        if (contenido) {
            res.status(200).json(contenido);
        } else {
            res.status(404).json({ error: "Contenido no encontrado" });
        }
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

contenidosRouter.post("/", async (req, res) => {
    try {
        const contenido = await contenidosService.postContenido(req.body.id_anime, req.body);

        res.status(201).json(contenido);
    } catch (error) {
        if (error instanceof ValidationError) {
            res.status(400).send({ error: error.errors.map(err => err.message).join(', ')});
        }else {
            res.status(400).send({ error: error.message });
        }
    }
});

contenidosRouter.put("/:id_anime/:orden", async (req, res) => {
    try {
        const contenido = await contenidosService.putContenido(req.params.id_anime, req.params.orden, req.body);

        if (contenido) {
            res.status(200).json(contenido);
        } else {
            res.status(404).json({ error: "Contenido no encontrado" });
        }
    } catch (error) {
        if (error instanceof ValidationError) {
            res.status(400).send({ error: error.errors.map(err => err.message).join(', ')});
        } else {
            res.status(400).send({ error: error.message });
        }
    }
});

contenidosRouter.delete("/:id_anime/:orden", async (req, res) => {
    try {
        const contenido = await contenidosService.deleteContenido(req.params.id_anime, req.params.orden);

        if (contenido) {
            res.status(200).json(contenido);
        } else {
            res.status(404).json({ error: "Contenido no encontrado" });
        }
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Exportar el router
export default contenidosRouter;