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
    const reviews = c('#album-reviews')
        .find('a.album--review--link');
    reviews.each((idx) => {
        shares.push(reviews.eq(idx).attr('href'));
    });
    return {
        title,
        artist,
        year,
        imgUrl,
        summary,
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
