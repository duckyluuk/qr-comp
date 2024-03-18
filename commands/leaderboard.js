const codes = require("../db/codes.js");
const users = require("../db/users.js");
const discord = require("discord.js");

const { getUserScanCount } = require('../utils/user.js');

description = 'Get the users with the most scans!'

const init = async (interaction, client) => {
    let userList = await users.find({});
    const embed = {
        title: 'Most Scanned Codes',
        color: 0x00ffff,
    }
    
    userList = await Promise.all(userList.map(async (user) => {
        const userCodes = await codes.find({ created_by: user.user_id });
        const scanCount = await getUserScanCount(user.user_id);
        user.totalScans = scanCount.totalScans;
        user.uniqueScans = scanCount.uniqueScans;
        return user;
    }));
    userList = userList.filter(user => user.totalScans > 0);
    userList.sort((a, b) => b.totalScans - a.totalScans);
    userList = userList.slice(0, 25);

    let topUsers = '';
    userList.map((user, index) => {
        topUsers += `**${index + 1}.** ${user.username}: **${user.uniqueScans}** unique scans *(${user.totalScans} total)*\n`;
    });

    embed.description = topUsers;

    interaction.reply({ embeds: [embed], ephemeral: true });
}

module.exports = { init, description }