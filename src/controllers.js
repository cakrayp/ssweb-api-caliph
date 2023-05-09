const stream = require('stream');
const xml2js = require('xml2js');
const { fromBuffer } = require("file-type");
const crypt = require('crypto');
const uploadFileWithUguu = require('../lib/uploadFile');
const {browserPuppeteer} = require('../index');
const creator = "Cakrayp & Caliph";

const randomArr = (arr = []) => {
    return arr[Math.floor(Math.random() * arr.length)];
};

// check URL...
const isUrl = (URL) => {
    return URL.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%+.~#?&/=]*)/, 'gi'));
};

// Buffer to stream...
const createStream = (binary) => {
    return new stream.Readable({
        read() {
            this.push(binary);
            this.push(null);
        }
    });
};


/**
 * 
 * @param {Request.Express} req 
 * @param {Response.Express} res 
 * @returns {Promise<Express.void>}
 */
exports.webScreenschot = async(req, res) => {
    const url = decodeURIComponent(decodeURI(req.query.url));
    const media_type = req.query.mediatype;
    const viewport = req.query.viewport;
    const filetype = req.query.filetype?.replace('jpg','jpeg');
    const fullPage__ = req.query.fullpage;
    const responsetype = req.query.responsetype?.toString().toLowerCase();

    // Configure the puppeteer.
    // const mediatype_avaiable = ['desktop', 'handphone', 'custom'];
    const filetype_avaiable = ['jpeg', 'png', 'webp'];
    const accept_responsetype = /^image(|s)|json|xml$/.test(responsetype);
    const viewport_sizes = viewport?.split("x").splice(0,2).map(v=>parseInt(v));
    const boolean__ = ["true", "false"];
    const ToBoolean__ = [true, false];
    const fullPage = ToBoolean__[boolean__.indexOf(fullPage__)] ?? false;   // typeof fullPage__ === 'boolean' ? fullPage__ : ToBoolean__[boolean__.indexOf(fullPage__)];

    // Viewport Sizes for puppeteer.
    const viewport_screen = {
        desktop: { width: 1920, height: 1080 },
        handphone: { width: 720, height: 1080 },
        custom: { width: viewport_sizes?.[0] ?? NaN, height: viewport_sizes?.[1] ?? NaN }
    };

    if (!url) return res.status(400).json({ status: 400, method: "GET", success: false, creator, message: "Please enter URL for web screenshot" });
    if (!media_type) return res.status(400).json({
        status: 400, method: "GET", success: false, creator, message: `Please select one of ${Object.keys(viewport_screen).join(', ')} for web screenshot, or read in documentation`
    });
    if (!responsetype) return res.status(400).json({
        status: 400, method: "GET", success: false, creator, message: "responsetype is require, please select one of json, xml, and image, or read in documentation"
    });
    if (!accept_responsetype) return res.status(400).json({
        status: 400, method: "GET", success: false, creator, message: "this responsetype is not avaiable, please select one of json, xml, and image, or read in documentation"
    });
    if (!viewport_screen.hasOwnProperty(media_type)) return res.status(400).json({
        status: 400, method: "GET", success: false, creator, message: `Mediatype is not avaiable, Please select one of ${Object.keys(viewport_screen).join(', ')} for web screenshot, or read in documentation`
    });
    if (filetype && !filetype_avaiable.includes(filetype)) return res.status(415).json({
        status: 415, method: "GET", success: false, creator, message: "this type is not supported, Please select one of jpeg, png, webp or read in documentation"
    });
    if (media_type === 'custom' && !viewport) return res.status(400).json({
        status: 400, method: "GET", success: false, creator, message: 'Viewport is require for screen size, when it using the custom.'
    });
    if ((media_type === 'custom' && isNaN(viewport_sizes[0])) || (media_type === 'custom' &&  isNaN(viewport_sizes[1]))) {
        let example_viewport = viewport_screen[randomArr(Object.keys(viewport_screen).splice(0,2))];
        let toStr = JSON.stringify(example_viewport).replace(/\"/g,"").replace(',',', ');
        let toExpStr = Object.keys(example_viewport).map(v=>example_viewport[v]).join("x");
        return res.status(400).json({
            status: 400,
            method: "GET",
            success: false,
            message: `Please enter the screen size you want. Example ${toExpStr} (${toStr})`,
            paramenter: `viewport=${toExpStr}`
        });
    };
    
    if (isUrl(url) && /^http(?:s):\/\//.test(url)) {
        const puppeteerConfig = {
            url,
            defaultViewport: viewport_screen[media_type],
            fullpage: fullPage,
            filetype
        }
    
        browserPuppeteer.screenshot(puppeteerConfig)
            .then(async ({ title, description, viewport, url, screenshot: buff }) => {
                if (/^image(s|)$/.test(responsetype)) {
                    let { ext, mime } = await fromBuffer(buff);
                    let filename = `IMG-${crypt.randomBytes(15).toString('hex').toUpperCase()}.${ext}`;
                    res.setHeader("Content-Type", mime);                            // MimeType.
                    res.setHeader('Content-disposition', `filename=${filename}`);   // filename.
                    createStream(buff).pipe(res);                                   // Stream file (download file with stream)
                } else if (responsetype === 'xml') {
                    res.header('Content-Type', 'application/xml');
                    const builder = new xml2js.Builder();
                    uploadFileWithUguu(buff)
                        .then(files => {
                            res.status(200).send(builder.buildObject({
                                status: 200,
                                method: "GET",
                                success: true,
                                creator,
                                message: "You can add paramenter of 'responsetype=image' to image response",
                                result: {
                                    title,
                                    description,
                                    origin_url: url,
                                    viewport,
                                    files
                                }
                            }));
                        })
                        .catch(async (err) => {
                            res.status(err.code).send(builder.buildObject({
                                status: err.code,
                                method: "GET",
                                success: false,
                                creator,
                                message: {
                                    ...err.message,
                                    example: req.protocol + "://" + req.hostname + req.originalUrl.replace(/&responsetype=xml/, '&responsetype=image')
                                }
                            }));
                        });
                } else if (responsetype === 'json') {
                    uploadFileWithUguu(buff)
                        .then(files => {
                            res.status(200).json({
                                status: 200,
                                method: "GET",
                                success: true,
                                creator,
                                message: "You can add paramenter of 'responsetype=image' to image response",
                                result: {
                                    title,
                                    description,
                                    origin_url: url,
                                    viewport,
                                    files
                                }
                            });
                        })
                        .catch(async (err) => {
                            res.status(err.code).json({
                                status: err.code,
                                method: "GET",
                                success: false,
                                creator,
                                message: {
                                    ...err.message,
                                    example: req.protocol + "://" + req.hostname + req.originalUrl.replace(/&responsetype=json/, '&responsetype=image')
                                }
                            });
                        });
                };
            })
            .catch(async(err) => {
                res.status(err.code).json({
                    status: err.code,
                    method: "GET",
                    success: false,
                    creator,
                    message: err.message
                });
            });
    } else {
        res.status(202).json({
            status: 202,
            method: "GET",
            success: false,
            creator,
            message: "this is specific to url."
        });
    };
};