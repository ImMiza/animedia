import {AutocompleteInteraction, ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import {ICommand} from "../../interfaces/commands";

const data = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Une commande classique qui répond pong (updated)")
    .addStringOption(option => option
        .setName("name")
        .setDescription("le nom de la personne")
        .setRequired(false)
        .setAutocomplete(true)
    );

async function execute(interaction: ChatInputCommandInteraction) {
    const name = interaction.options.getString('name');
    await interaction.reply(name ? `Pong ${name}!` : 'Pong!');
}

async function autocomplete(interaction: AutocompleteInteraction): Promise<void> {
    const focused = interaction.options.getFocused();
    const choices = ['Alice', 'Bob', 'Charlie', 'David'];
    const filtered = choices.filter(choice =>
        choice.toLowerCase().startsWith((focused as string).toLowerCase())
    ).slice(0, 25);

    await interaction.respond(
        filtered.map(name => ({ name, value: name }))
    );
}

export default {data, execute, autocomplete} as ICommand;
