<a name="SiRuClient"></a>

## SiRuClient ⇐ <code>EventEmitter</code>
**Kind**: global class  
**Extends**: <code>EventEmitter</code>  

* [SiRuClient](#SiRuClient) ⇐ <code>EventEmitter</code>
    * [new SiRuClient(roomName, options)](#new_SiRuClient_new)
    * [.publish(topic, data)](#SiRuClient+publish)
    * [.subscribe(topic)](#SiRuClient+subscribe)
    * [.unsubscribe(topic)](#SiRuClient+unsubscribe)
    * [.requestStreaming(uuid)](#SiRuClient+requestStreaming) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.stopStreaming(uuid)](#SiRuClient+stopStreaming) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.sendStream(uuid, stream, [options])](#SiRuClient+sendStream) ⇒ <code>Promise.&lt;MediaConnection&gt;</code>
    * ["connect"](#SiRuClient+event_connect)
    * ["device:connected"](#SiRuClient+device_connected)
    * ["meta"](#SiRuClient+event_meta)
    * ["device:closed"](#SiRuClient+device_closed)
    * ["message"](#SiRuClient+event_message)
    * ["stream"](#SiRuClient+event_stream)
    * ["stream:error"](#SiRuClient+stream_error)
    * ["stream:closed"](#SiRuClient+stream_closed)
    * ["state:change"](#SiRuClient+state_change)

<a name="new_SiRuClient_new"></a>

### new SiRuClient(roomName, options)
Client class of SkyWay IoT Room Utility


| Param | Type | Description |
| --- | --- | --- |
| roomName | <code>string</code> | The name of the room. |
| options | <code>Object</code> | option argument of skyway constructor. For more detail, please check https://webrtc.ecl.ntt.com/en/js-reference/Peer.html. |
| options.key | <code>string</code> | SkyWay API key. This is only one mandatory parameter in options. |

**Example**  
```js
const client = new SiRuClient( 'testroom', { key: 'YOUR_API_KEY' } );

client.on('connect', () => { ... });
```
<a name="SiRuClient+publish"></a>

### siRuClient.publish(topic, data)
publish message to all connecting peer.
when subscribing by myself, fire 'message' event internally as well.

**Kind**: instance method of [<code>SiRuClient</code>](#SiRuClient)  

| Param | Type |
| --- | --- |
| topic | <code>string</code> | 
| data | <code>string</code> \| <code>object</code> | 

**Example**  
```js
client.publish('testtopic/message', {payload: 'hello'});
```
<a name="SiRuClient+subscribe"></a>

### siRuClient.subscribe(topic)
subscribe to topic

**Kind**: instance method of [<code>SiRuClient</code>](#SiRuClient)  

| Param | Type |
| --- | --- |
| topic | <code>string</code> | 

**Example**  
```js
client.subscribe('testtopic/+');
client.on('message', ( topic, name ) => {
  console.log(topic, name); // #=> 'testtopic/message hello'
});
```
<a name="SiRuClient+unsubscribe"></a>

### siRuClient.unsubscribe(topic)
unsubscribe topic

**Kind**: instance method of [<code>SiRuClient</code>](#SiRuClient)  

| Param | Type |
| --- | --- |
| topic | <code>string</code> | 

**Example**  
```js
client.unsubscribe('testtopic/+');
```
<a name="SiRuClient+requestStreaming"></a>

### siRuClient.requestStreaming(uuid) ⇒ <code>Promise.&lt;Object&gt;</code>
request streaming to SSG

**Kind**: instance method of [<code>SiRuClient</code>](#SiRuClient)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - returns stream object  

| Param | Type |
| --- | --- |
| uuid | <code>string</code> | 

**Example**  
```js
client.requestStreaming(uuid)
  .then( stream => { ... } )
```
<a name="SiRuClient+stopStreaming"></a>

### siRuClient.stopStreaming(uuid) ⇒ <code>Promise.&lt;void&gt;</code>
request stop streaming to SSG

**Kind**: instance method of [<code>SiRuClient</code>](#SiRuClient)  

| Param | Type |
| --- | --- |
| uuid | <code>string</code> | 

**Example**  
```js
client.stopStreaming(uuid)
  .then( () => { ... } )
```
<a name="SiRuClient+sendStream"></a>

### siRuClient.sendStream(uuid, stream, [options]) ⇒ <code>Promise.&lt;MediaConnection&gt;</code>
This method will send mediaStream to device.
This method is useful for playing voice at remote speaker,
recording audio and remote audio recognition etc.
About options, see more detail at
https://webrtc.ecl.ntt.com/skyway-js-sdk-doc/en/peer/#call-options-object

**Kind**: instance method of [<code>SiRuClient</code>](#SiRuClient)  
**Returns**: <code>Promise.&lt;MediaConnection&gt;</code> - - see https://webrtc.ecl.ntt.com/skyway-js-sdk-doc/en/mediaconnection/  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| uuid | <code>string</code> |  | uuid of target device |
| stream | <code>Object</code> |  | media stream object |
| [options] | <code>Object</code> |  |  |
| [options.audioCodec] | <code>string</code> | <code>&quot;&#x27;opus&#x27;&quot;</code> | audio codec |
| [options.videoCodec] | <code>string</code> | <code>&quot;&#x27;H264&#x27;&quot;</code> | video codec |

**Example**  
```js
const client = new SiRuClient( 'testroom', { key: 'YOUR_API_KEY' } );

client.on('meta', profile => {
  navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then( stream =>
       client.sendStream( profile.uuid, stream )
    )
    .then( call => console.log('start sending local stream') )
    .catch( err => console.warn(err) );
});
```
<a name="SiRuClient+event_connect"></a>

### "connect"
When connect to room completed, it will fire

**Kind**: event emitted by [<code>SiRuClient</code>](#SiRuClient)  
<a name="SiRuClient+device_connected"></a>

### "device:connected"
When other device connected

**Kind**: event emitted by [<code>SiRuClient</code>](#SiRuClient)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| uuid | <code>string</code> | uuid of the device |
| profile | <code>object</code> | profile object of the device |

**Example**  
```js
client.on('device:connected', (uuid, profile) => {
  console.log(uuid)
  // #=> 'sample-uuid'
  console.log(profile)
  // #=> { description: "...",
  //       handle_id: "...",
  //       name: "some device",
  //       ssg_peerid: "SSG_id",
  //       streaming: true,
  //       topics: [ ... ],
  //       uuid: 'sample-uuid'
  //     }
})
```
<a name="SiRuClient+event_meta"></a>

### "meta"
When other device connected, it will fire 'meta' event as well.

**Kind**: event emitted by [<code>SiRuClient</code>](#SiRuClient)  
**Properties**

| Name | Type |
| --- | --- |
| profile | <code>object</code> | 

<a name="SiRuClient+device_closed"></a>

### "device:closed"
When connection closed to other device, it will fire

**Kind**: event emitted by [<code>SiRuClient</code>](#SiRuClient)  
<a name="SiRuClient+event_message"></a>

### "message"
When publish message received, this event will be fired.

**Kind**: event emitted by [<code>SiRuClient</code>](#SiRuClient)  
**Properties**

| Name | Type |
| --- | --- |
| topic | <code>string</code> | 
| data | <code>data</code> | 

**Example**  
```js
client.on('message', (topic, data) => {
  console.log(topic, data)
  // #=> "metric/cpu 42.2"
})
```
<a name="SiRuClient+event_stream"></a>

### "stream"
When media stream received from peer

**Kind**: event emitted by [<code>SiRuClient</code>](#SiRuClient)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| stream | <code>object</code> | stream object |
| uuid | <code>string</code> | uuid of peer |

**Example**  
```js
client.on('stream', stream => {
  video.srcObject = stream
})
```
<a name="SiRuClient+stream_error"></a>

### "stream:error"
When error happens while requesting media stream

**Kind**: event emitted by [<code>SiRuClient</code>](#SiRuClient)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| error | <code>object</code> | Error object |
| uuid | <code>string</code> | uuid of peer |

<a name="SiRuClient+stream_closed"></a>

### "stream:closed"
When media stream closed

**Kind**: event emitted by [<code>SiRuClient</code>](#SiRuClient)  
<a name="SiRuClient+state_change"></a>

### "state:change"
When state changed until connecting room completed, it will fire

**Kind**: event emitted by [<code>SiRuClient</code>](#SiRuClient)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| state | <code>string</code> | state |

