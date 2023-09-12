"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseProfile = exports.parseAlbumPage = void 0;
const cheerio_1 = require("cheerio");
const parseAlbumPage = (html) => {
    const c = (0, cheerio_1.load)(html);
    const title = c('h1').text();
    const artist = c('.full-width').find('h2.h4').eq(0).text();
    const year = c('.full-width').find('h2.h4').eq(1).text();
    const imgUrl = c('img.album-cover-img').attr('src');
    const summary = c('p.static-album--description--summary').text();
    const shares = [];
    // const reviews = c('#album-reviews')
    //     .find('a.album--review--link')
    //
    // reviews.each((idx) => {
    //     shares.push(reviews.eq(idx).attr('href')!!)
    // })
    const genres = [];
    const genreElements = c(".static-album--meta")
        .find('dd.m-0');
    genreElements.each(idx => {
        genres.push(genreElements.eq(idx).text());
    });
    const avg_rating = parseFloat(c(".static-album--meta").find('div.h4').eq(0).text());
    const nr_of_votes = parseInt(c(".static-album--meta").find('div.h4').eq(1).text(), 10);
    const spotify = c('a[aria-label=Spotify]').attr('href');
    const youtube = c('a[aria-label=Youtube]').attr('href');
    const apple_music = c('a[aria-label*=Apple]').attr('href');
    const wikipedia = c('a[aria-label=Wikipedia]').attr('href');
    return {
        title,
        artist,
        year,
        imgUrl,
        summary,
        genres,
        avg_rating,
        nr_of_votes,
        spotify,
        youtube,
        apple_music,
        wikipedia,
        shares: shares
    };
};
exports.parseAlbumPage = parseAlbumPage;
const parseProfile = (html) => {
    const c = (0, cheerio_1.load)(html);
    const albums = [];
    const reviews = c('#share-page-all-album-reviews')
        .find('.album--review--link');
    reviews.each((idx) => {
        albums.push(reviews.eq(idx).attr('href'));
    });
    return albums;
};
exports.parseProfile = parseProfile;
