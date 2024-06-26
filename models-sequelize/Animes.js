import sequelize from "../base-orm/sequelize-init.js";
import { DataTypes } from "sequelize";

/* =============================================
    // TABLA ANIMES
============================================= */

const Animes = sequelize.define("Animes", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['Serie', 'Película', 'OVA']]
        }
    },
    enEmision: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
});

export default Animes;