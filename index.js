const browserPuppeteer = require("./lib/puppeteerController");
let author = require("./package.json").author || {};
const type = {
    browserPuppeteer
};
author = author || {
    name: 'Caliph Dev.',
    email: 'admin@caliph.my.id'
};

module.exports = { author, ...type };