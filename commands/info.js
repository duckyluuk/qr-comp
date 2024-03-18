const discord = require("discord.js");
const codes = require("../db/codes.js");
const { getScanCount } = require('../utils/user.js');

const description = 'Get information about one of your codes!'

const options = [
    {
        name: 'alias',
        description: 'The alias you want to get information about',
        type: discord.ApplicationCommandOptionType.String,
        required: false,
    }
]

const init = async (interaction, client) => {
    const alias = interaction.options.getString('alias');
    const user = interaction.user;
    let code;
    if (alias) {
        code = await codes.findOne({ created_by: user.id, code: alias });
        if (!code) {
            interaction.reply({ content: 'You have not created a code with this alias!', ephemeral: true });
            return;
        }
    }
    else {
        code = await codes.findOne({ created_by: user.id });
        if (!code) {
            interaction.reply({ content: 'You have not created a code yet! Use `/create` to create a code.', ephemeral: true });
            return;
        }
    }

    const visitInfo = await getScanCount(code.code);
    const buffer = Buffer.from(code.image, 'base64');
    const image = new discord.AttachmentBuilder(buffer, { name: 'code.png' });
    const embed = {
        title: "Here is your code:",
        description: 'Share it and get as many people as you can to scan it!',
        fields: [
            {
                name: 'Code',
                value: code.code,
                inline: true,
            },
            {
                name: 'Scans',
                value: `Your code has ${visitInfo.uniqueScans} unique scans! (${visitInfo.totalScans} total)`,
                inline: true,
            },
            {
                name: 'URL',
                value: `Instead of the QR code, you can also share a normal URL: \n ${process.env.site_url + code.code}`,
                inline: false,
            }
        ],
        image: {
            url: 'attachment://code.png',
        },
        color: 0x00ffff,
    }

    interaction.reply({ embeds: [embed], files: [image], ephemeral: true });
}

module.exports = { init, description, options }