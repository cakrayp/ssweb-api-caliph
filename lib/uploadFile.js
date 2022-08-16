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
            .then(response => response.text())
            .then(async (html) => {
                try {
                    const $ = cheerio.load(html)
                    const uploadedfile = $("input.form-control").attr("value")
                    const { headers } = await fetch(uploadedfile, { method: 'GET' })
                    var result_link = {
                        server: capitalizeEachWord(headers.get("server")) + " (file Uploader)",
                        originalname: uploadedfile.match(/file\/(.+)/)[1],
                        filetype: ext,
                        mimetype: headers.get("content-type").trim(),
                        size: await bytesToSize(headers.get("content-length")),
                        url: uploadedfile
                    }
                } catch {
                    bodyForm.append("files[]", buffer, randomfile + '.' + ext)
                    const response_j = await fetch("https://uguu.se/upload.php", {
                        method: "POST",
                        headers: {
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
                            ...bodyForm.getHeaders()
                        },
                        body: bodyForm
                    })
                    const dataJ = await response_j.json();
                    const { size, url: uploadedfile } = dataJ.files[0];
                    const { headers } = await fetch(uploadedfile, { method: 'GET' })
                    var result_link = {
                        server: capitalizeEachWord(headers.get("server")) + " (file Uploader)",
                        originalname: uploadedfile.match(/a.uguu.se\/(.+)/)[1],
                        filetype: ext,
                        mimetype: headers.get("content-type").trim(),
                        size: await bytesToSize(size),
                        url: uploadedfile
                    }
                }
                resolve(result_link)
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
