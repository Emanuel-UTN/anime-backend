import e, { Router } from "express";
const animesRouter = Router();

import { Op, ValidationError, UniqueConstraintError } from "sequelize";

// Importar el servicio
import animesService from "../services/animes.service.js";

import Estados from "../models/Estados.js";
import Calificaciones from "../models/Calificaciones.js";
import Etiquetas from "../models/Etiquetas.js";
import ContenidoEtiquetas from "../models/ContenidoEtiqueta.js";

// Definir las rutas
animesRouter.get("/", async (req, res) => {
    try {
        let where = {};
        // Titulo
        if (req.query.titulo !== undefined && req.query.titulo !== "")
            where.titulo = { [Op.like]: `%${req.query.titulo}%` };
        // Tipo
        if (req.query.tipo !== undefined && req.query.tipo !== "")
            where.tipo = req.query.tipo;
        // En emisión
        if (req.query.enEmision !== undefined && req.query.enEmision !== "")
            where.enEmision = req.query.enEmision === 'true';
        // Estado
        if (req.query.estado !== undefined && req.query.estado !== "")
            where.estado = await Estados.findOne({ where: { nombre: req.query.estado }}).then(estado => estado.id);
        // Calificación
        if (req.query.calificacion !== undefined && req.query.calificacion !== "")
            where.calificacion = await Calificaciones.findOne({ where: { nombre: req.query.calificacion }}).then(calificacion => calificacion.id);
        // Etiquetas
        if (req.query.etiquetas !== undefined && req.query.etiquetas !== ""){
            const idsEtiquetas = await Etiquetas.findAll({ where: { nombre: { [Op.in]: req.query.etiquetas }} }).then(etiquetas => etiquetas.map(etiqueta => etiqueta.id));
            const idsAnimes = await ContenidoEtiquetas.findAll({ where: { id_etiqueta: { [Op.in]: idsEtiquetas }} }).then(contenidoEtiquetas => contenidoEtiquetas.map(contenidoEtiqueta => contenidoEtiqueta.id_anime));
            where.id = { [Op.in]: idsAnimes};
        }

        const animes = await animesService.getAnimes(where);

        if (animes.length === 0) {
            res.status(404).json({ error: "No se encontraron animes" });
        } else {
            res.status(200).json(animes);
        }
    } catch (error) {
        res.status(400).send({ error: error.message });
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
        res.status(400).send({ error: error.message });
    }
});

animesRouter.post("/", async (req, res) => {
    try {
        const anime = await animesService.postAnime(req.body);

        res.status(201).json(anime);
    } catch (error) {
        if (error instanceof ValidationError) {
            res.status(400).json({ error: error.errors.map(err => err.message).join(", ")})
        } else if (error instanceof UniqueConstraintError) {
            res.status(400).json({ error: "El anime ya existe" });
        } else {
            res.status(400).send({ error: error.message });
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
            res.status(400).json({ error: error.errors.map(err => err.message).join(", ")})
        } else if (error instanceof UniqueConstraintError) {
            res.status(400).json({ error: "El anime ya existe" });
        } else {
            res.status(400).send({ error: error.message });
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
        res.status(400).send({ error: error.message });
    }
});

// Exportar el router
export default animesRouter;