import dotenv from 'dotenv'
import path from 'path';
import 'dotenv/config';
import {Client, GatewayIntentBits, Events, MessageFlags} from 'discord.js';
import {discordCommands} from "./scripts/commands/commandManager";
import InitService from "./services/init.service";
import {AppDataSource} from "./configs/database";

dotenv.config({path: path.resolve(__dirname, '.env')});

export let services: InitService;

AppDataSource.initialize().then((datasource) => {
    services = new InitService(datasource);
})
    .catch((err) => {
        console.log(err);
        process.exit(1);
    })


const client = new Client({intents: [GatewayIntentBits.Guilds]});

client.once(Events.ClientReady, ready => {
    console.log(`✅ Connecté en tant que ${ready.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isAutocomplete()) {
        const command = discordCommands.get(interaction.commandName);
        if (!command?.autocomplete) return;
        try {
            await command.autocomplete(interaction);
        } catch (error) {
            console.error('Erreur autocomplete:', error);
        }
        return;
    }

    if (!interaction.isChatInputCommand()) return;
    const command = discordCommands.get(interaction.commandName);
    if (!command) {
        console.error(`Commande non trouvée : ${interaction.commandName}`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error('Erreur exécution commande:', error);
        const replyData = {content: '⚠️ Une erreur est survenue.'};
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(replyData);
        } else {
            await interaction.reply(replyData);
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
