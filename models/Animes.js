import sequelize from "../base-orm/sequelize-init.js";
import { DataTypes } from "sequelize";

import Estados from "./Estados.js";
import Calificaciones from "./Calificaciones.js";

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
        unique: {
            args: true,
            msg: "El anime ya existe"
        },
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
    estado: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        references: {
            model: Estados,
            key: "id"
        }
    },
    calificacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        references: {
            model: Calificaciones,
            key: "id"
        }
    },
});

export default Animes;