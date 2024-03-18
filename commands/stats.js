const codes = require('../db/codes');
const users = require('../db/users');
const { getUserScanCount } = require('../utils/user.js');

const description = 'Get the overall stats of your profile!'



const init = async (interaction, client) => {
    const userCodes = await codes.find({ created_by: interaction.user.id });
    const user = await users.findOne({ user_id: interaction.user.id });
    const scanCount = await getUserScanCount(interaction.user.id);
    const uniqueScans = scanCount.uniqueScans;
    const totalScans = scanCount.totalScans;

    const embed = {
        title: "Here are your stats:",
        fields: [
            {
                name: 'Your Codes',
                value:  userCodes.map(code => "**" + code.code + ":** " + code.visits.length + " scans").join('\n') + '\n\n You have created ' + userCodes.length + ' codes and can create ' + (user.allowed_codes - userCodes.length) + ' more.',
                inline: true,
            },
            {
                name: 'Total Scans',
                value: `Your codes have a total of ${uniqueScans} unique scans! (${totalScans} total)`,
                inline: true,
            },
        ]
    }

    interaction.reply({ embeds: [embed], ephemeral: true });
}

module.exports = { init, description }
