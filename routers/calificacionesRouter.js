import { Router } from "express";
const router = Router();

import Calificaciones from "../models/Calificaciones.js";

import { ValidationError, UniqueConstraintError, Op } from "sequelize";

router.get('/', async (req, res) => {
    try {
        let where = {};
        if (req.query.nombre !== undefined && req.query.nombre !== '') 
            where.nombre = { [Op.substring]: req.query.nombre };
        const calificaciones = await Calificaciones.findAll({ where });

        if (calificaciones.length === 0) {
            res.status(404).json({ error: 'No se encontraron calificaciones' });
        } else {
            res.status(200).json(calificaciones);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id_calificacion', async (req, res) => {
    try {
        const calificacion = await Calificaciones.findOne({ where: { id: req.params.id_calificacion } });

        if (calificacion) {
            res.status(200).json(calificacion);
        } else {
            res.status(404).json({ error: 'Calificacion no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        if (req.body.id === 0)
            req.body.id = null;
        const calificacion = await Calificaciones.create(req.body);

        res.status(201).json(calificacion);

    } catch (error) {
        if (error instanceof ValidationError) {
            res.status(400).send({ error: error.errors.map(err => err.message).join(', ')});
        } else if (error instanceof UniqueConstraintError) {
            res.status(400).json({ error: 'Calificacion ya existe' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

router.put('/:id_calificacion', async (req, res) => {
    try {
        const calificacion = await Calificaciones.findOne({ where: { id: req.params.id_calificacion } });

        if (!calificacion) {
            res.status(404).json({ error: 'Calificacion no encontrada' });
        } else {
            await calificacion.update(req.body);
            res.status(200).json(calificacion);
        }
    } catch (error) {
        if (error instanceof ValidationError) {
            res.status(400).send({ error: error.errors.map(err => err.message).join(', ')});
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

router.delete('/:id_calificacion', async (req, res) => {
    try {
        const calificacion = await Calificaciones.findOne({ where: { id: req.params.id_calificacion } });

        if (!calificacion) {
            res.status(404).json({ error: 'Calificacion no encontrada' });
        } else {
            await calificacion.destroy();
            res.status(200).json(calificacion);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;