import {DataSource, Repository} from "typeorm";
import {AnimeEntity} from "../entities/animeEntity";

export default class NautiljonService {

    private readonly animeRepository: Repository<AnimeEntity>;
    private readonly datasource: DataSource;

    constructor(private readonly data: DataSource) {
        this.datasource = data;
        this.animeRepository = data.getRepository(AnimeEntity);
    }

    async searchByTitle(title: string): Promise<AnimeEntity[]> {
        return await this.animeRepository
            .createQueryBuilder('a')
            .addSelect(`
            GREATEST(
                similarity(a.originalTitle, :title),
                similarity(a.alternativeTitle, :title)
            )`, 'score')
            .where(`
            GREATEST(
                similarity(a.originalTitle, :title),
                similarity(a.alternativeTitle, :title)
            ) > 0.1
        `)
            .orderBy('score', 'DESC')
            .limit(10)
            .setParameter('title', title)
            .getMany();
    }

    async getAllKindTags(): Promise<string[]> {
        const result = await this.datasource.query(`
        SELECT DISTINCT TRIM(value) AS genre
        FROM animes_nautiljon,
        LATERAL jsonb_array_elements_text(tags) AS tag(value)
        ORDER BY genre;
    `);

        return result.map((r: { genre: string }) => r.genre);
    }

}