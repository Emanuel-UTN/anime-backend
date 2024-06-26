import sequelize from "../base-orm/sequelize-init.js";
import { DataTypes } from "sequelize";

/* =============================================
// TABLA ETIQUETAS
============================================= */

const Etiquetas = sequelize.define("Etiquetas", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                args: true,
                msg: "El nombre no puede estar vacío"
            }
        }
    }
});

export default Etiquetas;