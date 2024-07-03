import sequelize from "../base-orm/sequelize-init.js";
import { DataTypes } from "sequelize";

/* =============================================
    // TABLA SITIOS WEB
============================================= */

const SitiosWeb = sequelize.define("SitiosWeb", {
    nombre: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: {
            args: true,
            msg: "El sitio ya existe"
        },
        validate: {
            isLowercase: {
                args: true,
                msg: "El nombre debe estar en minúsculas"
            },
            notEmpty: {
                args: true,
                msg: "El nombre no puede estar vacío"
            }
        }
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isUrl: {
                args: true,
                msg: "La URL no es válida"
            }
        }
    },
    image: {
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

export default SitiosWeb;