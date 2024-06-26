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
            { nombre: 'animeflv', url: 'https://www3.animeflv.net/', image: 'https://www3.animeflv.net/favicon.ico' },
            { nombre: 'anime-jl', url:'https://www.anime-jl.net/', image: 'https://www.anime-jl.net/favicon.ico' }
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

    // INSERCION DE PRUEBA
    const anime = await Animes.create({
        titulo: 'Dragon Ball',
        tipo: 'Serie',
        enEmision: false
    });

    const cont1 = await Contenidos.create({
        id_anime: anime.id,
        orden: 1,
        titulo: 'Dragon Ball',
        tipo: 1,
        enEspanol: true,
        enEmision: false,
        imagen: 'https://www3.animeflv.net/uploads/animes/covers/1.jpg'
    });

    const cont2 = await Contenidos.create({
        id_anime: anime.id,
        orden: 2,
        titulo: 'Dragon Ball Z',
        tipo: 1,
        enEspanol: true,
        enEmision: false,
        imagen: 'https://www3.animeflv.net/uploads/animes/covers/2.jpg'
    });

    const cont3 = await Contenidos.create({
        id_anime: anime.id,
        orden: 3,
        titulo: 'Dragon Ball GT',
        tipo: 3,
        enEspanol: true,
        enEmision: false,
        imagen: 'https://www3.animeflv.net/uploads/animes/covers/3.jpg'
    });

    const etiqueta1 = await Etiquetas.create({
        nombre: 'Aventura'
    });

    const etiqueta2 = await Etiquetas.create({
        nombre: 'Acción'
    });

    const etiqueta3 = await Etiquetas.create({
        nombre: 'Comedia'
    });

    await ContenidoEtiquetas.create({
        id_anime: cont1.id_anime,
        orden: cont1.orden,
        id_etiqueta: etiqueta1.id
    });

    await ContenidoEtiquetas.create({
        id_anime: cont1.id_anime,
        orden: cont1.orden,
        id_etiqueta: etiqueta2.id
    });

    await ContenidoEtiquetas.create({
        id_anime: cont1.id_anime,
        orden: cont1.orden,
        id_etiqueta: etiqueta3.id
    });

    await ContenidoEtiquetas.create({
        id_anime: cont2.id_anime,
        orden: cont2.orden,
        id_etiqueta: etiqueta1.id
    });

    await ContenidoEtiquetas.create({
        id_anime: cont2.id_anime,
        orden: cont2.orden,
        id_etiqueta: etiqueta2.id
    });

    await ContenidoEtiquetas.create({
        id_anime: cont3.id_anime,
        orden: cont3.orden,
        id_etiqueta: etiqueta2.id
    });

    await ContenidoEtiquetas.create({
        id_anime: cont3.id_anime,
        orden: cont3.orden,
        id_etiqueta: etiqueta3.id
    });

    await UrlsContenido.create({
        id_anime: cont1.id_anime,
        orden: cont1.orden,
        sitio_web: 'animeflv',
        url: 'anime/dragon-ball'
    });

    await UrlsContenido.create({
        id_anime: cont2.id_anime,
        orden: cont2.orden,
        sitio_web: 'animeflv',
        url: 'anime/dragon-ball-z'
    });

    await UrlsContenido.create({
        id_anime: cont3.id_anime,
        orden: cont3.orden,
        sitio_web: 'animeflv',
        url: 'anime/dragon-ball-gt'
    });

    await UrlsContenido.create({
        id_anime: cont3.id_anime,
        orden: cont3.orden,
        sitio_web: 'anime-jl',
        url: 'anime/1298/dragon-ball-daima-latino'
    });
}

export default initBD;