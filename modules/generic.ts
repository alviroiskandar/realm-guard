import { Command, ContextDefault, UserInfo } from "../types/type";
import * as fs from "fs";

const startString = `<b>Realm Guard's here at your service!</b>

<i>Please note that this bot is still in development, and may not work as expected.</i>
Use /help to see a list of commands.

If you have any questions, please contact @lappretard.
`;

const helpString = `<b>Realm Guard Help</b>
  /start - Start Realm Guard
  /help - Show this help message
  /ping - Check if Realm Guard is online
  /version - Show Realm Guard's version

<b>Realm Guard Admin Commands</b>
  /ban <id|reply> - Ban a user from the group
  /sban <id|reply> - Ban a user from the group silently
  /tban <id|reply> <time> - Temporarily ban a user from the group
  /unban - Unban a user from the group
  /kick - Kick a user from the group
  /mute <id|reply> - Mute a user in the group
  /tmute <id|reply> <time> - Temporarily mute a user in the group
  /unmute - Unmute a user in the group
  /warn - Warn a user in the group
  /unwarn - Unwarn a user in the group
  /purge - Purge messages from the group
  /setwelcome - Set the welcome message for the group
  /getwelcome - Get the welcome message for the group
  /resetwelcome - Reset the welcome message for the group
  /setfarewell - Set the farewell message for the group
  /getfarewell - Get the farewell message for the group
  /resetfarewell - Reset the farewell message for the group
  /resetgreets - Reset the welcome and farewell messages for the group
  /pin - Pin a message in the group
  /unpin - Unpin a message in the group

<b>Realm Guard User Commands</b>
  /warns - Show your warns in the group
  /report - Report a user in the group
  /donate - Donate to help support development`;

const versionString = `<b>Realm Guard</b> v0.0.1-alpha
Node Version: ${process.version}
Telegraf Version: 4.11.2`;

const userString = `<b>User Info</b>
<b>First Name:</b> {{first_name}} {{last_name}}
<b>Username:</b> {{username}}
<b>ID:</b> {{id}}
<b>Is Bot:</b> {{is_bot}}
<b>Is Admin:</b> {{is_admin}}`;

export const startCommand: Command = {
    command: "start",
    function: async (ctx) => {
        await ctx.replyWithHTML(startString);
    },
};

export const pingCommand: Command = {
    command: "ping",
    function: async (ctx) => {
        await ctx.replyWithHTML(
            `<b>Pong!</b> ${Date.now() - ctx.message.date * 1000}ms`
        );
    },
};

export const versionCommand: Command = {
    command: "version",
    function: async (ctx) => {
        await ctx.replyWithHTML(versionString);
    },
};

export const helpCommand: Command = {
    command: "help",
    function: async (ctx) => {
        await ctx.replyWithHTML(helpString);
    },
};

export const printUserInfoCommand: Command = {
    command: "user",
    function: async (ctx) => {
        if (ctx.message.reply_to_message) {
            const user = await ctx.telegram.getChatMember(
                ctx.chat.id,
                ctx.message.from.id
            );
            await printChatString(ctx, {
                firstName: ctx.message.reply_to_message.from?.first_name!,
                lastName: ctx.message.reply_to_message.from?.last_name!,
                username: ctx.message.reply_to_message.from?.username!,
                id: String(ctx.message.reply_to_message.from?.id!),
                isBot: ctx.message.reply_to_message.from?.is_bot!,
                isAdmin: user.status,
            });
        } else if (ctx.message.from) {
            const user = await ctx.telegram.getChatMember(
                ctx.chat.id,
                ctx.message.from.id
            );
            await printChatString(ctx, {
                firstName: ctx.message.from.first_name!,
                lastName: ctx.message.from.last_name!,
                username: ctx.message.from.username!,
                id: String(ctx.message.from.id!),
                isBot: ctx.message.from.is_bot!,
                isAdmin: user.status,
            });
        } else if (!isNaN(Number(ctx.message.text?.split(" ")[1]))) {
            const user = await ctx.telegram.getChatMember(
                ctx.chat.id,
                Number(ctx.message.text?.split(" ")[1])
            );

            await printChatString(ctx, {
                firstName: user.user?.first_name!,
                lastName: user.user?.last_name!,
                username: user.user?.username!,
                id: String(user.user?.id!),
                isBot: user.user?.is_bot!,
                isAdmin: user.status,
            });
        }
    },
};

async function printChatString(ctx: ContextDefault, vars: UserInfo) {
    await ctx.replyWithHTML(
        userString
            .replace("{{first_name}}", vars.firstName)
            .replace(
                "{{last_name}}",
                vars.lastName ? `\n<b>Last Name:</b> ${vars.lastName}` : ""
            )
            .replace("{{username}}", vars.username)
            .replace("{{id}}", String(vars.id))
            .replace("{{is_bot}}", vars.isBot ? "Yes" : "No")
            .replace(
                "{{is_admin}}",
                vars.isAdmin === "administrator" || vars.isAdmin === "creator"
                    ? "Yes"
                    : "No"
            )
    );
}

export function timeToSecond(time: string) {
    if (time.endsWith("s")) {
        return Number(time.slice(0, -1));
    } else if (time.endsWith("m")) {
        return Number(time.slice(0, -1)) * 60;
    } else if (time.endsWith("h")) {
        return Number(time.slice(0, -1)) * 60 * 60;
    } else if (time.endsWith("d")) {
        return Number(time.slice(0, -1)) * 60 * 60 * 24;
    } else if (time.endsWith("w")) {
        return Number(time.slice(0, -1)) * 60 * 60 * 24 * 7;
    } else if (time.endsWith("mo")) {
        return Number(time.slice(0, -2)) * 60 * 60 * 24 * 30;
    } else if (time.endsWith("y")) {
        return Number(time.slice(0, -1)) * 60 * 60 * 24 * 365;
    } else {
        return 0;
    }
}

export const replyToMsgId = async function (
    ctx: any,
    text: string,
    msg_id: number
) {
    await ctx.reply({
        text: text,
        reply_to_message_id: msg_id,
    });
};

export const getStorageDir = function () {
    let ret = process.env?.STORAGE_DIR;

    if (!ret) ret = "dist/data/";

    /*
     * Make sure the storage dir exists.
     * If not, create it.
     */
    if (!fs.existsSync(ret)) fs.mkdirSync(ret);

    return ret;
};
