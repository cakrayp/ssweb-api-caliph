const handphone = require("./lib/sshp");
const desktop = require("./lib/ssweb");
let author = require("./package.json").author || {};
const type = {
    handphone,
    desktop
};
author = author || {
    name: 'Caliph Dev.',
    email: 'admin@caliph.my.id'
};

module.exports = { author, ...type }
