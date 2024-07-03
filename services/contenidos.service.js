import { Contenido as ContenidoClass } from '../../get-anime/get-anime.js';
import ContenidosBD from '../models/Contenidos.js';

import { Op, UniqueConstraintError } from 'sequelize';

import ContenidoEtiquetas from '../models/ContenidoEtiqueta.js';
import Etiquetas from '../models/Etiquetas.js';
import UrlsContenido from '../models/UrlsContenido.js';
import TiposContenido from '../models/TiposContenido.js';

//#region Funciones del Servicio
async function getContenidos(where) {
    try {
        const contenidos = await ContenidosBD.findAll({ where });
        // Usamos Promise.all para esperar a que todas las promesas se resuelvan
        return await Promise.all(contenidos.map(contenido => crearObjeto(contenido)));
    } catch (error) {
        // Aquí puedes manejar el error de alguna manera adecuada
        throw error; // Puedes re-lanzar el error o manejarlo según sea necesario
    }
}

async function getContenidoById(id_anime, orden) {
    try {
        const contenido = await ContenidosBD.findOne({
            where: {
                id_anime,
                orden
            }
        });
        return await crearObjeto(contenido);
    } catch (error) {
        // Aquí puedes manejar el error de alguna manera adecuada
        throw error; // Puedes re-lanzar el error o manejarlo según sea necesario
    }
}

async function postContenido(id_anime, contenido) {
    const contenidoBD = await ContenidosBD.create(await crearJson(id_anime, contenido));

    // Guardamos las etiquetas
    for (let etiqueta of contenido.etiquetas) {
        let e = await Etiquetas.findOne({ where: { nombre: etiqueta }, collate: 'utf8_general_ci' });
        
        if(!e){
            // Si no se encontro la etiqueta, buscamos por similitud
            for (let et of await Etiquetas.findAll()) {
                if (normalizeText(et.nombre).toLowerCase() === normalizeText(etiqueta).toLowerCase()) {
                    e = et;
                    break ;
                }
            }
        }

        if (!e) 
            e = await Etiquetas.create({ nombre: etiqueta });

        try {
            await ContenidoEtiquetas.create({
                id_anime,
                orden: contenido.id,
                id_etiqueta: e.id
            });
        } catch (error) {
            if (error instanceof UniqueConstraintError) continue;
            throw error;
        }
    }

    // Guardamos las urls
    for (let url of contenido.urls) {
        await UrlsContenido.create({
            id_anime,
            orden: contenido.id,
            sitio_web: url.site,
            url: url.url
        });
    }

    return contenidoBD;
}

async function putContenido(id_anime, orden, contenido) {
    // Buscamos el contenido en la BD
    const contenidoBD = await ContenidosBD.findOne({
        where: {
            id_anime,
            orden
        }
    });
    // Si no existe el contenido, retornamos null
    if (!contenidoBD) return null;
    // Actualizamos el contenido
    await contenidoBD.update(await crearJson(id_anime, contenido));

    // Eliminamos las etiquetas que no esten en el contenido
    await ContenidoEtiquetas.destroy({
        where: {
            id_anime,
            orden,
            id_etiqueta: {
                [Op.notIn]: await Etiquetas.findAll({ where: { nombre: {[Op.in]: contenido.etiquetas} }, attributes: ['id'] })
            }
        }
    });

    // Guardamos las etiquetas
    for (let etiqueta of contenido.etiquetas) {
        let e = await Etiquetas.findOne({ where: { nombre: etiqueta } });

        if (!e) e = await Etiquetas.create({ nombre: etiqueta });

        let contE = await ContenidoEtiquetas.findOne({
            where: {
                id_anime,
                orden,
                id_etiqueta: e.id
            }
        });

        if (!contE) 
            await ContenidoEtiquetas.create({
                id_anime,
                orden,
                id_etiqueta: e.id
            });
    }

    // Eliminamos las urls que no esten en el contenido
    await UrlsContenido.destroy({
        where: {
            id_anime,
            orden,
            url: {
                [Op.notIn]: contenido.urls.map(url => url.url)
            }
        }
    });

    // Guardamos las urls
    for (let url of contenido.urls) {
        let u = await UrlsContenido.findOne({
            where: {
                id_anime,
                orden,
                sitio_web: url.site,
                url: url.url
            }
        });

        if (!u)
            await UrlsContenido.create({
                id_anime,
                orden,
                sitio_web: url.site,
                url: url.url
            });
    }

    return contenidoBD;
}

