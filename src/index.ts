import { writeFileSync, readFileSync } from 'fs'
import { get } from 'request-promise';
import {parseAlbumPage, parseProfile} from './parsers'

const baseUrl = 'https://1001albumsgenerator.com'
const albums = new Set(['/albums/1JXGJdo7Go4D2fipqXwt4q/swordfishtrombones'])
const profiles = new Set()

const iterate = async () => {
    for (const album of albums) {
        const { shares } = parseAlbumPage(await get(`${baseUrl}${album}`))
        shares.forEach(share => profiles.add(share))
        console.log(`Updated profiles, currently found ${profiles.size} profiles`)
    }

    for (const profile of profiles) {
        const nextAlbums = parseProfile(await get(`${baseUrl}${profile}`))
        nextAlbums.forEach(album => albums.add(album))
        console.log(`Updated albums, currently found ${albums.size} albums`)
    }
}

const scrapeAlbums = async () => {
    let previousAlbumsSize = 0

    while (previousAlbumsSize !== albums.size) {
        previousAlbumsSize = albums.size
        await iterate()

        console.log(`Found ${albums.size} albums, writing to file...`)
        writeFileSync('album-urls.json', JSON.stringify([...albums]));

        console.log(`Found ${profiles.size} profiles, writing to profiles.json`)
        writeFileSync('profiles.json', JSON.stringify([...profiles]))
    }
}

const mapAlbums = async () => {
    const paths : string[] = JSON.parse(readFileSync('album-urls.json', ).toString())
    const albums = [];
    const failed = [];

    for (const path of paths) {
        try {
            const {shares, ...rest} = parseAlbumPage(await get(`${baseUrl}${path}`))

            albums.push(rest)
            console.log('success', path)
        } catch {
            failed.push(path)
            console.log('failed', path)
        }
    }

    console.log('albums...', albums)
    writeFileSync('album-data.json', JSON.stringify(albums, null, 4))
    writeFileSync('failed.json', JSON.stringify(failed, null, 4))
}

mapAlbums()