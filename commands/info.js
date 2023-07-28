
const { get_code } = require("../utils/code.js");
const discord = require("discord.js");
const { ApplicationCommandOptionType } = require("discord.js");

const description = 'Create an alias for your code!'

const options = [
    {
        name: 'alias',
        description: '(optional) The alias you want to get information about (defaults to your main code)',
        type: ApplicationCommandOptionType.String,
        required: false,
    }
]


const init = async (interaction, client) => {
    const user = interaction.user;
    const code = await get_code(user);

    if(!code) {
        interaction.reply({ content: 'You have not created a code yet! Use the command `/get` to generate one.', ephemeral: true });
        return;
    }

    const alias = interaction.options.getString('alias');
    const aliases = code.aliases.map(alias => alias.alias);

    if(alias && !aliases.includes(alias)) {
        interaction.reply({ content: `You do not have the alias '${alias}'.`, ephemeral: true });
        return;
    }

    let image = code.image;
    let code_string = code.code;
    if(alias) {
        image = code.aliases.find(a => a.alias === alias).image;
        code_string = alias;
    }

    const visits = code.visits.filter(visit => visit.alias === code_string);
    const unique_visits = [...new Set(visits.map(item => item.visitor_id))];

    const buffer = Buffer.from(image, 'base64');
    const attachment = new discord.AttachmentBuilder(buffer, { name: 'code.png' });

    const embed = {
        title: `Code Information: ${code_string}`,
        description: `This code has ${unique_visits.length} unique scans (${visits.length} total), out of the ${code.visits.length} total scans you have.`,
        image: {
            url: 'attachment://code.png',
        },
        color: 0x00ffff
    }

    interaction.reply({ embeds: [embed], files: [attachment], ephemeral: true });
}

module.exports = { init, description, options }