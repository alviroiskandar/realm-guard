import { Command } from "../../types/type";
import { validateRequest } from "../validation";
import { extract_kick_query } from "./kick";
import { timeToSecond } from "../generic";

const basic_ban_cmd_rules = [
        "in_supergroup",
        "user_is_admin",
        "bot_is_admin",
        "noreply_admin",
];

async function do_ban(ctx: any, user: any)
{
        await ctx.telegram.banChatMember(ctx.chat.id, user.id);
}

async function send_ban_cmd_usage(ctx: any)
{
        const r =
                `<b>/ban</b> command usage:\n` +
                `<code>/ban</code> (must reply)\n` +
                `<code>/ban [reason]</code> (must reply, reason not numeric)\n` +
                `<code>/ban [user_id]</code>\n` +
                `<code>/ban [user_id] [reason]</code>`;

        await ctx.replyWithHTML(r);
}

async function ban_with_user_id(ctx: any, user_id: number,
                                reason: string|null = null)
{

}

async function ban_with_reply(ctx: any, reason: string|null = null)
{
        const user = ctx.message?.reply_to_message?.from;
        if (!user) {
                send_ban_cmd_usage(ctx);
                return false;
        }

        await ban_with_user_id(ctx, user.id, reason);
        return true;
}

async function parse_ban_arg(text)
{
        const args =

        return {
                user_id: user_id,
                reason: 
        };
}

async function ban_cmd_may_silent()
{
        if (!(await validateRequest(ctx, basic_ban_cmd_rules)))
                return;

        const args = ctx.message.text.split(" ");

        /*
         * `/ban` without arguments must reply to a message.
         */
        if (args.length == 1) {
                await ban_with_reply(ctx);
                return;
        }

        /*
         * `/ban` with a single argument, possible scenarios:
         * 
         *      args = ["/ban", "reason_single_word"] # (must reply)
         *
         * or
         *      args = ["/ban", "user_id"] # no reason
         */
        if (args.length == 2) {
                if (!args[1].match(/^\d+$/)) {
                        await ban_with_reply(ctx, args[1]);
                        return;
                } else {
                        await ban_with_user_id(ctx, Number(args[1]));
                        return;
                }
        }

        /*
         * `/ban` with a multiple arguments, possible scenarios:
         * 
         *      args = ["/ban", "reason1", "reason2", ...] # must reply
         *
         * or
         *      args = ["/ban", "user_id", "reason1", "reason2", ...]
         */
        if (!args[1].match(/^\d+$/)) {
                await ban_with_reply(ctx, args[1]);
                return;
        } else {
                await ban_with_user_id(ctx, Number(args[1]));
                return;
        }
}

async function ban_cmd(ctx: any)
{

}

export const banCommand: Command = {
        command: "ban",
        function: ban_cmd
};