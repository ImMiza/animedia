import {AnimeEntity} from "../entities/animeEntity";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    ComponentType,
    EmbedBuilder
} from "discord.js";

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


export async function buildAndSendCarouselAnimeEmbed(interaction: ChatInputCommandInteraction, animes: AnimeEntity[]) {
    if (animes.length <= 0) {
        await interaction.reply({
            content: "Aucun animé trouvé"
        });
        return;
    }

    const embeds = animes.map(a => buildAnimeEmbed(a));
    let currentIndex = 0;

    const row = (disable: boolean) => new ActionRowBuilder<ButtonBuilder>()
        .addComponents(new ButtonBuilder()
            .setCustomId('start')
            .setLabel('début')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(disable || currentIndex === 0))
        .addComponents(new ButtonBuilder()
            .setCustomId('prev')
            .setLabel('◀️')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(disable || currentIndex === 0))
        .addComponents(new ButtonBuilder()
            .setCustomId('next')
            .setLabel('▶️')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(disable || currentIndex === embeds.length - 1))
        .addComponents(new ButtonBuilder()
            .setCustomId('end')
            .setLabel('fin')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(disable || currentIndex === embeds.length - 1));

    const row2 = (anime: AnimeEntity) => {
        const actions = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(new ButtonBuilder()
                .setLabel('Nautiljon')
                .setStyle(ButtonStyle.Link)
                .setURL(anime.nautiljonUrl)
            )

        if (anime.videoUrl) {
            actions.addComponents(new ButtonBuilder()
                .setLabel('Trailer')
                .setStyle(ButtonStyle.Link)
                .setURL(anime.videoUrl)
            );
        }
        return actions;
    }

    const message = await interaction.reply({
        embeds: [embeds[currentIndex]],
        components: [row(false), row2(animes[currentIndex])],
        withResponse: true
    });

    const collector = message.resource?.message?.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 60_000 * 5,
        filter: (i) => i.user.id === interaction.user.id
    });

    collector?.on('collect', async i => {
        if (i.customId === 'next' && currentIndex < embeds.length - 1) currentIndex = currentIndex + 1;
        else if (i.customId === 'prev' && currentIndex > 0) currentIndex = currentIndex - 1;
        else if (i.customId === 'start' && currentIndex > 0) currentIndex = 0;
        else if (i.customId === 'end' && currentIndex < embeds.length - 1) currentIndex = embeds.length - 1;

        await i.update({
            embeds: [embeds[currentIndex]],
            components: [row(false), row2(animes[currentIndex])]
        });
    });

    collector?.on('end', async () => {
        await interaction.editReply({
            components: [row(true), row2(animes[currentIndex])]
        });
    });
}