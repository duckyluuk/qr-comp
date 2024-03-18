codes = require("../db/codes.js");
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

async function generate_id() {
    const existing = await get_existing_codes();
    let id = '';
    for (var i = 0; i < 8; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (existing.includes(id)) {
        return generate_id(existing);
    }
    return id;
}

async function get_existing_codes() {
    let codes_list = await codes.find({});
    existing = codes_list.map(code => code.code);
    return existing;
}

module.exports = {
    generate_id,
    get_existing_codes,
    chars
}