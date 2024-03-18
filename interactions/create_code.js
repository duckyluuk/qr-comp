const discord = require("discord.js");
const codes = require("../db/codes");
const users = require("../db/users");
const { generate_image } = require("../utils/code.js");
const { generate_id } = require("../utils/id.js");

const description = 'Handles the modal for creating a new code'

const init = async (interaction, client) => {
    let url_alias = interaction.fields.getTextInputValue('alias');
    const embed_title = interaction.fields.getTextInputValue('title');
    const embed_description = interaction.fields.getTextInputValue('description');
    const embed_color = interaction.fields.getTextInputValue('color');
    const user = interaction.user;
    const dbUser = await users.findOne({ user_id: user.id });
    existing_codes = await codes.find({ created_by: user.id });

    if (!url_alias) {
        url_alias = await generate_id();
    }

    if (url_alias && !url_alias.match(/^[a-zA-Z0-9-]+$/)) {
        interaction.reply({ content: 'Your alias can only contain letters, numbers, and dashes!', ephemeral: true });
        return;
    }

    if (existing_codes.length >= dbUser.allowed_codes) {
        interaction.reply({ content: 'You have already created the maximum amount of codes!', ephemeral: true });
        return;
    }

    if (embed_color && !embed_color.match(/^[0-9A-Fa-f]{6}$/)) {
        interaction.reply({ content: 'Your color must be a valid hexadecimal value!', ephemeral: true });
        return;
    }

    if (await codes.findOne({ code: url_alias })) {
        interaction.reply({ content: 'This url is already taken!', ephemeral: true });
        return;
    }

    const code = new codes({
        code: url_alias,
        created_at: new Date(),
        created_by: user.id,
        image: await generate_image(url_alias),
        embed_title: embed_title,
        embed_description: embed_description,
        embed_color: embed_color,
        visits: []
    });

    await code.save();

    const unique_visits = [...new Set(code.visits.map(item => item.visitor_id))];
    const buffer = Buffer.from(code.image, 'base64');
    const image = new discord.AttachmentBuilder(buffer, { name: 'code.png' });
    const embed = {
        title: "Your code has been created!",
        description: 'Share it and get as many people as you can to scan it!',
        fields: [
            {
                name: 'Code',
                value: code.code,
                inline: true,
            },
            {
                name: 'Scans',
                value: `Your code has ${unique_visits.length} unique scans! (${code.visits.length} total)`,
                inline: true,
            },
            {
                name: 'URL',
                value: "Instead of the QR, you can also share a normal URL: \n" + process.env.site_url + code.code,
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

module.exports = { init, description }
