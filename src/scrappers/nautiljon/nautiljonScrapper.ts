import {NautiljonData, NautiljonFilters, nautiljonSeason} from "./nautiljonInterface";
import {PuppeteerClient} from "../../configs/puppeteerClient";
import * as cheerio from "cheerio";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export default abstract class NautiljonScrapper {

    private static url: string = "https://www.nautiljon.com";

    private static urlBuilder(
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

        return `${NautiljonScrapper.url}/animes/${season}-${year}.html?y=${trailer}&tri=${sort}&public_averti=${filter}&simulcast=${simulcast}&format=${format}`;
    }

    static async getPageData(season: nautiljonSeason, year: number, options: NautiljonFilters = {
        filter: "all",
        kind: "all",
        sort: "startDate",
        trailer: "all",
        simulcast: "all"
    }): Promise<NautiljonData[]> {

        const url = this.urlBuilder(season, year, options);
        const html = await PuppeteerClient.cl

        const data = await client.get(url);
        const $ = cheerio.load(data);

        return $('.elt').map((_, element) => {
            const $anime = $(element);

            const originalTitle = $anime.find('.title > h2 > a').text().trim();
            const alternativeTitle = $anime.find('.title > p').text().trim();
            const topInfos = $anime.find('.infos_top > .infos > span').not('.border').map((_, el) => $(el).text().trim()).get();
            const tags = $anime.find('.infos_top > .tagsList > a').map((_, el) => $(el).text().trim()).get();
            let videoUrl = $anime.find('a').attr('href')?.trim();
            videoUrl = videoUrl?.startsWith('https://') ? videoUrl : undefined;
            const description = $anime.find('.texte').text().trim();
            const bottomInfos = $anime.find('.infos2 > span').map((_, el) => $(el).text().trim()).get();
            const simulcasts = $anime.find('a > .image > span > img').map((_, el) => $(el).attr('src')).get().map(url => {
                if (url.includes('netflix')) return 'netflix';
                if (url.includes('viki')) return 'viki';
                if (url.includes('adn')) return 'adn';
                if (url.includes('crunchyroll')) return 'crunchyroll';
                if (url.includes('dysneyplus')) return 'dysneyplus';

                return null;
            }).filter(simulcast => simulcast != null);

            const pictureStyle = $anime.find('a > .image').attr('style');
            let picture: string | undefined = undefined;

            if (pictureStyle) {
                const match = pictureStyle.match(/url\((.*?)\)/);
                if (match && match[1]) {
                    picture = match[1].replace(/['"]/g, '');
                }
            }

            let nautiljonUrl = $anime.find(".title > h2 > .bloc_elt_titre").attr("href");
            if (nautiljonUrl) {
                nautiljonUrl = `${NautiljonScrapper.url}${nautiljonUrl}`;
            }
            const daySplit = bottomInfos[0].split(' ');
            return {
                originalTitle,
                alternativeTitle,
                tags,
                videoUrl,
                description,
                simulcasts,
                picture,
                kind: topInfos[0],
                amountEpisode: Number.parseInt(topInfos[1].split(' ')[0]),
                company: topInfos[2],
                formatSource: topInfos[3],
                dateStart: daySplit[0] ? dayjs(daySplit[0], 'DD/MM/YYYY').format('YYYY-MM-DD') : undefined,
                dateEnd: daySplit[2] && daySplit[2] !== "?" ? dayjs(daySplit[2], 'DD/MM/YYYY').format('YYYY-MM-DD') : undefined,
                rate: Number.parseFloat(bottomInfos[1].split('/')[0]),
                nautiljonUrl
            } as unknown as NautiljonData;
        }).get();
    }
}