import sequelize from "../base-orm/sequelize-init.js";
import { DataTypes } from "sequelize";
import Animes from "./Animes.js";
import TiposContenido from "./TiposContenido.js";
import Etiquetas from "./Etiquetas.js";
import ContenidoEtiquetas from "./ContenidoEtiqueta.js";

/* =============================================
// TABLA CONTENIDOS
============================================= */

const Contenidos = sequelize.define("Contenidos", {
    id_anime: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Animes,
            key: "id"
        }
    },
    orden: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            args: true,
            msg: "El contenido ya existe"
        },
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
        references: {
            model: TiposContenido,
            key: "id"
        }
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
