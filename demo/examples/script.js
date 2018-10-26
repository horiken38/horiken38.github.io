///////////////////////////////////////////////////////
// Definitions for global valuables

// set key of localStorage
const __STOREKEY__ = 'skyway-siru-client-sample'

// subscribe topic name
let subTopicName;

///////////////////////////////////////////////////////
// Definitions for functions

//
// Initialization:
//
//   Try to load configuration from local storage.
//   When conf exists, we will set it to each text form.
//
const init = () => {
  const conf = JSON.parse(localStorage.getItem(__STOREKEY__))
  if(conf) {
    $("#input-apikey").val(conf.apikey)
    $("#input-room-name").val(conf.roomName)
    $("#input-topic-name").val(conf.subTopicName)
  }
}

//
// Start streaming:
//
//   Send streaming request to IoT SDK. When streaming arrived,
//   we will set streaming object to `video` element.
//
const startStreaming = (client, profile) => {
  $("#video-status").text("requesting")
  client.requestStreaming(profile.uuid)
    .then( stream => {
      $("#video-status").text("started")
      $("video")[0].srcObject = stream
    })
}

//
// Start service:
//
//   This function will start this sample video streaming service from IoT SDK.
//   It will try to establish connection to IoT device by indicating room name.
//   After connection establishment, meta information will be transferred from
//   IoT SDK. It includes `profile` information. By indicating this, this function
//   will call `startStreaming`.
//   This function also set handler for proxing MQTT message between IoT SDK.
//
const startService = (roomName, apikey) => {
  // set test ice server setting which is dedicated to IoT SDK
  const config = { iceTransportPolicy: 'all' };

  // start connection to IoT SDK.
  const client = new SiRuClient(roomName, { key: apikey, debug: 3, config })

  $("#status").text('connecting...')

  // when connection established
  client.on('connect', () => $("#status").text('connected'))

  // when meta message is arrived, we will send start streaming request and
  // subscribe to MQTT working at IoT device.
  client.on('meta', profile => {
    $("#uuid").text(profile.uuid)

    startStreaming(client, profile)
    client.subscribe(subTopicName);
  })

  // when MQTT publish message from IoT device is arrived, we will simply
  // display it.
  client.on('message', (topic, data) => {
    // when data size exceeds 16 bytes, we will display data size only.
    if(data.length > 16) data = `received ${data.length} bytes of data`;

    $(`<div><b>${topic}</b> : ${data}</div>`).appendTo("#pubsub-mesg");
  })

  // publish MQTT message to IoT device.
  $("form.publish").on("submit", ev => {
    ev.preventDefault()

    const pubTopicName = $("#pub-topic").val()
    let mesg = $("#pub-mesg").val()

    $("#pub-mesg").val("")

    // when message is ``number``, we will create same size of string for test purpose.
    let size;
    if( size = parseInt(mesg) ) {
      const arr = [];
      for(let i = 0; i < size; i++) arr.push('a')
      mesg = arr.join("")
    }

    if(!!mesg) client.publish(pubTopicName, mesg)
  })
}

//
// Store localStorage:
//
//   This function will store configuration object to `localStorage`
//
const storeLocalStorage = param => {
  localStorage.setItem(__STOREKEY__, JSON.stringify(param))
}

///////////////////////////////////////////////////////
// Event handler
//

// Event handler for start service by using `apikey`, `roomName` and `subscribe topic name`
// Before starting services, we will store configuration items into localStorage
//
$("form.connect").on("submit", function(ev) {
  ev.preventDefault()
  $(this).find("button").prop("disabled", true)

  const apikey = $("#input-apikey").val()
    , roomName = $("#input-room-name").val()

  subTopicName = $("#input-topic-name").val()

  storeLocalStorage({apikey, roomName, subTopicName})
  startService(roomName, apikey)
})

////////////////////////////////////////////////////////
// start
init();
