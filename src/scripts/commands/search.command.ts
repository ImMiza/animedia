import {AutocompleteInteraction, ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import {ICommand} from "../../interfaces/commands";

const data = new SlashCommandBuilder()
    .setName("search")
    .setDescription("Permet de rechercher dans la bibliothèque nautiljon un animé")
    .addStringOption(option => option
        .setName("type")
        .setDescription("le type de recherche; par titre, etc...")
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addStringOption(option => option
        .setName("name")
        .setDescription("la valeur de la recherche")
        .setRequired(true)
        .setAutocomplete(false)
    );

async function execute(interaction: ChatInputCommandInteraction) {
    const type = interaction.options.getString('type');
    if (type !== "title") {
        //throw error
    }

    await interaction.reply(name ? `Pong ${name}!` : 'Pong!');
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

