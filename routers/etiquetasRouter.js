import { Router } from "express";
const router = Router();

import Etiquetas from "../models-sequelize/Etiquetas.js";

import { ValidationError, UniqueConstraintError } from "sequelize";

router.get('/', async (req, res) => {
    try {
        const etiquetas = await Etiquetas.findAll();

        if (etiquetas.length === 0) {
            res.status(404).json({ error: 'No se encontraron etiquetas' });
        } else {
            res.status(200).json(etiquetas);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id_etiqueta', async (req, res) => {
    try {
        const etiqueta = await Etiquetas.findOne({ where: { id: req.params.id_etiqueta } });

        if (etiqueta) {
            res.status(200).json(etiqueta);
        } else {
            res.status(404).json({ error: 'Etiqueta no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const etiqueta = await Etiquetas.create(req.body);

        res.status(201).json(etiqueta);

    } catch (error) {
        if (error instanceof ValidationError) {
            res.status(400).send(error.errors.map(err => err.message).join(', '));
        } else if (error instanceof UniqueConstraintError) {
            res.status(400).json({ error: 'Etiqueta ya existe'});
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

router.put('/:id_etiqueta', async (req, res) => {
    try {
        const etiqueta = await Etiquetas.findOne({ where: { id: req.params.id_etiqueta } });

        if (!etiqueta) {
            res.status(404).json({ error: 'Etiqueta no encontrada' });
        } else {
            await etiqueta.update(req.body);

            res.status(200).json(etiqueta);
        }
    } catch (error) {
        if (error instanceof ValidationError) {
            res.status(400).send(error.errors.map(err => err.message).join(', '));
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

router.delete('/:id_etiqueta', async (req, res) => {
    try {
        const etiqueta = await Etiquetas.findOne({ where: { id: req.params.id_etiqueta } });

        if (!etiqueta) {
            res.status(404).json({ error: 'Etiqueta no encontrada' });
        } else {
            await etiqueta.destroy();

            res.status(200).json(etiqueta);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;