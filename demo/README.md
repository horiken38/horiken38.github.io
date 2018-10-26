# SiRu-client

SkyWay IoT SDK room utility for client

## snipet

**browser**

```javascript
// obtain APIKEY from skyway.io.
// Don't forget to config your domain and APIKEY setting in our Dashboard https://webrtc.ecl.ntt.com/en/login.html.
const client = new SiRuClient('myroom', {key: 'YOUR_API_KEY'})

client.on('connect', () => {
  client.on('device:connected', (uuid, profile) => {
    // fetch echo api
    client.fetch( uuid+'/echo/hello' )
      .then(res => res.text())
      .then(text => console.log(text))

    // request remote camera streaming
    client.requestStreaming(uuid)
      .then(stream => video.srcObject = stream)

    // subscribe each topic
    client.subscribe('testtopic/+')
  })

  client.on('message', (topic, mesg) => {
    console.log(topic, mesg)
  })
})

```

# Install

## npm

```bash
$ npm install skyway-siru-client
```

## prebuilt

* https://nttcom.github.io/skyway-siru-client/dist/skyway-siru-client.min.js

## API reference

* [SiRuClient](docs/SiRuClient.md)
* [Response](docs/response.md)

---

Copyright. NTT Communicaations Corporation All rights reserved.
