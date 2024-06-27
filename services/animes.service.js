import { Anime as AnimeClass, Contenido as ContenidoClass, getAnime, updateAnime } from '@emanuel-utn/get-anime';
import AnimesBD from '../models-sequelize/Animes.js';

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
    if (!anime.nombre) {
        if (await AnimesBD.findOne({ where: { titulo: anime.title } })) throw new Error('Anime ya existe');

        const animeBD = await AnimesBD.create({ titulo: anime.title, tipo: anime.type, enEmision: anime.enEmision });

        // Guardamos los contenidos
        for (let i in anime.contenidos) {
            anime.contenidos[i].id = i;
            await contenidosService.postContenido(animeBD.id, anime.contenidos[i]);
        }
        
        return animeBD;
    } else {
        let nuevoAnime = await AnimesBD.findOne({ where: { titulo: anime.nombre } });

        if (nuevoAnime) throw new Error('Anime ya existe');

        nuevoAnime = await getAnime(anime.nombre);

        return nuevoAnime;
    }
}

async function putAnime(id, anime) {
    // Buscamos el anime en la BD
    const animeBD = await AnimesBD.findOne({ where: { id } });

    if (!animeBD) throw new Error('Anime no encontrado');

    // Actualizamos los datos
    await animeBD.update(crearJSON(anime));

    // Eliminamos los contenidos que no esten en el nuevo listado
    await contenidosService.deleteContenidos(id, anime.contenidos.map(contenido => contenido.id));

    // Actualizamos los contenidos
    for (let contenido of anime.contenidos) {
        await contenidosService.putContenido(id, contenido.id, contenido);
    }

    return animeBD;
}

async function deleteAnime(id) {
    const anime = await AnimesBD.findOne({ where: { id } });

    if (!anime) throw new Error('Anime no encontrado');

    // Elimina los contenidos asociados al anime
    await contenidosService.deleteContenidos(id, []);

    // Ahora puedes eliminar el anime
    await anime.destroy();

    return anime;
}

async function updateAnimes() {
    const animes = await AnimesBD.findAll();

    for (let anime of animes) {
        const animeActualizado = await crearObjeto(anime)
            .then(async (anime) => await updateAnime(anime))
            .catch((error) => console.log(error));

        if (!animeActualizado) continue;

        await putAnime(anime.id, animeActualizado);
    }
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
    deleteAnime,
    updateAnimes
};