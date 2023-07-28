const qrcode = require('qrcode');
const { generate_id } = require("./id.js");
const codes = require("../db/codes.js");

async function create_code(user={id:null, name:null}, id=null) {
    if(!id) id = await generate_id();
    
    const db_code = codes.create({
        code: id,
        image: await generate_image(id),
        created_at: new Date(),
        created_by: user.id,
        created_name: user.username,
        allowed_aliases: 1,
        aliases: [],
        visits: []
    });

    return db_code;

}

async function get_code(user) {
    const code = await codes.findOne({ created_by: user.id });
    return code;
}

async function generate_image(code) {
    const url = process.env.site_url + code;
    const code_image = await qrcode.toDataURL(url, { errorCorrectionLevel: 'H' });
    const base64Data = code_image.replace(/^data:image\/png;base64,/, "");

    return base64Data;
}

module.exports = {
    create_code,
    get_code,
    generate_image
}