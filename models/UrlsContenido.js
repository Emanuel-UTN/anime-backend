import sequelize from "../base-orm/sequelize-init.js";
import { DataTypes } from "sequelize";

// Importar dependencias
import Contenidos from "./Contenidos.js";
import SitiosWeb from "./SitiosWeb.js";

/* =============================================
    // TABLA URLS CONTENIDO
============================================= */

const UrlsContenido = sequelize.define("UrlsContenido", {
    id_anime: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    orden: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    sitio_web: {
        type: DataTypes.STRING,
        references: {
            model: SitiosWeb,
            key: "nombre"
        }
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    }
});

// Relaciones


export default UrlsContenido;