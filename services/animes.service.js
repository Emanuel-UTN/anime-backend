import { Anime as AnimeClass, Contenido as ContenidoClass } from '@emanuel-utn/get-anime';
import AnimesBD from '../models-sequelize/Animes.js';

import { Op } from 'sequelize';

import contenidosService from './contenidos.service.js';

//#region Funciones del Servicio

async function getAnimes(where) {
    try {
        const animes = await AnimesBD.findAll({ where });

        return await Promise.all(animes.map(anime => crearObjeto(anime)));
    } catch (error) {
        throw new Error('Animes no encontrados');
    }
}

async function getAnimeById(id) {
    try {
        const anime = await AnimesBD.findOne({ where: { id } });

        return await crearObjeto(anime);
    } catch (error) {
        throw new Error('Anime no encontrado');
    }
}

async function postAnime(anime) {
    const animeBD = await AnimesBD.create(crearJSON(anime));

    // Guardamos los contenidos
    await anime.contenidos.forEach(async contenido => {
        await contenidosService.postContenido(anime.id, contenido);
    });

    return animeBD;
}

async function putAnime(anime) {
    // Buscamos el anime en la BD
    const animeBD = await AnimesBD.findOne({ where: { id: anime.id } });

    if (!animeBD) throw new Error('Anime no encontrado');

    // Actualizamos los datos
    await animeBD.update(crearJSON(anime));

    // Eliminamos los contenidos que no esten en el nuevo listado
    await contenidosService.deleteContenidos(anime.id, anime.contenidos.map(contenido => contenido.id));

    // Actualizamos los contenidos
    await anime.contenidos.forEach(async contenido => {
        await contenidosService.putContenido(anime.id, contenido);
    });

    return animeBD;
}

async function deleteAnime(id) {
    const anime = await AnimesBD.findOne({ where: { id } });

    if (!anime) throw new Error('Anime no encontrado');

    // Elimina los contenidos asociados al anime
    await contenidosService.deleteContenidos(id, []);

    console.log('Eliminando anime')

    // Ahora puedes eliminar el anime
    await anime.destroy();

    return anime;
}

//#endregion

//#region Funciones Auxiliares

/**
 * Funcion encargada de transformar los datos de la base de datos a un objeto Anime
 * 
 * @param {JSON} anime - Anime de la BD
 * @param {Array<ContenidoClass>} contenidos  - Lista de contenidos del anime [ { id, title, type, enEspanol, enEmision, imagenUrl, altText, etiquetas, urls } ]
 * @returns {AnimeClass} - Objeto Anime { id, title, type, enEmision, contenidos }
 */
function crearAnime(anime, contenidos) {
    return new AnimeClass(
        anime.id,
        anime.titulo,
        anime.tipo,
        anime.enEmision,
        contenidos
    )
}

/**
 * Funcion encargada de obtener los contenidos del anime y finalmente crearlo.
 * 
 * @param {JSON} anime 
 * @returns {AnimeClass} - Objeto Anime { id, title, type, enEmision, contenidos }
 */
async function crearObjeto(anime) {
    const contenidos = await contenidosService.getContenidos( { id_anime: anime.id });

    return crearAnime(anime, contenidos);
}

/**
 * Funcion encargada de crear un JSON con los datos del anime
 * 
 * @param {AnimeClass} anime - Anime de la BD
 * @returns {JSON} - JSON { id, titulo, tipo, enEmision }
 */
function crearJSON(anime) {
    return {
        id: anime.id,
        titulo: anime.title,
        tipo: anime.type,
        enEmision: anime.enEmision
    }
}
//#endregion

export default {
    getAnimes,
    getAnimeById,
    postAnime,
    putAnime,
    deleteAnime
};