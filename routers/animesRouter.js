import { Router } from "express";
const animesRouter = Router();

import { ValidationError } from "sequelize";

// Importar el servicio
import animesService from "../services/animes.service.js";

// Definir las rutas
animesRouter.get("/", async (req, res) => {
    try {
        const animes = await animesService.getAnimes(req.query);

        if (animes.length === 0) {
            res.status(404).json({ error: "No se encontraron animes" });
        } else {
            res.status(200).json(animes);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});

animesRouter.get("/:id_anime", async (req, res) => {
    try {
        const anime = await animesService.getAnimeById(req.params.id_anime);

        if (anime) {
            res.status(200).json(anime);
        } else {
            res.status(404).json({ error: "Anime no encontrado" });
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});

animesRouter.post("/", async (req, res) => {
    try {
        const anime = await animesService.postAnime(req.body);

        res.status(201).json(anime);
    } catch (error) {
        if (error instanceof ValidationError) {
            res.status(400).send(error.errors.map(err => err.message).join(", "));
        } else {
            throw error;
        }
    }
});

animesRouter.put("/:id_anime", async (req, res) => {
    try {
        const anime = await animesService.putAnime(req.params.id_anime, req.body);

        if (anime) {
            res.status(200).json(anime);
        } else {
            res.status(404).json({ error: "Anime no encontrado" });
        }
    } catch (error) {
        if (error instanceof ValidationError) {
            res.status(400).send(error.errors.map(err => err.message).join(", "));
        } else {
            throw error;
        }
    }
});

animesRouter.delete("/:id_anime", async (req, res) => {
    try {
        const anime = await animesService.deleteAnime(req.params.id_anime);

        if (anime) {
            res.status(200).json(anime);
        } else {
            res.status(404).json({ error: "Anime no encontrado" });
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Exportar el router
export default animesRouter;