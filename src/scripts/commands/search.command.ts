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
import {buildAndSendCarouselAnimeEmbed, buildAnimeEmbed} from "../../utils/embed";
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

    await buildAndSendCarouselAnimeEmbed(interaction, results);
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

