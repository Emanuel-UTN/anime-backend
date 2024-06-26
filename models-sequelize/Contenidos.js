import sequelize from "../base-orm/sequelize-init.js";
import { DataTypes } from "sequelize";

// Importar dependencias
import Animes from "./Animes.js";
import TiposContenido from "./TiposContenido.js";
import Etiquetas from "./Etiquetas.js";
import ContenidoEtiqueta from "./ContenidoEtiqueta.js";
import UrlsContenido from "./UrlsContenido.js";

/* =============================================
    // TABLA CONTENIDOS
============================================= */

const Contenidos = sequelize.define("Contenidos", {
    id_anime: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    orden: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                args: true,
                msg: "El título no puede estar vacío"
            }
        }
    },
    tipo: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    enEspanol: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    enEmision: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    imagen: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isUrl: {
                args: true,
                msg: "La URL de la imagen no es válida"
            }
        }
    }
});

// Relaciones


export default Contenidos;
