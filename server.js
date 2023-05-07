const express = require('express');
const app = express();
const port = process.env.PORT || 8050;
const moment = require('moment-timezone');
const { author } = require('./index');
const helpandUsage = require('./src/readme.min');
const Controller = require('./src/controllers');


// Express Controller.
app.use(express.static("public"))
app.enable('trust proxy');
app.set("json spaces", 4)

// Route Action
app.get('/', async (req, res) => {
    res.setHeader('Content-type', 'text/plain').send(helpandUsage(req))
})
app.get('/api/webscreen', Controller.webScreenschot);
app.use(async (req, res) => {
    res.setHeader('Content-type', 'text/plain')
    res.status(404).send("404 Not found")
})

// Listen Port.
app.listen(port, () => {
    console.log('Server is running on port : ' + port)
})
