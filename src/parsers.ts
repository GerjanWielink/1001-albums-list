import {load} from "cheerio";

export const parseAlbumPage = (html: string) => {
    const c = load(html)

    const title = c('h1').text()
    const artist = c('.full-width').find('h2.h4').eq(0).text()
    const year = c('.full-width').find('h2.h4').eq(1).text()
    const imgUrl = c('img.album-cover-img').attr('src')
    const summary = c('p.static-album--description--summary').text()

    const shares : string[] = []
    const reviews = c('#album-reviews')
        .find('a.album--review--link')

    reviews.each((idx) => {
        shares.push(reviews.eq(idx).attr('href')!!)
    })



    return {
        title,
        artist,
        year,
        imgUrl,
        summary,
        shares: shares

    }
}

export const parseProfile = (html: string) => {
    const c = load(html);

    const albums : string[] = []
    const reviews = c('#share-page-all-album-reviews')
        .find('.album--review--link')

    reviews.each((idx) => {
        albums.push(reviews.eq(idx).attr('href')!!)
    })

    return albums
}