async function deleteContenido(id_anime, orden) {
    // Buscamos el contenido en la BD
    const contenidoBD = await ContenidosBD.findOne({
        where: {
            id_anime,
            orden
        }
    });

    // Si no existe el contenido, retornamos null
    if (!contenidoBD) return null;

    // Eliminamos las etiquetas del contenido
    await ContenidoEtiquetas.destroy({
        where: {
            id_anime,
            orden
        }
    });

    // Eliminamos las urls del contenido
    await UrlsContenido.destroy({
        where: {
            id_anime,
            orden
        }
    });

    // Eliminamos el contenido
    return await contenidoBD.destroy();
}

async function deleteContenidos(id_anime, ordenes) {
    // Eliminamos los contenidos que no esten en el nuevo listado
    const contenidos = await ContenidosBD.findAll({
        where: {
            id_anime,
            orden: {
                [Op.notIn]: ordenes
            }
        }
    });

    for (const contenido of contenidos) {
        await deleteContenido(id_anime, contenido.orden);
    }
}


//#endregion

//#region Funciones Auxiliares
/**
 * Funcion encargada de transformar los datos de la base de datos a un objeto Contenido
 * 
 * @param {JSON} contenido - Contenido de la BD
 * @param {Array<Object>} etiquetas - Lista de etiquetas del contenido [ {nombre} ]
 * @param {Array<Object>} urls - Lista de urls del contenido [ {site, url } ]
 * @returns {ContenidoClass} - Objeto Contenido { id, title, type, enEspanol, enEmision, imagenUrl, altText, etiquetas, urls }
 */
async function crearContenido(contenido, etiquetas, urls) {
    return new ContenidoClass(
        contenido.orden,
        contenido.titulo,
        await TiposContenido.findOne({ where: { id: contenido.tipo } }).then(tipo => tipo.tipo),
        contenido.enEspanol,
        contenido.enEmision,
        contenido.imagen,
        new Set(),
        etiquetas,
        urls
    );
}

/**
 * Funcion encargada de obtener las etiquetas y las urls del contenido y finalmente crearlo.
 * 
 * @param {JSON} contenido - Contenido de la BD
 * @returns {ContenidoClass} - Objeto Contenido { id, title, type, enEspanol, enEmision, imagenUrl, altText, etiquetas, urls }
 */
async function crearObjeto(contenido) {
    if (!contenido) {
        throw new Error('Contenido no encontrado');
    }

    // Obtenemos las etiquetas relacionadas con el contenido
    const etiquetasBD = await ContenidoEtiquetas.findAll({
        where: {
            id_anime: contenido.id_anime,
            orden: contenido.orden
        },
        include: {
            model: Etiquetas,
            as: 'Etiqueta'
        }
    });

    const etiquetas = etiquetasBD.map(ContEt => ContEt.Etiqueta.nombre);

    // Obtenemos las URLs relacionadas con el contenido
    const urlsBD = await UrlsContenido.findAll({
        where: {
            id_anime: contenido.id_anime,
            orden: contenido.orden
        }
    });

    const urls = urlsBD.map(url => ({
        site: url.sitio_web,
        url: url.url
    }));

    // Creamos el objeto Contenido
    return await crearContenido(contenido, etiquetas, urls);
}

/**
 * 
 * @param {Number} id_anime - ID del anime del contenido
 * @param {ContenidoClass} contenido - Contenido a guardar
 * @returns {JSON} - JSON con los datos del contenido { id_anime, orden, titulo, tipo, enEspanol, enEmision, imagen }
 */
async function crearJson(id_anime, contenido) {
    return {
        id_anime,
        orden: contenido.id,
        titulo: contenido.title,
        tipo: await TiposContenido.findOne({ where: { tipo: contenido.type } }).then(tipo => tipo.id),
        enEspanol: contenido.enEspanol,
        enEmision: contenido.enEmision,
        imagen: contenido.imagenUrl,
    };
}

/**
 * Funcion encargada de normalizar un texto
 * 
 * @param {String} text - Texto a normalizar
 * @returns {String} - Texto normalizado { "á" -> "a" }
 */
const normalizeText = (text) => {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
};

//#endregion

export default {
    getContenidos,
    getContenidoById,
    postContenido,
    putContenido,
    deleteContenido,
    deleteContenidos
};