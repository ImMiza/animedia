import {Collection} from "discord.js";
import {ICommand} from "../../interfaces/commands";
import pingCommand from "./ping.command";
import searchCommand from "./search.command";

export const discordCommands = new Collection<string, ICommand>();

discordCommands.set(pingCommand.data.name, pingCommand);
discordCommands.set(searchCommand.data.name, searchCommand);