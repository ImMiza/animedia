import {DataSource, Repository} from "typeorm";
import {AnimeEntity} from "../entities/animeEntity";

export default class NautiljonService {

    private readonly animeRepository: Repository<AnimeEntity>;

    constructor(private readonly data: DataSource) {
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

}