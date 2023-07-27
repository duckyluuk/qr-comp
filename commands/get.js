const { create_code } = require("../utils/code.js");
const discord = require("discord.js");
const codes = require("../db/codes.js");

const description = 'Get own qr code!'

const init = async (interaction, client) => {
    const user = interaction.user;
    let code = await codes.findOne({ created_by: interaction.user.id });
    let exists = false;

    if(!code) {
        code = await create_code(user);
        exists = true;
    }
    const unique_visits = [...new Set(code.visits.map(item => item.visitor_id))];
    const buffer = Buffer.from(code.image, 'base64');
    const image = new discord.AttachmentBuilder(buffer, { name: 'code.png' });
    const title = exists ? 'Your code has been created!' : 'Here is your code!';
    const exampleEmbed = {
        title,
        description: 'Share it and get as many people as you can to scan it!',
        fields: [
            {
                name: 'Code',
                value: code.code,
                inline: true,
            },
            {
                name: 'Aliases',
                value: code.aliases.map(alias => alias.alias).join(', ') + `\n (${code.aliases.length}/${code.allowed_aliases})`,
                inline: true,
            },
            {
                name: 'Scans',
                value: `Your code has ${unique_visits.length} unique scans! (${code.visits.length} total)`,
                inline: true,
            }
        ],
        image: {
            url: 'attachment://code.png',
        },
        color: 0x00ffff,
    }

    interaction.reply({ embeds: [exampleEmbed], files: [image], ephemeral: true });

}

module.exports = { init, description }