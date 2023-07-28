const mongoose = require("mongoose");

const CodeSchema = new mongoose.Schema({
    code: String,
    image: String,
    created_at: Date,
    created_by: String,
    created_name: String,
    allowed_aliases: Number,
    aliases: [
        {
            alias: String,
            image: String
        }
    ],
    visits: [
        {
            hash: String,
            created_at: Date,
            visited_alias: String
        }
    ]
});

module.exports = mongoose.model("Code", CodeSchema);