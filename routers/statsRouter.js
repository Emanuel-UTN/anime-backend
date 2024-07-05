import { Router } from "express";
const router = Router();

import Animes from "../models/Animes.js";
import Calificaciones from "../models/Calificaciones.js";

// Definir las rutas
router.get("/", async (req, res) => {
    try {
        const animes_registrados = await Animes.count();

        const animes_por_ver = await Animes.count({ where: { estado: 1 } });
        const animes_vistos = await Animes.count({ where: { estado: 3 } });

        const animes_calificados = [];

        for (let c of await Calificaciones.findAll()){
            const count = await Animes.count({ where: { calificacion: c.id } })
            animes_calificados.push({ calificacion: c.nombre, cantidad: count });
        }

        res.status(200).json({ animes_registrados, animes_por_ver, animes_vistos, animes_calificados })
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

export default router;