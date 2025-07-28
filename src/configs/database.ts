import 'reflect-metadata';
import { DataSource } from 'typeorm';
import {AnimeEntity} from "../entities/animeEntity";

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: Number.parseInt(process.env.DATABASE_PORT ?? '5432'),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_SCHEMA,
    synchronize: false,
    logging: false,
    entities: [AnimeEntity],
});