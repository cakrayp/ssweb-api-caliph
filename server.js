const ssweb = require('./index');
const express = require('express');
const app = express();
const port = process.env.PORT || 8050
const stream = require('stream');
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

// check URL...
const isUrl = (URL) => {
    return URL.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%+.~#?&/=]*)/, 'gi'))
}


app.use(express.static("public"))
app.set("json spaces", 4)


app.get('/', async (req, res) => {
    const source_code = 'https://github.com/caliphdev/ssweb-api'
    const link_github = "https://github.com/cakrayp/ssweb-api-caliph";
    // res.send(`<code>Hello welcome to my Rest API, I was created server for web screenshot from source code <a href="${source_code}">${source_code}</a><br>Please visit here <a href="${link_github}">${link_github}</a></code>`)
    res.setHeader('Content-type', 'text/plain')
    res.write('Hello welcome to my Rest API...\nSo this is my step to make new programs for web screenshot.\n')
    res.write(`-> Protocol: "${req.protocol}"\n`)
    res.write(`-> Your Domain: "${req.hostname}"\n`)
    res.write(`-> Path: "${req.path}"\n`)
    res.write(`-> OriginalUrl: "${req.originalUrl}"\n\n`)
    res.write('=======================================================================\n\n')
    res.write('I was created server for web screenshot from source code\n')
    res.write('- Source code: "Caliphdev"\n')
    res.write('- Credits: "Cakra YP"\n\n')
    res.write(`Program information:\n`)
    res.write(`- Puppeteer: "google-chrome-stuble"\n`)
    res.write(`- ProgramType: "Nodejs (${process.version})"\n`)
    res.write('- CreatedAt: "26 March 2022 (5 months ago)"\n\n')
    res.write('=======================================================================\n\n')
    res.write('Please visit my github for read documentation\n\n')
    res.write(`- Original: "${source_code}" (caliphdev)\n`)
    res.write(`- Documentation: "${link_github}" (cakrayp)\n\n\n`)
    res.end('------> Powered - 2022 by "Cakra YP" <------')
})


app.get('/api/webscreen', async (req, res) => {
    var url = encodeURI(req.query.url),
        media_type = req.query.mediatype,
        filetype = req.query.filetype,
        fullPage__ = req.query.fullpage,
        responsetype = req.query.responsetype

    const mediatype_avaiable = ['desktop', 'handphone']
    const filetype_avaiable = ['jpeg', 'png', 'webp']
    const boolean__ = ["true", "false"]
    const ToBoolean__ = [true, false]
    const fullPage = typeof fullPage__ === 'boolean' ? fullPage__ : ToBoolean__[boolean__.indexOf(fullPage__)]

    if (!url) return res.status(400).json({ status: 400, creator: "Cakrayp & Caliph", message: "Please enter URL for web screenshot" })
    if (!media_type) return res.status(400).json({ status: 400, creator: "Cakrayp & Caliph", message: `Please select one of ${mediatype_avaiable.join(', ')} for web screenshot` })
    if (!mediatype_avaiable.includes(media_type)) return res.status(400).json({ status: 400, creator: "Cakrayp & Caliph", message: `Mediatype is notavaiable, Please select one of ${mediatype_avaiable.join(', ')} for web screenshot` })
    if (!filetype_avaiable.includes(filetype)) return res.status(415).json({ status: 415, creator: "Cakrayp & Caliph", message: "this type is not supported." })
    if (isUrl(url) && /^http(?:s):\/\//.test(url)) {
        ssweb[media_type]({ url, fullpage: fullPage, filetype })
            .then(async (buff) => {
                if (/^image(s|)$/.test(responsetype)) {
                    createStream(buff).pipe(res)
                } else {
                    uploadFileFromCaliph(buff)
                        .then(result => {
                            res.json({
                                status: 200,
                                method: "GET",
                                creator: "Cakrayp & Caliph",
                                message: "You can add paramenter of 'responsetype=image' to image response",
                                result
                            })
                        })
                        .catch(async (err) => {
                            res.status(err.code).json({
                                status: err.code,
                                method: "GET",
                                creator: "Cakrayp & Caliph",
                                message: err.message
                            })
                        })
                }
            })
    } else {
        res.status(202).json({
            status: 202,
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
