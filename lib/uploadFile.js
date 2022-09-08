const FormData = require('form-data');
const type = require("file-type")
const fetch = require('node-fetch')
const cheerio = require("cheerio")
const cryp = require("crypto")


// Get number size to Bytes To size...
function bytesToSize(bytes) {
    return new Promise((resolve, reject) => {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return 'n/a';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
        if (i === 0) resolve(`${bytes} ${sizes[i]}`);
        resolve(`${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`);
    });
};


function capitalizeEachWord(teks = "") {
    var splitStr = teks?.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(" ")
}


module.exports = async function uploadFile(buffer) {
    return new Promise(async (resolve, reject) => {
        let { ext } = await type.fromBuffer(buffer)
        let bodyForm = new FormData();
        let randomfile = cryp.randomBytes(5).toString('hex')
        bodyForm.append('file', buffer, randomfile + '.' + ext)

        // Created by https://github.com/Caliph91 (Caliph)
        // Creator by https://github.com/cakrayp (Cakra YP)
        fetch('https://uploader.caliph.my.id/backend/upload.php', {
            method: 'POST',
            body: bodyForm.getBuffer(),
            headers: {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.9,id;q=0.8",
                ...bodyForm.getHeaders()
            }
        })
            .then(response => response.json())
            .then(async ({ result }) => {
                const base_for_file = ['https://uploader.caliph.my.id', 'https://filezone.cf', 'https://ffcdn-srv-1e2mf2sh6.filezone.cf'];
                const uploadedfile = `${base_for_file[Math.floor(Math.random() * base_for_file.length)]}/file/${result.filename}`;
                const { headers } = await fetch(uploadedfile, { method: 'GET' });
                resolve({
                    server: capitalizeEachWord(headers.get("server")) + " (file Uploader)",
                    originalname: result.originalname,	// uploadedfile.match(/file\/(.+)/)[1],
                    encoding: result.encoding,
                    filetype: ext,
                    mimetype: result.mimetype,
                    size: result.filesize,
                    link: {
                        previewWeb: result.url,
                        file: uploadedfile
                    }
                });
            })
            .catch(async (err) => {
                console.log(err)
                reject({
                    code: 503,
                    message: "Service Unavailable, because this program file upload is down."
                })
            })
    })
}
