const discord = require("discord.js");

const users = require("../db/users.js");
const codes = require("../db/codes.js");

const description = 'Create a new qr code!'

const init = async (interaction, client) => {
    const user = interaction.user;

    const existing_codes = await codes.find({ created_by: user.id });
    const dbUser = await users.findOne({ user_id: user.id });

    if (existing_codes.length >= dbUser.allowed_codes) {
        interaction.reply({ content: 'You have already created the maximum amount of codes!', ephemeral: true });
        return;
    }
    
    const modal = new discord.ModalBuilder()
        .setTitle('Create a new code')
        .setCustomId('create_code')
    
    const aliasInput = new discord.TextInputBuilder()
        .setCustomId('alias')
        .setRequired(false)
        .setMinLength(3)
        .setMaxLength(25)
        .setStyle(discord.TextInputStyle.Short)
        .setPlaceholder('e.g. short-url, leave empty for random')
        .setLabel('URL Alias (letters, numbers, and dashes)')

    const titleInput = new discord.TextInputBuilder()
        .setCustomId('title')
        .setRequired(false)
        .setMaxLength(64)
        .setStyle(discord.TextInputStyle.Short)
        .setPlaceholder('Title shown in embedded url (optional)')
        .setLabel('Embed Title')

    const descriptionInput = new discord.TextInputBuilder()
        .setCustomId('description')
        .setRequired(false)
        .setMaxLength(128)
        .setStyle(discord.TextInputStyle.Short)
        .setPlaceholder('Description shown in embedded url (optional)')
        .setLabel('Embed Description')

    const colorInput = new discord.TextInputBuilder()
        .setCustomId('color')
        .setRequired(false)
        .setMinLength(6)
        .setMaxLength(6)
        .setStyle(discord.TextInputStyle.Short)
        .setPlaceholder('Color shown in embedded url (optional, e.g. 00ff00)')
        .setLabel('Embed Color (hexadecimal)')

    modal.addComponents(new discord.ActionRowBuilder().addComponents(aliasInput), new discord.ActionRowBuilder().addComponents(titleInput), new discord.ActionRowBuilder().addComponents(descriptionInput), new discord.ActionRowBuilder().addComponents(colorInput));


    await interaction.showModal(modal);
}

module.exports = { init, description }