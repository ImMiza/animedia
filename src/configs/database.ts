import 'reflect-metadata';
import { DataSource } from 'typeorm';
import {AnimeEntity} from "../entities/animeEntity";

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'Bleu1501',
    database: 'postgres',
    synchronize: false,
    logging: false,
    entities: [AnimeEntity],
});