import { Contenido as ContenidoClass } from '@emanuel-utn/get-anime';
import ContenidosBD from '../models-sequelize/Contenidos.js';

import { Op } from 'sequelize';

import ContenidoEtiquetas from '../models-sequelize/ContenidoEtiqueta.js';
import Etiquetas from '../models-sequelize/Etiquetas.js';
import UrlsContenido from '../models-sequelize/UrlsContenido.js';
import TiposContenido from '../models-sequelize/TiposContenido.js';

//#region Funciones del Servicio
async function getContenidos(where) {
    const contenidos = await ContenidosBD.findAll({ where });

    // Usamos Promise.all para esperar a que todas las promesas se resuelvan
    return await Promise.all(contenidos.map(contenido => crearObjeto(contenido)));
}

async function getContenidoById(id_anime, orden) {
    const contenido = await ContenidosBD.findOne({
        where: {
            id_anime,
            orden
        }
    });

    return await crearObjeto(contenido);
}

async function postContenido(id_anime, contenido) {
    const contenidoBD = await ContenidosBD.create(await crearJson(id_anime, contenido));

    // Guardamos las etiquetas
    await contenido.etiquetas.forEach(async etiqueta => {
        let e = await Etiquetas.findOne({ where: { nombre: etiqueta } });

        if (!e) e = await Etiquetas.create({ nombre: etiqueta });

        await ContenidoEtiquetas.create({
            id_anime,
            orden: contenido.id,
            id_etiqueta: e.id
        });
    });

    // Guardamos las urls
    await contenido.urls.forEach(async url => {
        await UrlsContenido.create({
            id_anime,
            orden: contenido.id,
            sitio_web: url.site,
            url: url.url
        });
    });

    return contenidoBD;
}

async function putContenido(id_anime, contenido) {
    // Buscamos el contenido en la BD
    const contenidoBD = await ContenidosBD.findOne({
        where: {
            id_anime,
            orden: contenido.id
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
            orden: contenido.id,
            id_etiqueta: {
                [Op.notIn]: await Etiquetas.findAll({ where: { nombre: {[Op.in]: contenido.etiquetas} }, attributes: ['id'] })
            }
        }
    });

    // Guardamos las etiquetas
    await contenido.etiquetas.forEach(async etiqueta => {
        let e = await Etiquetas.findOne({ where: { nombre: etiqueta } });

        if (!e) e = await Etiquetas.create({ nombre: etiqueta });

        let contE = await ContenidoEtiquetas.findOne({
            where: {
                id_anime,
                orden: contenido.id,
                id_etiqueta: e.id
            }
        });

        if (!contE) 
            await ContenidoEtiquetas.create({
                id_anime,
                orden: contenido.id,
                id_etiqueta: e.id
            });
    });

    // Eliminamos las urls que no esten en el contenido
    await UrlsContenido.destroy({
        where: {
            id_anime,
            orden: contenido.id,
            url: {
                [Op.notIn]: contenido.urls.map(url => url.url)
            }
        }
    });

    // Guardamos las urls
    await contenido.urls.forEach(async url => {
        let u = await UrlsContenido.findOne({
            where: {
                id_anime,
                orden: contenido.id,
                sitio_web: url.site,
                url: url.url
            }
        });

        if (!u)
            await UrlsContenido.create({
                id_anime,
                orden: contenido.id,
                sitio_web: url.site,
                url: url.url
            });
    });
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
    await contenidoBD.destroy();
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

//#endregion

export default {
    getContenidos,
    getContenidoById,
    postContenido,
    putContenido,
    deleteContenido,
    deleteContenidos
};