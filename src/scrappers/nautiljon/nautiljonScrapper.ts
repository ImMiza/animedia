import {NautiljonData, NautiljonFilters, nautiljonSeason} from "./nautiljonInterface";
import {PuppeteerClient} from "../../configs/puppeteerClient";
import * as cheerio from "cheerio";

export default class NautiljonScrapper {

    private static url: string = "https://www.nautiljon.com";

    private urlBuilder(
        season: nautiljonSeason,
        year: number,
        options: NautiljonFilters
    ): string {
        const kindMap: Record<string, string> = {
            movies: "2",
            series: "1",
            unknown: "10",
            all: "0"
        };

        const trailerMap: Record<string, string> = {
            all: "0",
            withOnly: "1",
            withoutOnly: "2"
        };

        const sortMap: Record<string, string> = {
            popularity: "p",
            startDate: "0"
        };

        const filterMap: Record<string, string> = {
            all: "0",
            withoutAdultContent: "1",
            onlyAdultContent: "2"
        };

        const simulcastMap: Record<string, string> = {
            all: "",
            crunchyroll: "crunchyroll",
            disneyplus: "disneyplus",
            netflix: "netflix",
            viki: "viki",
            adn: "adn"
        };

        const format = kindMap[options.kind] ?? kindMap.all;
        const trailer = trailerMap[options.trailer] ?? trailerMap.all;
        const sort = sortMap[options.sort] ?? sortMap.startDate;
        const filter = filterMap[options.filter] ?? filterMap.all;
        const simulcast = simulcastMap[options.simulcast] ?? "";

        return `${NautiljonScrapper.url}/animes/${season}-${year}.html?y=${trailer}&tri=${sort}&public_averti=${filter}&simulcast=${simulcast}`;
    }

    async getPageData(season: nautiljonSeason, year: number, options: NautiljonFilters = {
        filter: "all",
        kind: "all",
        sort: "startDate",
        trailer: "all",
        simulcast: "all"
    }): Promise<NautiljonData[]> {

        const url = this.urlBuilder(season, year, options);
        console.log(url);
        const client = new PuppeteerClient();

        const data = await client.get(url);
        const $ = cheerio.load(data);

        const animes = $('.elt').each((_, element) => {
            const $anime = $(element);

            const originalTitle = $anime.find('.title > h2 > a').text().trim();
            const alternativeTitle = $anime.find('.title > p').text().trim();

            const topInfos = $anime.find('.infos_top > .infos > span').not('.border').map((_, el) => $(el).text().trim()).get();

            const tags = $anime.find('.infos_top > .tagsList > a').map((_, el) => $(el).text().trim()).get();

            let videoUrl = $anime.find('a').attr('href')?.trim();
            videoUrl = videoUrl?.startsWith('https://') ? videoUrl : undefined;

            const description = $anime.find('.texte').text().trim();

            const bottomInfos = $anime.find('.infos2 > span').
        });
        return [];
    }
}