import { replyToMsgId, getStorageDir } from "../generic";
import { validateRequest } from "../validation";

async function pin_command(ctx: any)
{
        const rules = [
                "user_in_supergroup",
                "admin",
                "bot_is_admin",
                "reply",
        ];

        if (!(await validateRequest(ctx, rules)))
                return;

        const repliedId = ctx.message.reply_to_message.message_id;
        ctx.pinChatMessage(repliedId);
}

async function unpin_command(ctx: any)
{
        const rules = [
                "user_in_supergroup",
                "admin",
                "bot_is_admin",
                "reply",
        ];

        if (!(await validateRequest(ctx, rules)))
                return;

        const repliedId = ctx.message.reply_to_message.message_id;
        ctx.unpinChatMessage(repliedId);
}

export const pinCommand = {
        command: "pin",
        function: pin_command
};

export const unpinCommand = {
        command: "unpin",
        function: unpin_command
};
