# Ssweb-Rest-API
`Package ssweb API with puppeteer and google chrome`

<p align="center">
<img src="https://telegra.ph/file/e294a9dec6818a7c689a9.png" width="auto" height="350"/>
<img src="https://telegra.ph/file/651de97f3fd7d374cf6d4.png" width="auto" height="350"/>
</p>

## App Deployments one Click
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/zA58hj?referralCode=XDFlpf)
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/cakrayp/ssweb-api-caliph)

### Heroku Buildpacks

- heroku/nodejs (nodejs application)
- https://github.com/jontewks/puppeteer-heroku-buildpack.git

### Running with Dockerfile

Railway is now supported for heroku.
You can deploy with [Railway.app](https://railway.app) and you do not anything to do.

If you are [Heroku](https://Heroku.com) users, you can set to container with [heroku stack](https://devcenter.heroku.com/articles/stack)
for running a container for [Dockerfile](https://www.docker.com)
without must a heroku buildpack, and you can deploy to heroku with [Dockerfile](https://www.docker.com) as the command below👇 :)

``` bash
$ heroku stack:set container
```

# Usage for ssweb API

You can see how to use web screenshot my rest API's in below.

| Params        | query | input | type | Description |
| ------------- |:------|:------|:----:|:------------|
| / | - | - | - | for see a documentation and info about my API's |
| /api/webscreen | url | `https://example.com` | `string` | Enter the URL |
| /api/webscreen | mediatype | `"desktop", "handphone", "custom"` | `string` | Web Screenshot with media type (screen size) |
| /api/webscreen | filetype | `"jpeg", "png", "webp"` | `string` | to select file formats |
| /api/webscreen | fullpage | `"true", "false"` | `boolean` | fullpage scroll, if you set to `true` |
| /api/webscreen | viewport | `"1920x1080"(<width>x<height>)` | `string` | Using the viewport to scale the screen, if you using the paramenter of mediatype is `custom` |
| /api/webscreen | responsetype | `"json", "xml", "image"` | `string` | to API format response. |

## Example

URL Details:
`https://webscreenn.herokuapp.com/api/webscreen?url={ENTER_URL}&mediatype={SCREEN_TYPE}&filetype={FILE_FORMAT}viewport={SCREEN_SIZE}&fullpage={BOOLEAN}&responsetype={RESPONSE_FORMAT}`

### Response result on json

``` json
{
    "status": 200,
    "method": "GET",
    "success": true,
    "creator": "Cakrayp & Caliph",
    "message": "You can add paramenter of 'responsetype=image' to image response",
    "result": {
        "title": "GitHub - caliphdev/caliph-api: Simple Package caliph-api for javascript",
        "description": "Simple Package caliph-api for javascript. Contribute to caliphdev/caliph-api development by creating an account on GitHub.",
        "origin_url": "https://github.com/caliphdev/caliph-api",
        "viewport": {
            "width": 1920,
            "height": 1080
        },
        "files": {
            "server": "Nginx (file Uploader)",
            "hash": "4566958dd672eab02bc639a40bc1e06f0eeaf882",
            "originalname": "IMG-129779AD0342BA1E.jpg",
            "filetype": "jpg",
            "size": "129.3 KB",
            "file_url": "https://a.uguu.se/ecoAzWEj.jpg"
        }
    }
}
```

### Response result on xml

``` xml
<root>
    <status>200</status>
    <method>GET</method>
    <success>true</success>
    <creator>Cakrayp & Caliph</creator>
    <message>You can add paramenter of 'responsetype=image' to image response</message>
    <result>
        <title>GitHub - caliphdev/caliph-api: Simple Package caliph-api for javascript</title>
        <description>Simple Package caliph-api for javascript. Contribute to caliphdev/caliph-api development by creating an account on GitHub.</description>
        <origin_url>https://github.com/caliphdev/caliph-api</origin_url>
        <viewport>
            <width>1920</width>
            <height>1080</height>
        </viewport>
        <files>
            <server>Nginx (file Uploader)</server>
            <hash>539fa8fc4dfa7f18eaba6511bb2d8eeac1ad7fcd</hash>
            <originalname>IMG-6EC83B9F1E6C6DFC.jpg</originalname>
            <filetype>jpg</filetype>
            <mimetype/>
            <size>130.6 KB</size>
            <file_url>https://a.uguu.se/XeeqLwqu.jpg</file_url>
        </files>
    </result>
</root>
```
<p align="center">
<img src="https://telegra.ph/file/406d00a75b50aa3eb5cc1.png" width="auto" height="350"/>
</p>

### Response result on image(s)

if you want to use images response, you can add paramenter of `responsetype=image`

`https://webscreenn.herokuapp.com/api/webscreen?url={ENTER_URL}&mediatype={TYPE_MEDIA}&responsetype=image`

- Response result on image for desktop

<p align="center">
<img src="https://telegra.ph/file/221e5fd399fbc8c9696b2.png" width="auto" height="350"/>
</p>

- Response result on image for handphone

<p align="center">
<img src="https://telegra.ph/file/517b8219ca53433c73b40.png" width="auto" height="450"/>
</p>

- Response result on image for Custom, But it use a paramenter of viewport (screen size) E.g: `viewport=1920x720`

<p align="center">
<img src="https://telegra.ph/file/e6f24b63bbffa42c99a64.png" width="auto" height="450"/>
</p>

## fullpage scroll

You can use `fullpage=true` for page scroll

`https://webscreenn.herokuapp.com/api/webscreen?url=https://youtube.com&mediatype=desktop&fullpage=true&filetype=png`

<p align="center">
<img src="https://telegra.ph/file/afaad018648402e277069.png" width="auto" height="450"/>
</p>

## Creator

- Sourde code [Caliphdev](https://github.com/caliphdev)
- Credit by [Cakrayp (Me)](https://github.com/cakrayp)

## Contact

If you want to report bug or chat owner, please create in [issues](https://github.com/cakrayp/ssweb-api-caliph/issues) on this repository, or contact me in below.

<a href="https://www.instagram.com/cakrayp_jhn"><img src="https://img.shields.io/badge/-instagram-magenta?style=for-the-badge&logo=instagram&logoColor=white">
<br>
<a href="https://wa.me/6285161422971"><img alt="WhatsApp" src="https://img.shields.io/badge/-Whatsapp-success?style=for-the-badge&logo=whatsapp&logoColor=white"/></a>
<br>