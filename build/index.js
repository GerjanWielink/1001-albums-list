"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const request_promise_1 = require("request-promise");
const parsers_1 = require("./parsers");
const baseUrl = 'https://1001albumsgenerator.com';
const iterate = () => __awaiter(void 0, void 0, void 0, function* () {
    for (const album of albums) {
        const { shares } = (0, parsers_1.parseAlbumPage)(yield (0, request_promise_1.get)(`${baseUrl}${album}`));
        shares.forEach(share => profiles.add(share));
        console.log(`Updated profiles, currently found ${profiles.size} profiles`);
    }
    for (const profile of profiles) {
        const nextAlbums = (0, parsers_1.parseProfile)(yield (0, request_promise_1.get)(`${baseUrl}${profile}`));
        nextAlbums.forEach(album => albums.add(album));
        console.log(`Updated albums, currently found ${albums.size} albums`);
    }
});
const scrapeAlbums = () => __awaiter(void 0, void 0, void 0, function* () {
    const albums = new Set(['/albums/1JXGJdo7Go4D2fipqXwt4q/swordfishtrombones']);
    const profiles = new Set();
    let previousAlbumsSize = 0;
    while (previousAlbumsSize !== albums.size) {
        previousAlbumsSize = albums.size;
        yield iterate();
        console.log(`Found ${albums.size} albums, writing to file...`);
        (0, fs_1.writeFileSync)('album-urls.json', JSON.stringify([...albums]));
        console.log(`Found ${profiles.size} profiles, writing to profiles.json`);
        (0, fs_1.writeFileSync)('profiles.json', JSON.stringify([...profiles]));
    }
});
const mapAlbums = () => __awaiter(void 0, void 0, void 0, function* () {
    const paths = JSON.parse((0, fs_1.readFileSync)('album-urls.json').toString());
    const albums = [];
    const failed = [];
    for (const path of paths) {
        try {
            const _a = (0, parsers_1.parseAlbumPage)(yield (0, request_promise_1.get)(`${baseUrl}${path}`)), { shares } = _a, rest = __rest(_a, ["shares"]);
            albums.push(rest);
            console.log('success', path);
        }
        catch (_b) {
            failed.push(path);
            console.log('failed', path);
        }
    }
    console.log('albums...', albums);
    (0, fs_1.writeFileSync)('album-data.json', JSON.stringify(albums, null, 4));
    (0, fs_1.writeFileSync)('failed.json', JSON.stringify(failed, null, 4));
});
mapAlbums();
