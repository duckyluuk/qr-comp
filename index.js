// requirements
const { REST } = require('@discordjs/rest');
const { Routes, OverwriteType } = require('discord-api-types/v9');
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const discord = require("discord.js");
const mongoose = require("mongoose");
const Fingerprint = require("express-fingerprint");
const path = require('path');

// env variables
require('dotenv').config({
    path: path.join(__dirname, '.env'),
})
const token = process.env.token;
const db_uri = process.env.db_uri;

// database
const codes = require("./db/codes.js");

// initialise
mongoose.connect(
    db_uri,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);
const app = express();
const client = new discord.Client({intents: [discord.GatewayIntentBits.Guilds]});

// start of bot
let commandTmp = []
let commands = []
client.once('ready', () => {
    console.log('Bot Ready!');

    let commandsFiles = fs.readdirSync(path.join(__dirname, './commands'));

    commandsFiles.forEach((file, i) => {
        commandTmp[i] = require('./commands/' + file);
        commands = [
            ...commands,
            {
                name: file.split('.')[0],
                description: commandTmp[i].description,
                init: commandTmp[i].init,
                options: commandTmp[i].options
            },
        ];
    });

    const rest = new REST({ version: '9' }).setToken(token);
    rest.put(Routes.applicationCommands(client.application.id), {
        body: commands,
    })
        .then(() => {
            console.log('Commands registered!');
        })
        .catch(console.error);
});

client.login(token);

// bot commands
client.on('interactionCreate', async interaction => {
    let code = await codes.findOne({ created_by: interaction.user.id });
    if(code && code.created_name !== interaction.user.username) {
        code.created_name = interaction.user.username;
    }
    if (interaction.isCommand()) {
        const { commandName } = interaction;
        const selectedCommand = commands.find(c => commandName === c.name);
        selectedCommand.init(interaction, client);
    }
})

// setup of webserver
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.use(express.static("public"));
app.use(Fingerprint({
    parameters:[
        Fingerprint.useragent,
        Fingerprint.acceptHeaders,
        Fingerprint.geoip,
    ]
}));

// start of webserver
app.listen(3000, () => {
    console.log("Server started!");
});

// get codes
app.get("/:code", async (req, res) => {
    const code = req.params.code;
    const fingerprint = req.fingerprint.hash;

    db_code = await codes.findOne({ code: code });

    if (!db_code) {
        alias = await codes.findOne({ aliases: { $elemMatch: { alias: code } } });
        if (alias) {
            db_code = alias;
        }
    }

    if (db_code) {
        db_code.visits.push({
            hash: fingerprint,
            created_at: Date.now()
        });
        db_code.save();
    }
    res.redirect("https://youtu.be/dQw4w9WgXcQ");
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});