import sequelize from "../base-orm/sequelize-init.js";
import { DataTypes } from "sequelize";

/* =============================================
    // TABLA CALIFICACIONES
============================================= */

const Calificaciones = sequelize.define("Calificaciones", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            args: true,
            msg: "La calificacion ya existe"
        },
        validate: {
            notEmpty: {
                args: true,
                msg: "El nombre de la calificacion no puede estar vacío"
            }
        }
    }
});

export default Calificaciones;