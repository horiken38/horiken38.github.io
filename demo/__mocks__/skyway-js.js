'use strict';

const EventEmitter =require('events')

const TEST_ID = 'test-id'

class Call extends EventEmitter {
  constructor(parent) {
    super(parent)

    this.remoteId = 'SSG_test-other-id'
  }

  answer() {
    this.emit('stream', {})
  }

  close() {
    this.emit('close')
  }
}

class Conn extends EventEmitter {
  constructor(parent) {
    super(parent)

    this.parent = parent
    this.preamble = 'SSG:'
    this.body = JSON.stringify({
      type: 'response',
      target: 'profile',
      method: 'get',
      body: {
        uuid: 'test-uuid',
        ssg_peerid: 'SSG_test-other-id'
      }
    })
    this.data = ''
    this.createData()

    setTimeout( ev => {
      this.emit('open')
      setTimeout(ev => {
        this.emit('data', Buffer.from(this.data))
      }, 100)
    }, 100)

  }

  createData() {
    this.data = [this.preamble, this.body].join("")
  }

  send(str) {
    if(str.indexOf("SSG:") === 0) {
      if(str === 'SSG:profile/get') this.emit('data', Buffer.from(this.data))
      if(str.indexOf('SSG:stream/start') === 0) {
        const call = new Call()
        this.parent.emit('call', call)
      }
      if(str === 'SSG:stream/stop') { /*noop*/ }
    } else {
      const req = JSON.parse(str)
      if( req.payload.path.indexOf("/echo/") === 0 ) {
        const ret =
        { topic: req.topic,
          payload: {
            status: 200,
            transaction_id: req.payload.transaction_id,
            method: req.payload.method,
            chunked: false,
            body: req.payload.path.slice(6)
          }
        }

        this.emit('data', Buffer.from(JSON.stringify(ret)))
      }
    }
  }

}


class Socket extends EventEmitter {
  constructor() {
    super()
  }

  send(key, data) {
    switch( key ) {
    case 'ROOM_JOIN':
      this.emit('ROOM_USER_JOIN', { src: TEST_ID, roomName: data.roomName })
      break;
    case 'ROOM_GET_USERS':
      this.emit('ROOM_USERS', { roomName: data.roomName, userList: ['SSG_test-other-id']})
      break;
    default:
      break;
    }
  }
}


class SkyWay extends EventEmitter {
  constructor() {
    super()
    this.socket = new Socket()

    setTimeout( ev => {
      this.myid = TEST_ID
      this.emit('open', this.myid)
    }, 100)
  }
  connect() {
    const conn = new Conn(this)

    return conn
  }
  call() {
    const call = new Call();
    setTimeout( ev => {
      call.emit('stream', null);
    }, 100);
    return call;
  }

}

export default SkyWay
