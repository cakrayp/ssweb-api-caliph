const ssweb = require('./index');
const express = require('express');
const app = express();
const port = process.env.PORT || 8050
const moment = require('moment-timezone')
const stream = require('stream');
const xml2js = require('xml2js');
const uploadFileFromCaliph = require('./lib/uploadFile');
const { author } = require('./index');


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


app.use(express.static("public"))
app.enable('trust proxy');
app.set("json spaces", 4)


app.get('/', async (req, res) => {
    const source_code = 'https://github.com/caliphdev/ssweb-api'
    const link_github = "https://github.com/cakrayp/ssweb-api-caliph";
    const moment_tz = moment("2022-03-26").tz('Asia/Jakarta');
    const createdAt = moment_tz.fromNow();
    const now_years = moment_tz.year();
    const write_powered_years = now_years === 2022 ? now_years : `2022 - ${now_years}`;
    // res.send(`<code>Hello welcome to my Rest API, I was created server for web screenshot from source code <a href="${source_code}">${source_code}</a><br>Please visit here <a href="${link_github}">${link_github}</a></code>`)
    const exam_url = encodeURIComponent('https://www.google.com/');
    const random_mediatype = randomArr(['desktop', 'handphone']);
    const welcometo_API = `
=======================================================================
---------------------------------------|
----> Welcome To Web Screenshot APIs   |-------------> Welcome
---------------------------------------|
=======================================================================

Hello welcome to Web Screenshot API...\nSo this is my step to make new programs for web screenshot.\n
-> Protocol: "${req.protocol}"
-> Your Domain: "${req.hostname}"
-> Path: "${req.path}"
=======================================================================

I was created server for web screenshot from source code.
- Source code    : "Caliphdev"
- Credits        : "Cakra YP"

Program information:
- Running on     : "heroku (heroku.com)"
- Framework      : "Container"
- Deploy With    : "Dockerfile"
- Puppeteer      : "google-chrome-stuble"
- ProgramType    : "Nodejs (${process.version})"
- Language       : "Javascript"
- Created-At     : "26 March 2022 (${createdAt})"

=======================================================================

Please visit our github for read documentation:

- Original       : "${source_code}" (caliphdev)
- Documentation  : "${link_github}" (cakrayp)

=======================================================================
`.trim()
    const usage_API = `
=======================================================================
------------------------------------|
------> Usage for My Rest API:      |---------------> UsageApi
------------------------------------|
=======================================================================

~ URL Details :
"${req.protocol}://${req.hostname}/api/webscreen?url={ENTER_URL}&mediatype={TYPE_MEDIA}&filetype={FILE_FORMAT}&fullpage={BOOLEAN}&responsetype={RESPONSE_FORMAT}"

=======================================================================

- Input URL:

URL is require for screenshot, but it does not support for a text, and number. except link or URL
We provide special detect enter the url.
"url={ENTER_URL}"

~ Examples:
URL (default)     :   ${req.protocol}://${req.hostname}/api/webscreen?url=${encodeURI(exam_url)}&mediatype=desktop&responsetype=json
URL (decodeURI)   :   ${req.protocol}://${req.hostname}/api/webscreen?url=${exam_url}&mediatype=handphone&responsetype=json
=======================================================================


- MediaType (screen size):

Media screen size is avaiable for "desktop" and "handphone".
Web screenshot from links.
"mediatype={TYPE_MEDIA}"

~ Examples:
Desktop        :   ${req.protocol}://${req.hostname}/api/webscreen?url=${exam_url}&mediatype=desktop&responsetype=json
Handphone      :   ${req.protocol}://${req.hostname}/api/webscreen?url=${exam_url}&mediatype=handphone&responsetype=json
=======================================================================

- Filetype (file format):

file format is available for file type of "jpeg" or "jpg", "png", and "webp" to save.
"filetype={FILE_FORMAT}"

~ Examples:
jpeg        :   ${req.protocol}://${req.hostname}/api/webscreen?url=${exam_url}&mediatype=${random_mediatype}&filetype=jpeg&responsetype=json
png         :   ${req.protocol}://${req.hostname}/api/webscreen?url=${exam_url}&mediatype=${random_mediatype}&filetype=png&responsetype=json
WebP        :   ${req.protocol}://${req.hostname}/api/webscreen?url=${exam_url}&mediatype=${random_mediatype}&filetype=WebP&responsetype=json
=======================================================================

- Response Type:

We have provided several response services to share with all applications with certain
programming languages.
"responsetype={RESPONSE_FORMAT}"

~ Examples:
Json        :   ${req.protocol}://${req.hostname}/api/webscreen?url=${exam_url}&mediatype=${random_mediatype}&responsetype=json
Xml         :   ${req.protocol}://${req.hostname}/api/webscreen?url=${exam_url}&mediatype=${random_mediatype}&responsetype=xml
Image(s)    :   ${req.protocol}://${req.hostname}/api/webscreen?url=${exam_url}&mediatype=${random_mediatype}&responsetype=${randomArr(['image', 'images'])}
=======================================================================

- fullpage (full scrool):

We have provided a scrolling service for everything on the page
if you want to scroll active, you can add a paramenter of like this fullpage=true
"fullpage={BOOLEAN}"

~ Examples:
True (scroll active)    :   ${req.protocol}://${req.hostname}/api/webscreen?url=${exam_url}&mediatype=${random_mediatype}&fullpage=true&responsetype=image
False (default)         :   ${req.protocol}://${req.hostname}/api/webscreen?url=${exam_url}&mediatype=${random_mediatype}&fullpage=false&responsetype=image
\n
`

const powered_by = `
=======================================================================
------------> Powered ${write_powered_years} by "Cakra YP" <------------
=======================================================================
`.trim()
    res.setHeader('Content-type', 'text/plain')
    res.write(welcometo_API + '\n\n\n')
    res.write(usage_API)
    res.end(powered_by)
})


