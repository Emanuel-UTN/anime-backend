import sequelize from "./sequelize-init.js";

// Importar Modelos
import Animes from "../models-sequelize/Animes.js";
import TiposContenido from "../models-sequelize/TiposContenido.js";
import Etiquetas from "../models-sequelize/Etiquetas.js";
import Contenidos from "../models-sequelize/Contenidos.js";
import ContenidoEtiquetas from "../models-sequelize/ContenidoEtiqueta.js";
import UrlsContenido from "../models-sequelize/UrlsContenido.js";
import SitiosWeb from "../models-sequelize/SitiosWeb.js";


async function initBD() {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });

    //#region Relaciones
    // Definir Relaciones
    // CONTENIDO
    Contenidos.belongsTo(Animes, { foreignKey: "id_anime" });
    Contenidos.belongsTo(TiposContenido, { foreignKey: "tipo" });
    
    Contenidos.belongsToMany(Etiquetas, { through: ContenidoEtiquetas, foreignKey: "id_anime", otherKey: "id_etiqueta" });
    Etiquetas.belongsToMany(Contenidos, { through: ContenidoEtiquetas, foreignKey: "id_etiqueta", otherKey: "id_anime" });
    
    Contenidos.hasMany(ContenidoEtiquetas, { foreignKey: "id_anime" });
    Contenidos.hasMany(ContenidoEtiquetas, { foreignKey: "orden" });

    // CONTENIDO ETIQUETA
    ContenidoEtiquetas.belongsTo(Etiquetas, { foreignKey: "id_etiqueta" });
    ContenidoEtiquetas.belongsTo(Contenidos, { foreignKey: "id_anime" });
    ContenidoEtiquetas.belongsTo(Contenidos, { foreignKey: "orden" });

    // URLS CONTENIDO
    UrlsContenido.belongsTo(Contenidos, { foreignKey: 'id_anime' });
    UrlsContenido.belongsTo(Contenidos, { foreignKey: 'orden' });
    UrlsContenido.belongsTo(SitiosWeb, { foreignKey: "sitio_web" });

    Contenidos.hasMany(UrlsContenido, { foreignKey: "id_anime" });
    Contenidos.hasMany(UrlsContenido, { foreignKey: "orden" });

    //#endregion


    //#region Crear registros
    let existe = false;
    let res = null;

    /* =============================================
        // TABLA SITIOS WEB
    ============================================= */
    res = await SitiosWeb.count();

    if (res > 0) existe = true;
    if (!existe) {
        // INSERTAR DATOS EN LA TABLA SITIOS WEB
        let datos = [
            { nombre: 'animeflv', url: 'https://www3.animeflv.net', image: 'https://www3.animeflv.net/favicon.ico' },
            { nombre: 'anime-jl', url:'https://www.anime-jl.net', image: 'https://www.anime-jl.net/favicon.ico' }
        ]

        for(let d of datos) {
            await SitiosWeb.create(d);
        }
    }

    /* =============================================
        // TABLA TIPOS CONTENIDO
    ============================================= */
    res = await TiposContenido.count();

    if (res > 0) existe = true;
    if (!existe) {
        // INSERTAR DATOS EN LA TABLA TIPOS CONTENIDO
        let datos = [
            { tipo: 'Anime' },
            { tipo: 'Película' },
            { tipo: 'OVA' }
        ]

        for(let d of datos) {
            await TiposContenido.create(d);
        }
    }

    //#endregion
}

export default initBD;