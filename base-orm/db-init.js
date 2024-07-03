import sequelize from "./sequelize-init.js";

// Importar Modelos
import Animes from "../models/Animes.js";
import Estados from "../models/Estados.js";
import Calificaciones from "../models/Calificaciones.js";
import TiposContenido from "../models/TiposContenido.js";
import Etiquetas from "../models/Etiquetas.js";
import Contenidos from "../models/Contenidos.js";
import ContenidoEtiquetas from "../models/ContenidoEtiqueta.js";
import UrlsContenido from "../models/UrlsContenido.js";
import SitiosWeb from "../models/SitiosWeb.js";


async function initBD() {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });

    //#region Relaciones
    // Definir Relaciones
    // ANIMES
    Animes.belongsTo(Estados, { foreignKey: "estado" });
    Animes.belongsTo(Calificaciones, { foreignKey: "calificacion" });

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

    /* =============================================
        // TABLA ESTADOS
    ============================================= */
    res = await Estados.count();

    if (res > 0) existe = true;
    if (!existe) {
        // INSERTAR DATOS EN LA TABLA ESTADOS
        let datos = [
            { nombre: 'Por Ver' },
            { nombre: 'Viendo' },
            { nombre: 'Visto' }
        ]

        for(let d of datos) {
            await Estados.create(d);
        }
    }

    /* =============================================
        // TABLA CALIFICACIONES
    ============================================= */
    res = await Calificaciones.count();

    if (res > 0) existe = true;
    if (!existe) {
        // INSERTAR DATOS EN LA TABLA CALIFICACIONES
        let datos = [
            { nombre: 'Sin Calificar' },
            { nombre: 'Pésimo' },
            { nombre: 'Muy Malo' },
            { nombre: 'Malo' },
            { nombre: 'Regular' },
            { nombre: 'Bueno' },
            { nombre: 'Muy Bueno' },
            { nombre: 'Buenisimo' },
            { nombre: 'Excelente' },
            { nombre: 'Obra Maestra' }
        ]

        for(let d of datos) {
            await Calificaciones.create(d);
        }
    }

    //#endregion
}

export default initBD;