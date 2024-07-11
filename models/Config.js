import sequelize from '../base-orm/sequelize-init.js';
import { DataTypes } from 'sequelize';

/* =============================================
    // TABLA CONFIG
============================================= */

const Config = sequelize.define('Config', {
    key: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'Config'
});

export default Config;