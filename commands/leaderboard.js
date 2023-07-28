const codes = require("../db/codes.js");
const discord = require("discord.js");

description = 'Get the top scanned codes!'

const init = async (interaction, client) => {
    const code_list = await codes.find({})
    const embed = {
        title: 'Most Scanned Codes',
        color: 0x00ffff,
    }
    code_list.map(code => {
        const unique_visits = [...new Set(code.visits.map(item => item.visitor_id))];
        code.unique_visits = unique_visits.length;
    });

    code_list.filter(code => code.unique_visits > 0 && code.created_by !== null);

    code_list.sort((a, b) => {
        return b.unique_visits - a.unique_visits;
    });

    let top_codes = '';
    code_list.slice(0, 25).map((code, index) => {
        top_codes += `**${index + 1}.** ${code.created_name}: **${code.unique_visits}** unique scans *(${code.visits.length} total)*\n`;
    });

    embed.description = top_codes;

    interaction.reply({ embeds: [embed], ephemeral: true });
}

module.exports = { init, description }