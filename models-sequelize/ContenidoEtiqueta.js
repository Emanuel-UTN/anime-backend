import sequelize from "../base-orm/sequelize-init.js";
import { DataTypes } from "sequelize";

// Importar dependencias
import Contenidos from "./Contenidos.js";
import Etiquetas from "./Etiquetas.js";

/* =============================================
    // TABLA CONTENIDOETIQUETAS
============================================= */

const ContenidoEtiquetas = sequelize.define("ContenidoEtiquetas", {
    id_anime: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    orden: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    id_etiqueta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    }
});

export default ContenidoEtiquetas;
