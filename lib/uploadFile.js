const FormData = require('form-data');
const fileType = require("file-type")
const fetch = require('node-fetch')
const cheerio = require("cheerio")
const crypto = require("crypto")

// Get file extention from buffer
async function fromBuffer(buffer) {
  const fileTypeResult = await fileType.fromBuffer(buffer);
  return {
    ext: fileTypeResult?.ext || "jpg",
    mime: fileTypeResult?.mime || "image/jpg"
  };
}

// Get number size to Bytes To size...
function bytesToSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return 'n/a';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  if (i === 0) return (`${bytes} ${sizes[i]}`);
  return (`${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`);
};

// Capitalize each word
function capitalizeEachWord(text = "") {
  return text?.toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Upload Image With Telegraph (With Short Domain *wink)
module.exports = async buffer => {
  const { ext } = await fromBuffer(buffer)
  let form = new FormData()
  form.append('file', buffer, 'tmp.' + ext)
  let res = await fetch('https://www.dd.ci/upload', {
    method: 'POST',
    body: form
  })
  let img = await res.json()
  if (img.error) throw img.error
  let img_url = 'https://dd.ci' + img[0].src
  return { screenshot_url: img_url }
};