app.get('/api/webscreen', async (req, res) => {
    var url = encodeURI(req.query.url),
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

    if (!url) return res.status(400).json({ status: 400, creator: "Cakrayp & Caliph", message: "Please enter URL for web screenshot" })
    if (!media_type) return res.status(400).json({ status: 400, creator: "Cakrayp & Caliph", message: `Please select one of ${mediatype_avaiable.join(', ')} for web screenshot, or read in documentation` })
    if (!responsetype) return res.status(400).json({ status: 400, creator: "Cakrayp & Caliph", message: "responsetype is require, please select one of json, xml, and image" })
    if (!accept_responsetype) return res.status(400).json({ status: 400, creator: "Cakrayp & Caliph", message: "this responsetype is not avaiable, please select one of json, xml, and image" })
    if (!mediatype_avaiable.includes(media_type)) return res.status(400).json({ status: 400, creator: "Cakrayp & Caliph", message: `Mediatype is notavaiable, Please select one of ${mediatype_avaiable.join(', ')} for web screenshot, or read in documentation` })
    if (filetype && !filetype_avaiable.includes(filetype)) return res.status(415).json({ status: 415, creator: "Cakrayp & Caliph", message: "this type is not supported, or read in documentation" })
    
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
                                creator: "Cakrayp & Caliph",
                                message: "You can add paramenter of 'responsetype=image' to image response",
                                result
                            }))
                        })
                        .catch(async (err) => {
                            res.status(err.code).send(builder.buildObject({
                                status: err.code,
                                method: "GET",
                                success: false,
                                creator: "Cakrayp & Caliph",
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
                                creator: "Cakrayp & Caliph",
                                message: "You can add paramenter of 'responsetype=image' to image response",
                                result
                            })
                        })
                        .catch(async (err) => {
                            res.status(err.code).json({
                                status: err.code,
                                method: "GET",
                                success: false,
                                creator: "Cakrayp & Caliph",
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
            creator: "Cakrayp & Caliph",
            message: "this is specific to url."
        })
    }
})


app.use(async (req, res) => {
    res.status(404).send("<code>404 Not found</code>")
})


app.listen(port, () => {
    console.log('Server is running on port : ' + port)
})
