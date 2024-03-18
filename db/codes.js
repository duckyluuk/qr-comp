const mongoose = require("mongoose");

const CodeSchema = new mongoose.Schema({
    code: String,
    image: String,
    created_at: Date,
    created_by: String,
    embed_color: String,
    embed_title: String,
    embed_description: String,
    visits: [
        {
            hash: String,
            created_at: Date,
            visited_alias: String
        }
    ]
});

module.exports = mongoose.model("Code", CodeSchema);