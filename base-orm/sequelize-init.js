import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ".data/animes.db",
    logging: console.log,
    define: {
        timestamps: false
    }
});

export default sequelize;