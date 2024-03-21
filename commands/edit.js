const discord = require("discord.js");

const users = require("../db/users.js");
const codes = require("../db/codes.js");

const description = 'Edit information about one of your QR codes!'

const options = [
    {
        name: 'alias',
        description: 'The alias you want to get information about',
        type: discord.ApplicationCommandOptionType.String,
        required: true,
    }
]

const init = async (interaction, client) => {
    const user = interaction.user;
    const alias = interaction.options.getString('alias');
    const code = await codes.findOne({ created_by: user.id, code: alias });
    if (!code) {
        interaction.reply({ content: 'You have not created a code with this alias!', ephemeral: true });
        return;
    }
    
    const modal = new discord.ModalBuilder()

    const titleInput = new discord.TextInputBuilder()
        .setCustomId('title')
        .setRequired(false)
        .setMaxLength(64)
        .setStyle(discord.TextInputStyle.Short)
        .setPlaceholder('Title shown in embedded url (optional)')
        .setLabel('Embed Title')
        .setValue(code.title)

    const descriptionInput = new discord.TextInputBuilder()
        .setCustomId('description')
        .setRequired(false)
        .setMaxLength(128)
        .setStyle(discord.TextInputStyle.Short)
        .setPlaceholder('Description shown in embedded url (optional)')
        .setLabel('Embed Description')
        .setValue(code.description)

    const colorInput = new discord.TextInputBuilder()
        .setCustomId('color')
        .setRequired(false)
        .setMinLength(6)
        .setMaxLength(6)
        .setStyle(discord.TextInputStyle.Short)
        .setPlaceholder('Color shown in embedded url (optional, e.g. 00ff00)')
        .setLabel('Embed Color (hexadecimal)')
        .setValue(code.color)

    modal.addComponents(new discord.ActionRowBuilder().addComponents(titleInput), new discord.ActionRowBuilder().addComponents(descriptionInput), new discord.ActionRowBuilder().addComponents(colorInput));

    await interaction.showModal(modal);
}

module.exports = { init, description, options }