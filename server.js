const ssweb = require('./index');
const express = require('express');
const app = express();
const port = process.env.PORT || 8050
const moment = require('moment-timezone')
const stream = require('stream');
const xml2js = require('xml2js');
const uploadFileFromCaliph = require('./lib/uploadFile');
const { author } = require('./index');
const helpandUsage = require('./src/readme.min')


// Buffer to stream...
const createStream = (binary) => {
    return new stream.Readable({
        read() {
            this.push(binary);
            this.push(null);
        }
    });
}

const randomArr = (arr = []) => {
    return arr[Math.floor(Math.random() * arr.length)];
}

// check URL...
const isUrl = (URL) => {
    return URL.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%+.~#?&/=]*)/, 'gi'))
}

const creator = "Cakrayp & Caliph";

app.use(express.static("public"))
app.enable('trust proxy');
app.set("json spaces", 4)


app.get('/', async (req, res) => {
    res.setHeader('Content-type', 'text/plain').send(helpandUsage(req))
})


app.get('/api/webscreen', async (req, res) => {
    const my_URL = `${req.protocol}://${req.hostname}${req.originalUrl==='/'?'':req.originalUrl}`;
    if (decodeURIComponent(decodeURI(req.query.url)) === my_URL) {
        return res.setHeader('Content-type', 'text/plain').status(500).send('This URL is same as my API, because it could not web screenshot with my URL, execpt my domain')
    }

    var url = decodeURIComponent(decodeURI(req.query.url)),
        media_type = req.query.mediatype,
        filetype = req.query.filetype,
        fullPage__ = req.query.fullpage,
        responsetype = req.query.responsetype?.toLowerCase()

    const mediatype_avaiable = ['desktop', 'handphone'];
    const filetype_avaiable = ['jpeg', 'jpg', 'png', 'webp'];
    const accept_responsetype = /^image(|s)|json|xml$/.test(responsetype);
    const boolean__ = ["true", "false"];
    const ToBoolean__ = [true, false];
    const fullPage = typeof fullPage__ === 'boolean' ? fullPage__ : ToBoolean__[boolean__.indexOf(fullPage__)];

    if (!url) return res.status(400).json({ status: 400, method: "GET", success: false, creator, message: "Please enter URL for web screenshot" })
    if (!media_type) return res.status(400).json({ status: 400, method: "GET", success: false, creator, message: `Please select one of ${mediatype_avaiable.join(', ')} for web screenshot, or read in documentation` })
    if (!responsetype) return res.status(400).json({ status: 400, method: "GET", success: false, creator, message: "responsetype is require, please select one of json, xml, and image, or read in documentation" })
    if (!accept_responsetype) return res.status(400).json({ status: 400, method: "GET", success: false, creator, message: "this responsetype is not avaiable, please select one of json, xml, and image, or read in documentation" })
    if (!mediatype_avaiable.includes(media_type)) return res.status(400).json({ status: 400, method: "GET", success: false, creator, message: `Mediatype is not avaiable, Please select one of ${mediatype_avaiable.join(', ')} for web screenshot, or read in documentation` })
    if (filetype && !filetype_avaiable.includes(filetype)) return res.status(415).json({ status: 415, method: "GET", success: false, creator, message: "this type is not supported, or read in documentation" })
    
    if (isUrl(url) && /^http(?:s):\/\//.test(url)) {
        ssweb[media_type]({ url, fullpage: fullPage, filetype: filetype?.replace('jpg','jpeg') })
            .then(async (buff) => {
                if (/^image(s|)$/.test(responsetype)) {
                    createStream(buff).pipe(res)
                } else if (responsetype === 'xml') {
                    res.header('Content-Type', 'application/xml')
                    const builder = new xml2js.Builder()
                    uploadFileFromCaliph(buff)
                        .then(result => {
                            res.status(200).send(builder.buildObject({
                                status: 200,
                                method: "GET",
                                success: true,
                                creator,
                                message: "You can add paramenter of 'responsetype=image' to image response",
                                result
                            }))
                        })
                        .catch(async (err) => {
                            res.status(err.code).send(builder.buildObject({
                                status: err.code,
                                method: "GET",
                                success: false,
                                creator,
                                message: {
                                    ...err.message,
                                    example: req.protocol + "://" + req.hostname + req.originalUrl + '&responsetype=image'
                                }
                            }))
                        })
                } else if (responsetype === 'json') {
                    uploadFileFromCaliph(buff)
                        .then(result => {
                            res.status(200).json({
                                status: 200,
                                method: "GET",
                                success: true,
                                creator,
                                message: "You can add paramenter of 'responsetype=image' to image response",
                                result
                            })
                        })
                        .catch(async (err) => {
                            res.status(err.code).json({
                                status: err.code,
                                method: "GET",
                                success: false,
                                creator,
                                message: {
                                    ...err.message,
                                    example: req.protocol + "://" + req.hostname + req.originalUrl + '&responsetype=image'
                                }
                            })
                        })
                }
            })
    } else {
        res.status(202).json({
            status: 202,
            method: "GET",
            success: false,
            creator,
            message: "this is specific to url."
        })
    }
})


app.use(async (req, res) => {
    res.setHeader('Content-type', 'text/plain')
    res.status(404).send("404 Not found")
})


app.listen(port, () => {
    console.log('Server is running on port : ' + port)
})
