import { Router } from "express";
const router = Router();

import SitiosWeb from "../models-sequelize/SitiosWeb.js";

import { ValidationError, UniqueConstraintError } from "sequelize";

router.get('/', async (req, res) => {
    try {
        const sitios = await SitiosWeb.findAll();

        if (sitios.length === 0) {
            res.status(404).json({ error: 'No se encontraron sitios' });
        } else {
            res.status(200).json(sitios);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:nombre', async (req, res) => {
    try {
        const sitio = await SitiosWeb.findOne({ where: { nombre: req.params.nombre } });

        if (sitio) {
            res.status(200).json(sitio);
        } else {
            res.status(404).json({ error: 'Sitio no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const sitio = await SitiosWeb.create(req.body);

        res.status(201).json(sitio);

    } catch (error) {
        if (error instanceof ValidationError) {
            res.status(400).send(error.errors.map(err => err.message).join(', '));
        } else if (error instanceof UniqueConstraintError) {
            res.status(400).json({ error: 'Sitio ya existe' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

router.put('/:nombre', async (req, res) => {
    try {
        const sitio = await SitiosWeb.findOne({ where: { nombre: req.params.nombre } });

        if (!sitio) {
            res.status(404).json({ error: 'Sitio no encontrado' });
        } else {
            await sitio.update(req.body);

            res.status(200).json(sitio);
        }
    } catch (error) {
        if (error instanceof ValidationError)
            res.status(400).send(error.errors.map(err => err.message).join(', '));
        else
            res.status(500).json({ error: error.message });
    }
});

router.delete('/:nombre', async (req, res) => {
    try {
        const sitio = await SitiosWeb.findOne({ where: { nombre: req.params.nombre } });

        if (!sitio) {
            res.status(404).json({ error: 'Sitio no encontrado' });
        } else {
            await sitio.destroy();

            res.status(200).json(sitio);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;