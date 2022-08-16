# Ssweb-Rest-API
`Package ssweb API with puppeteer and google chrome`

<p align="center">
<img src="https://telegra.ph/file/e294a9dec6818a7c689a9.png" width="auto" height="350"/>
<img src="https://telegra.ph/file/651de97f3fd7d374cf6d4.png" width="auto" height="350"/>
</p>

# Heroku Deployments
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/cakrayp/ssweb-api-caliph)

### Heroku Buildpacks

- heroku/nodejs (nodejs application)
- https://github.com/jontewks/puppeteer-heroku-buildpack.git

### Running with Dockerfile

You can set to container with [heroku stack](https://devcenter.heroku.com/articles/stack)
without must a heroku buildpack, and you can deploy to heroku with [Dockerfile](https://www.docker.com) :)

``` bash
$ heroku stack:set container
```

# Usage for ssweb API

You can see how to use web screenshot my rest API's in below.

| Params        | query | input | type | Description |
| ------------- |:------|:------|:----:|:------------|
| / | - | - | - | for see a info about my API's |
| /api/webscreen | url | `https://example.com` | `string` | Enter the URL |
| /api/webscreen | mediatype | `"desktop", "handphone"` | `string` | Web Screenshot with media type |
| /api/webscreen | filetype | `"jpeg", "png", "webp"` | `string` | for select file type |
| /api/webscreen | fullpage | `"true", "false"` | `boolean` | fullpage scroll, if you set to `true` |
| /api/webscreen | responsetype | `"image"` | `string` | for image API response. |

## Example

`https://webscreenn.herokuapp.com/api/webscreen?url={URL}&mediatype={SCREEN_TYPE}`

Response result on json

``` json
{
    "status": 200,
    "method": "GET",
    "creator": "Cakrayp & Caliph",
    "message": "You can add paramenter of 'responsetype=image' to image response",
    "result": {
        "server": "Cloudflare (file Uploader)",
        "originalname": "BbeAnN8ctM05lKRA1ZKo.png",
        "filetype": "png",
        "mimetype": "image/png",
        "size": "355.3 KB",
        "url": "http://uploader.caliph.my.id/file/BbeAnN8ctM05lKRA1ZKo.png"
    }
}
```

if you want to use images response, you can add paramenter of `responsetype=image`

`https://webscreenn.herokuapp.com/api/webscreen?url={URL}&mediatype={SCREEN_TYPE}&responsetype=image`

- Response result on image for desktop

<p align="center">
<img src="https://telegra.ph/file/221e5fd399fbc8c9696b2.png" width="auto" height="350"/>
</p>

- Response result on image for handphone

<p align="center">
<img src="https://telegra.ph/file/517b8219ca53433c73b40.png" width="auto" height="450"/>
</p>

## fullpage scroll

You can use `fullpage=true` for page scroll

`https://webscreenn.herokuapp.com/api/webscreen?url=https://youtube.com&mediatype=desktop&fullpage=true&filetype=png`

<p align="center">
<img src="https://telegra.ph/file/afaad018648402e277069.png" width="auto" height="450"/>
</p>

## Creator

- Sourde code [Caliph](https://github.com/Caliph91)
- Credit by [Cakrayp (Me)](https://github.com/cakrayp)
