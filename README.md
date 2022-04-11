# Ssweb-Rest-API
`Package ssweb API with puppeteer and google chrome`

# Heroku Deployments
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/cakrayp/ssweb-api-caliph)
<<<<<<< HEAD

### Heroku Buildpacks

- heroku/nodejs (nodejs application)
- https://github.com/jontewks/puppeteer-heroku-buildpack.git

# Usage for ssweb API
=======
>>>>>>> 8ff974ebb6e355abf59f41be739af725b4d8b8a7

### Heroku Buildpacks

- heroku/nodejs (nodejs application)
- https://github.com/jontewks/puppeteer-heroku-buildpack.git

# Usage for ssweb API

You can use paramenter of `desktop` And `handphone`

`https://webscreenn.herokuapp.com/ssweb/{SCREEN_TYPE}?url={URL}`

Response result on json

``` json
{
    "status": 200,
    "creator": "Cakrayp & Caliph",
    "message": "You can add paramenter of 'responsetype=image' to image response",
    "result": {
        "originalname": "e9f9f92dad.png",
        "encoding": "7bit",
        "mimetype": "image/png",
        "size": "72.15 KB",
        "url": "https://uploader.caliph.my.id/file/zaku7M75ok.png"
    }
}
```

if you want to use images response, you can add paramenter of `responsetype=image`

`https://webscreenn.herokuapp.com/ssweb/{SCREEN_TYPE}?url={URL}`

- Response result on image for desktop

<p align="center">
<img src="https://telegra.ph/file/221e5fd399fbc8c9696b2.png" width="auto" height="350"/>
</p>

- Response result on image for handphone

<p align="center">
<img src="https://telegra.ph/file/517b8219ca53433c73b40.png" width="auto" height="450"/>
</p>

## Creator

- Sourde code [Caliph](https://github.com/Caliph91)
- Credit by [Cakrayp (Me)](https://github.com/cakrayp)
