const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    user_id: String,
    username: String,
    allowed_codes: Number
});

module.exports = mongoose.model("User", UserSchema);