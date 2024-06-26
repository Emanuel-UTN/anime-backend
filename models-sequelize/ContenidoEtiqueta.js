import sequelize from "../base-orm/sequelize-init.js";
import { DataTypes } from "sequelize";

// Importar dependencias
import Etiquetas from "./Etiquetas.js";

/* =============================================
// TABLA CONTENIDO ETIQUETA
============================================= */

const ContenidoEtiquetas = sequelize.define("ContenidoEtiquetas", {
    id_anime: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    orden: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    id_etiqueta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Etiquetas,
            key: 'id'
        }
    }
});

export default ContenidoEtiquetas;
