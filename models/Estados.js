import sequelize from "../base-orm/sequelize-init.js";
import { DataTypes } from "sequelize";

/* =============================================
    // TABLA ESTADOS
============================================= */

const Estados = sequelize.define("Estados", {
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
            msg: "El estado ya existe"
        },
        validate: {
            notEmpty: {
                args: true,
                msg: "El nombre no puede estar vacío"
            }
        }
    }
});

export default Estados;