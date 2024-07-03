import sequelize from "../base-orm/sequelize-init.js";
import { DataTypes } from "sequelize";

/* =============================================
    // TABLA TIPOS CONTENIDO
============================================= */

const TiposContenido = sequelize.define("TiposContenido", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                args: true,
                msg: "El tipo no puede estar vacío"
            },
            len: {
                args: [3, 20],
                msg: "El tipo debe tener entre 3 y 20 caracteres"
            }
        }
    }
});

export default TiposContenido;