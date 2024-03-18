const discord = require('discord.js');
const codes = require('../db/codes');
const users = require('../db/users');
const { getScanCount } = require('../utils/user.js');

const description = 'Get the overall stats of your profile!'



const init = async (interaction, client) => {
    const embeds = [];
    const images = [];
    const userCodes = await codes.find({ created_by: interaction.user.id });
    const user = await users.findOne({ user_id: interaction.user.id });

    for (const code of userCodes) {
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
        embeds.push(embed);
        images.push(image);
    }

    interaction.reply({ embeds, files: images, ephemeral: true });
}

module.exports = { init, description }
