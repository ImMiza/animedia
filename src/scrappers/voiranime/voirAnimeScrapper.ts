import {PuppeteerClient} from "../../configs/puppeteerClient";
import * as cheerio from "cheerio";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {VoirAnimeData, VoirAnimeFilters} from "./voirAnimesInterface";

dayjs.extend(customParseFormat);

export default abstract class VoirAnimeScrapper {

    private static url: string = "https://v6.voiranime.com";

    private static urlBuilder(
        page: number,
        options: VoirAnimeFilters
    ): string {
        const languageMap: Record<string, string> = {
            vf: "dubbed",
            vostfr: "subbed",
            all: "all"
        };
        const language = languageMap[options.language] ?? languageMap.all;

        return `${VoirAnimeScrapper.url}/page/${page}?filter=${language}`;
    }

    static async getPageData(page: number,
                             options: VoirAnimeFilters): Promise<VoirAnimeData[]> {
        const url = this.urlBuilder(page, options);
        const data = await PuppeteerClient.get(url);
        const $ = cheerio.load(data);

        const animes: VoirAnimeData[] = [];

        $('#loop-content > .page-listing-item').each((i, content) => {
            $(content).find('.row > .badge-pos-1').each((j, element) => {
                const $anime = $(element).find('.page-item-detail');


                const title = $anime.find('.item-summary > .post-title > h3 > a').text().replace('(VF)', '').trim();
                const url = $anime.find('.item-summary > .post-title > h3 > a').attr('href')?.trim();
                const rate = $anime.find('.item-summary > .rating > .allow_vote > .score').text().trim();
                const picture = $anime.find('.c-image-hover > a > img').attr('src')?.trim();
                const language = $anime.find('.c-image-hover > a > .manga-vf-flag').text()
                const lastEpisode = $anime.find('.item-summary > .list-chapter > .chapter-item:nth-of-type(1) > .chapter > a').text().trim();

                console.log({
                    title,
                    url,
                    rate: Number(rate),
                    picture,
                    language: language.trim().length > 0 ? language.toUpperCase() : 'VOSTFR',
                    lastEpisode: Number(lastEpisode),
                });
            });
        });

        return animes;
    }
}