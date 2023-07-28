const { get_existing_codes } = require("../utils/id.js");
const { get_code, generate_image } = require("../utils/code.js");
const { ApplicationCommandOptionType } = require("discord.js");

const description = 'Create an alias for your code!'

const options = [
    {
        name: 'alias',
        description: 'The alias you want to create or remove',
        type: ApplicationCommandOptionType.String,
        required: true,
    }
]

const init = async (interaction, client) => {
    const user = interaction.user;
    const code = await get_code(user);

    if(!code) {
        interaction.reply({ content: 'You have not created a code yet! Use the command `/get` to generate one.', ephemeral: true });
        return;
    }

    const existing = await get_existing_codes();
    const alias = interaction.options.getString('alias');
    const allowed_aliases = code.allowed_aliases;
    const aliases = code.aliases.map(alias => alias.alias);

    if (aliases.includes(alias)) {
        const index = aliases.indexOf(alias);
        aliases.splice(index, 1);
        await code.updateOne({ aliases: aliases });
        interaction.reply({ content: `You removed the alias ${alias}!`, ephemeral: true });
        return;
    }

    if (aliases.length >= allowed_aliases) {
        interaction.reply({ content: 'You have reached the maximum number of aliases!', ephemeral: true });
        return;
    }

    if(!alias.match(/^[a-zA-Z0-9]+$/)) {
        interaction.reply({ content: 'Your alias can only contain letters and numbers!', ephemeral: true });
        return;
    }

    if(alias.length < 3 || alias.length > 16) {
        interaction.reply({ content: 'Your alias must be between 3 and 16 characters!', ephemeral: true });
        return;
    }

    if (existing.includes(alias)) {
        interaction.reply({ content: 'This alias is already taken!', ephemeral: true });
        return;
    }

    aliases.push({
        alias: alias,
        image: await generate_image(alias),
    });
    await code.updateOne({ aliases: aliases });
    interaction.reply({ content: `You added the alias ${alias}!`, ephemeral: true });
}

module.exports = { init, description, options }