import _ from "lodash";
import * as fs from 'fs';
import * as cheerio from 'cheerio';
import * as httpm from 'typed-rest-client/HttpClient';

let httpc: httpm.HttpClient = new httpm.HttpClient('manglo');

export async function getMangaList() {
  let res: httpm.HttpClientResponse = await httpc.get('https://www.mangapanda.com/alphabetical');
  let body: string = await res.readBody();
  let dom = cheerio.load(body);
  let nameList = dom('ul.series_alpha > li > a');
  return _.map(nameList, (tag: any) => {
    if (tag.firstChild.data) {
      return { title: tag.firstChild.data.trim(), path: dom(tag).attr('href') };
    }
  });
}

export async function getMangaChapterList(mangaPath: string): Promise<string[]> {
  let regexpChapterNumber = /\/(\d+)$/
  let res: httpm.HttpClientResponse = await httpc.get(`https://www.mangapanda.com${mangaPath}`);
  let body: string = await res.readBody();
  let dom = cheerio.load(body);
  let chapterList = dom('#listing > tbody > tr > td > a');
  return _.compact(_.map(chapterList, (tag) => {
    if (tag) {
      let captured = dom(tag).attr('href').match(regexpChapterNumber);
      if (captured) {
        return captured[1]!;
      }
    }
  }));
}

export async function getPagesList(mangaPath: string, chapterNumber: string): Promise<string[]> {
  let res: httpm.HttpClientResponse = await httpc.get(`https://www.mangapanda.com${mangaPath}/${chapterNumber}`);
  let body: string = await res.readBody();
  let dom = cheerio.load(body);
  let pageList = dom('#pageMenu');
  return _.compact(_.map(pageList.children(), (tag) => {
    if (tag) {
      return dom(tag).text();
    }
  }));
}

export async function getPagesImageUrls(mangaPath: string, chapterNumber: string) {
  let pagesList = await getPagesList(mangaPath, chapterNumber);
  return await Promise.all(pagesList.map(async (pageNumber) => {
    let res: httpm.HttpClientResponse = await httpc.get(`https://www.mangapanda.com${mangaPath}/${chapterNumber}/${pageNumber}`);
    let body: string = await res.readBody();
    let dom = cheerio.load(body);
    return dom('#img').attr('src');
  }));
}

export async function downloadManga(mangaPath: string, chapterList: Array<string>) {
  await Promise.all(chapterList.map(async (chapterNumber) => {
    let urls = await getPagesImageUrls(mangaPath, chapterNumber);
    await Promise.all(urls.map(async (pageUrl, pageNumber) => {
      let file: NodeJS.WritableStream = fs.createWriteStream(`.${mangaPath}_${chapterNumber}_${pageNumber}.jpg`);
      (await httpc.get(pageUrl)).message.pipe(file);
    }));
  }));
}