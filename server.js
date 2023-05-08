const express = require('express');
const app = express();
const port = process.env.PORT || 8050;
const requestIp = require('request-ip');
const momentjs = require('moment-timezone');
const { author } = require('./index');
const helpandUsage = require('./src/readme.min');
const Controller = require('./src/controllers');
const { color } = require('./lib/color');


// Express Controller.
app.use(express.static("public"))
app.enable('trust proxy');
app.set("json spaces", 4);
app.use(requestIp.mw());

// Express logs.
app.use(async(req, res, next) => {
    if (process.env.ENABLE_LOG_EXPRESS) {
        const isApi = /\/api\/webscreen/.test(req.path);
        const hostDoamin = req.hostname==='localhost'?'127.0.0.1':req.hostname;
        console.log(
            color(`${momentjs.tz("Asia/Jakarta").toISOString()} Express-Action[${isApi?'api':'router'}]:`, "magenta"),
            color(req.protocol.toUpperCase(), "yellow"),
            req.method,
            color(`"${req.originalUrl}"`),
            color(`host=${hostDoamin}`, "blue"),
            `fwd=${req.clientIp}`
        );
    };
    next();
});

// Route Action.
app.get('/', async (req, res) => {
    res.setHeader('Content-type', 'text/plain').send(helpandUsage(req));
});
app.get('/api/webscreen', Controller.webScreenschot);
app.use(async (req, res) => {
    res.setHeader('Content-type', 'text/plain');
    res.status(404).send("404 Not found");
});

// Listen Port.
app.listen(port, () => {
    console.log('Server is running on port : ' + port);
});
