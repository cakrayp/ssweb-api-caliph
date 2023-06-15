const FormData = require('form-data');
const type = require("file-type");
const fetch = require('node-fetch');
const cheerio = require("cheerio");
const cryp = require("crypto");
const URLparse = require("./urlParsePath");


// Get number size to Bytes To size...
function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return 'n/a';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    if (i === 0) return (`${bytes} ${sizes[i]}`);
    return (`${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`);
};

// Random Array
function randomArr(arr = []) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// random filename
function getFilename(length, ext) {
    let randomTxt = '0123456789';
    let makeTxt = "";
    for (let i = 0; i < (length??10); i++) {
        let ranArr = randomTxt.split("");
        makeTxt += ranArr[Math.floor(Math.random() * ranArr.length)];
    };
    return 'temp-' + makeTxt + '.' + ext;
}

// Uploading files.
module.exports = async function (buffer) {
    return new Promise(async (resolve, reject) => {
        const { ext } = await type.fromBuffer(buffer);
        const bodyForm = new FormData();
        const randomfilename = getFilename(16,ext);   // file name
        bodyForm.append('file', buffer, randomfilename);

        // Created by https://github.com/caliphdev (Caliph)
        // Creator by https://github.com/cakrayp (Cakra YP)
        const randomUpload = randomArr([
            'https://missuo.ru/upload',
            'https://www.dd.ci/upload'
        ]);
        const dataUrls = URLparse(randomUpload);      // URL parse

        fetch(dataUrls.href, {
            method: 'POST',
            body: bodyForm.getBuffer(),
            headers: {
                "accept": "*/*",
                ...bodyForm.getHeaders()
            }
        })
            .then(response => response.json())
            .then(async (data) => {
                const files_result = dataUrls.protocol + '://' + dataUrls.host + data[0].src;
                const uploadedfile = files_result;
                const { headers } = await fetch(uploadedfile, { method: 'GET' });
                resolve({
                    hash: cryp.randomBytes(18).toString('hex'),
                    originalname: randomfilename,	// uploadedfile.match(/file\/(.+)/)[1],
                    filetype: ext,
                    mimetype: headers.get('content-type'),
                    size: bytesToSize(headers.get('content-length')),
                    link_ss: uploadedfile
                });
            })
            .catch(async (err) => {
                reject({
                    code: 503,
                    message: {
                        error: true,
                        messageError: "Error encorred! Service Unavailable as program file upload is not work to file uploads.",
                        info: 'We have provided an image response, Please use paramenter of responsetype=image(s) for image response'
                    }
                });
            });
    });
};
