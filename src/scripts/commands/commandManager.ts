import {Collection} from "discord.js";
import {ICommand} from "../../interfaces/commands";
import pingCommand from "./ping.command";

export const discordCommands = new Collection<string, ICommand>();

discordCommands.set(pingCommand.data.name, pingCommand);