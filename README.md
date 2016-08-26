# videojs-contrib-eme

Supports Encrypted Media Extensions for playback of encrypted content in Video.js

### Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Getting Started](#getting-started)
  - [Running Tests](#running-tests)
  - [Tag and Release](#tag-and-release)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Using

By default, videojs-contrib-eme is not able to decrypt any audio/video. In order to
decrypt audio/video, a user must pass in methods that are specific to a source and its
combination of key system and codec. These are provided via either videojs-contrib-eme's
plugin options, or source options.

### FairPlay

For FairPlay, only `keySystems` is used from the options passed into videojs-contrib-eme,
or provided as part of the source object.

The required methods to provide are:
* `getCertificate`
* `getContentId`
* `getLicense`
or, if you are using the default FairPlay methods, the only required parameters are:
* `certificateUri`
* `licenseUri`

Below is an example of videojs-contrib-eme options when only using FairPlay:

```javascript
{
  keySystems: {
    "com.apple.fps.1_0": {
      getCertificate: (emeOptions, callback) => {
        // request certificate
        // if err, callback(err)
        // if success, callback(null, certificate)
      },
      getContentId: (emeOptions, initData) => {
        // return content ID
      },
      getLicense: (emeOptions, contentId, keyMessage, callback) => {
        // request key
        // if err, callback(err)
        // if success, callback(null, key) as arraybuffer
      }
    }
  }
}
```

Below is an example of videojs-contrib-eme options when only using FairPlay, and using
the default FairPlay methods:

```javascript
{
  keySystems: {
    "com.apple.fps.1_0": {
      certificateUri: "<CERTIFICATE URI>",
      licenseUri: "<LICENSE URI>"
    }
  }
}
```

The default methods are defined as follows:
* getCertificate - GET certificateUri with response type of arraybuffer
* getContentId - gets the hostname from the initData URI
* getLicense - POST licenseUri with response type of arraybuffer, header of
'Content-type': 'application/octet-stream', and body of webKitKeyMessage

### Other DRM Systems

For DRM systems that use the W3C EME specification as of 5 July 2016, only `keySystems`
is required.

`getLicense` is the only required `keySystems` method. `getCertificate` is also supported
if your source needs to retrieve a certificate.

The `audioContentType` and `videoContentType` properties for non-FairPlay sources are
used to determine if the system supports that codec, and to create an appropriate
`keySystemAccess` object. If left out, it is possible that the system will create a
`keySystemAccess` object for the given key system, but will not be able to play the
source due to the browser's inability to use that codec.

Below is an example of videojs-contrib-eme options when only using one of these DRM
systems:

```javascript
{
  keySystems: {
    "org.w3.clearkey": {
      videoContentType: 'audio/webm; codecs="vorbis"',
      audioContentType: 'video/webm; codecs="vp9"',
      getCertificate: (emeOptions, callback) => {
        // request certificate
        // if err, callback(err)
        // if success, callback(null, certificate)
      },
      getLicense: (emeOptions, keyMessage, callback) => {
        // request license
        // if err, callback(err)
        // if success, callback(null, license)
      }
    }
  }
}
```

### Source Options

Since each source may have a different set of properties and methods, it is best to use
source options instead of plugin options when specifying key systems. To do that, simply
pass the same options as you would as part of the plugin options, but instead pass them
as part of the source object when specifying `player.src(sourceObject)`.

For example:

```javascript
player.src({
  // normal src and type options
  src: '<URL>',
  type: 'video/webm',
  // eme options
  keySystems: {
    'org.w3.clearkey': {
      videoContentType: 'audio/webm; codecs="vorbis"',
      audioContentType: 'video/webm; codecs="vp9"',
      getCertificate: (emeOptions, callback) => {
        // request certificate
        // if err, callback(err)
        // if success, callback(null, certificate)
      },
      getLicense: (emeOptions, keyMessage, callback) => {
        // request license
        // if err, callback(err)
        // if success, callback(null, license)
      }
    }
  }
});
```

### Passing methods seems complicated

If you're wondering why there are so many methods to implement, and why the options can't
simply have URLs (except for the default FairPlay case), you're asking good questions.

We wanted to provide as much flexibility as possible. This means that if your server has
a different structure, you use a different format for FairPlay content IDs, or you want
to test something in the browser without making a request, we can support that, since you
control the methods.

In the future we may provide other default implementations and allow passing through the
minimum amount of details possible. If you have any suggestions on how we should go about
this, we'd love to hear your ideas!

## Getting Started

1. Clone this repository!
1. Install dependencies: `npm install`
1. Run a development server: `npm start`

That's it! Refer to the [video.js plugin standards](https://github.com/videojs/generator-videojs-plugin/docs/standards.md) for more detail.

### Running Tests

- In all available and supported browsers: `npm test`
- In a specific browser: `npm run test:chrome`, `npm run test:firefox`, etc.
- While development server is running, navigate to [`http://localhost:9999/test/`](http://localhost:9999/test/) (_note:_ port may vary, check console output)

### Tag and Release

1. Make sure everything is committed.
1. `npm version *` where `*` is `major`, `minor`, `patch`, etc. [Read more about versioning.](https://github.com/videojs/generator-videojs-plugin/docs/standards.md#versioning)
1. `npm publish`

## License

MIT. Copyright (c) Garrett Singer &lt;gesinger@gmail.com&gt;
