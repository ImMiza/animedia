import {
    ActionRowBuilder,
    AutocompleteInteraction, ButtonBuilder,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    ButtonStyle,
    ComponentType
} from "discord.js";
import {ICommand} from "../../interfaces/commands";
import {services} from "../../index";
import {buildAnimeEmbed} from "../../utils/embed";
import {AnimeEntity} from "../../entities/animeEntity";

const data = new SlashCommandBuilder()
    .setName("search")
    .setDescription("Permet de rechercher dans la bibliothèque nautiljon un animé")
    .addStringOption(option => option
        .setName("type")
        .setDescription("le type de recherche; par titre, etc...")
        .setRequired(true)
        .setAutocomplete(false)
        .setChoices(
            { name: 'title', value: 'title' }
        )
    )
    .addStringOption(option => option
        .setName("name")
        .setDescription("la valeur de la recherche")
        .setRequired(true)
        .setAutocomplete(false)
        .setMinLength(1)
        .setMaxLength(512)
    );

async function execute(interaction: ChatInputCommandInteraction) {
    const title = interaction.options.getString('name');
    if (!title) {
        await interaction.reply({ content: 'Titre manquant.' });
        return;
    }

    const results = await services.nautiljon.searchByTitle(title);
    if (results.length === 0) {
        await interaction.reply({ content: 'Aucun animé trouvé.'});
        return;
    }

    const embeds = results.map(r => buildAnimeEmbed(r));
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
        components: [row(false), row2(results[currentIndex])],
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
            components: [row(false), row2(results[currentIndex])]
        });
    });

    collector?.on('end', async () => {
        await interaction.editReply({
            components: [row(true), row2(results[currentIndex])]
        });
    });
}

async function autocomplete(interaction: AutocompleteInteraction): Promise<void> {
    const focused = interaction.options.getFocused(true);

    if (focused.name === "type") {
        const types = ["title"];
        const filtered = types.filter(choice =>
            choice.toLowerCase().startsWith(focused.value.toLowerCase())
        );
        await interaction.respond(filtered.map(opt => ({ name: opt, value: opt })));
        return;
    }

}

export default {data, execute, autocomplete} as ICommand;

