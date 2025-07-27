import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('animes')
export class AnimeEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id!: string;

    @Column({type: 'text', unique: true, name: 'original_title'})
    originalTitle!: string;

    @Column({ type: 'text', nullable: true, name: 'alternative_title' })
    alternativeTitle?: string;

    @Column({ type: 'text', nullable: true, name: 'video_url' })
    videoUrl?: string;

    @Column({ type: 'text', name: 'description' })
    description: string | undefined;

    @Column({ type: 'text', name: 'picture' })
    picture!: string;

    @Column({ type: 'text', name: 'kind' })
    kind!: string;

    @Column({ type: 'int', nullable: true, name: 'amount_episode' })
    amountEpisode?: number;

    @Column({ type: 'text', nullable: true, name: 'company' })
    company?: string;

    @Column({ type: 'text', nullable: true, name: 'format_source' })
    formatSource?: string;

    @Column({ type: 'date', nullable: true, name: 'date_start' })
    dateStart?: Date;

    @Column({ type: 'date', nullable: true, name: 'date_end' })
    dateEnd?: Date;

    @Column({ type: 'float', nullable: true, name: 'rate' })
    rate?: number;

    @Column({ type: 'text', unique: true, nullable: true, name: 'nautiljon_url' })
    nautiljonUrl?: string;

    @Column({ type: 'jsonb', name: 'tags' })
    tags!: string[];

    @Column({ type: 'jsonb', name: 'simulcasts' })
    simulcasts!: string[];

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt!: Date;
}