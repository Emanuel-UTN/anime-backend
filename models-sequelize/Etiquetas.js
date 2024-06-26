import sequelize from "../base-orm/sequelize-init.js";
import { DataTypes } from "sequelize";

// Importar dependencias
import Contenidos from "./Contenidos.js";
import ContenidoEtiqueta from "./ContenidoEtiqueta.js";

/* =============================================
    // TABLA ETIQUETAS
============================================= */

const Etiquetas = sequelize.define("Etiquetas", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    etiqueta: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                args: true,
                msg: "La etiqueta no puede estar vacía"
            }
        }
    }
});

// Relaciones


export default Etiquetas;
