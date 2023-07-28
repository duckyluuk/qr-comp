const description = 'Send a pong message to check if the bot is on.'

const init = (interaction, client) => {
    const time = Date.now() - interaction.createdTimestamp;
    interaction.reply({ content: `Pong! (${time}ms)`, ephemeral: true});
}

module.exports = { init, description }
