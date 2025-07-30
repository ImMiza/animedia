import {AnimeEntity} from "../../entities/animeEntity";
import {AppDataSource} from "../../configs/database";
import dayjs from "dayjs";
import {PuppeteerClient} from "../../configs/puppeteerClient";
import {VoirAnimeData} from "./voirAnimesInterface";
import VoirAnimeScrapper from "./voirAnimeScrapper";

export default abstract class VoirAnimeExecute {

    static async initAllScrapping(): Promise<void> {
        //init db
        let dataSource;
        try {
            dataSource = await AppDataSource.initialize();
        } catch (e) {
            throw new Error(`Error initialize database: ${e}`);
        }

        if (!dataSource.isInitialized) {
            throw new Error(`The data source has not been initialized`);
        }
        const animeRepository = dataSource.getRepository(AnimeEntity);

        if (!PuppeteerClient.isAlreadyInit()) {
            await PuppeteerClient.init({
                executablePath: process.env.EXECUTABLE_PATH,
                delayMinMs: 1250,
                delayMaxMs: 1700
            });
        }

        //init start
        let startYear: number = 2000;

        //while scrap
        let data: VoirAnimeData[] = [];
        console.time('scrapping');
        data = await VoirAnimeScrapper.getPageData(1, { language: 'all' });

        /*
        do {
            for (let i = 0; i < 4; i++) {
                console.log(`====> start scrapping ${startYear} ${seasons[i]}`);
                console.time('loop');

                try {
                    data = await NautiljonScrapper.getPageData(seasons[i], startYear);

                    const chunkSize = 30;
                    for (let i = 0; i < data.length; i += chunkSize) {
                        const batch = data.slice(i, i + chunkSize);

                        const rows = batch.map(a => {
                            const ds = dayjs(a.dateStart);
                            const de = dayjs(a.dateEnd);
                            return {
                                originalTitle: a.originalTitle,
                                alternativeTitle: a.alternativeTitle,
                                videoUrl: a.videoUrl,
                                description: a.description,
                                picture: a.picture,
                                kind: a.kind,
                                amountEpisode: Number.isNaN(a.amountEpisode) ? -1 : a.amountEpisode,
                                company: a.company,
                                formatSource: a.formatSource,
                                dateStart: ds.isValid() ? ds.toDate() : undefined,
                                dateEnd: de.isValid() ? de.toDate() : undefined,
                                rate: Number.isNaN(a.rate) ? -1 : a.rate,
                                nautiljonUrl: a.nautiljonUrl,
                                tags: a.tags,
                                simulcasts: a.simulcasts
                            };
                        });

                        await animeRepository.upsert(rows, {
                            conflictPaths: ['originalTitle'],
                            skipUpdateIfNoValuesChanged: true
                        });

                        console.log(`✓ Upsert batch ${i / chunkSize + 1} (${rows.length} éléments)`);
                    }
                } catch (e) {
                    console.error(e);
                }

                console.log(`${seasons[i]} ${startYear} was scrapped and inserted ==> ${data.length} elements was found`);
                console.timeEnd('loop');
            }
            startYear = startYear + 1;
        } while (data.length > 0);
         */
        console.timeEnd('scrapping');
        await PuppeteerClient.close();
        await dataSource.destroy();
    }
}