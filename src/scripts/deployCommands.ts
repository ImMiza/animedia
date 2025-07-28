import {
    Collection,
    REST,
    Routes,
} from 'discord.js';
import dotenv from 'dotenv'
import {discordCommands} from "./commands/commandManager";
dotenv.config({ path: 'src/.env' });

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

(async () => {
    try {
        console.log('📥 Enregistrement des slash commands...');
        await rest.put(
            Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID!, process.env.DISCORD_GUILD_ID!),
            { body: Array.from(discordCommands.values()).map(cmd =>
                    cmd.data.toJSON(),
                )}
        );

        /*
        //todo faire mise en prod et dev
        await rest.put(
            Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!),
            { body: Array.from(discordCommands.values()).map(cmd =>
                    cmd.data.toJSON(),
                )}
        );
         */
        console.log('✅ Commandes enregistrées.');
    } catch (error) {
        console.error('Erreur deployment commands:', error);
    }
})();
