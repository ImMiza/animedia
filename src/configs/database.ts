import 'reflect-metadata';
import { DataSource } from 'typeorm';
import {AnimeEntity} from "../entities/animeEntity";
import dotenv from "dotenv";

dotenv.config({ path: 'src/.env' });

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: String(process.env.DATABASE_HOST),
    port: Number.parseInt(process.env.DATABASE_PORT ?? '5432'),
    username: String(process.env.DATABASE_USERNAME),
    password: String(process.env.DATABASE_PASSWORD),
    database: String(process.env.DATABASE_SCHEMA),
    synchronize: false,
    logging: false,
    entities: [AnimeEntity],
});