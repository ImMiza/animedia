import {AnimeEntity} from "../entities/animeEntity";
import {EmbedBuilder} from "discord.js";

export function buildAnimeEmbed(anime: AnimeEntity) {
    return new EmbedBuilder()
        .setTitle(anime.originalTitle)
        .setURL(anime.nautiljonUrl)
        .setDescription(anime.description || 'Aucune description.')
        .setThumbnail(anime.picture)
        .addFields(
            { name: 'Titre alternatif', value: anime.alternativeTitle || 'N/A', inline: true },
            { name: 'Type', value: anime.kind, inline: true },
            { name: 'Episodes', value: anime.amountEpisode?.toString() || 'Inconnu', inline: true },
            { name: 'Studio', value: anime.company || 'N/A', inline: true },
            { name: 'Format', value: anime.formatSource || 'N/A', inline: true },
            { name: 'Diffusion', value: `${anime.dateStart?.toString() || '?'} → ${anime.dateEnd?.toString() || '?'}`, inline: true },
            { name: 'Note', value: anime.rate?.toFixed(2) || 'Non noté', inline: true },
            { name: 'Simulcasts', value: anime.simulcasts.join(', ') || 'Aucun', inline: false },
            { name: 'Tags', value: anime.tags.join(', '), inline: false }
        )
        .setColor(0x1e90ff)
        .setFooter({ text: `ID: ${anime.id}` });
}