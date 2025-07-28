import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('animes_nautiljon')
export class AnimeEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id!: string;

    @Column({type: 'varchar', length: 256, unique: true, name: 'original_title'})
    originalTitle!: string;

    @Column({ type: 'varchar', length: 256, nullable: true, name: 'alternative_title' })
    alternativeTitle?: string;

    @Column({ type: 'varchar', length: 256, nullable: true, name: 'video_url' })
    videoUrl?: string;

    @Column({ type: 'text', name: 'description' })
    description!: string;

    @Column({ type: 'varchar', length: 512, name: 'picture' })
    picture!: string;

    @Column({ type: 'varchar', length: 64, name: 'kind' })
    kind!: string;

    @Column({ type: 'int', nullable: true, name: 'amount_episode' })
    amountEpisode?: number;

    @Column({ type: 'varchar', length: 32, nullable: true, name: 'company' })
    company?: string;

    @Column({ type: 'varchar', length: 32, nullable: true, name: 'format_source' })
    formatSource?: string;

    @Column({ type: 'date', nullable: true, name: 'date_start' })
    dateStart?: Date;

    @Column({ type: 'date', nullable: true, name: 'date_end' })
    dateEnd?: Date;

    @Column({ type: 'float', nullable: true, name: 'rate' })
    rate?: number;

    @Column({ type: 'varchar', length: 512, unique: true, name: 'nautiljon_url' })
    nautiljonUrl!: string;

    @Column({ type: 'jsonb', name: 'tags' })
    tags!: string[];

    @Column({ type: 'jsonb', name: 'simulcasts' })
    simulcasts!: string[];

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt!: Date;
}