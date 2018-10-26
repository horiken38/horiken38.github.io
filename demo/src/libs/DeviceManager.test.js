import Device from './Device'
import DeviceManager from './DeviceManager'

const EventEmitter = require('events').EventEmitter

let deviceManager

beforeEach(() => {
  deviceManager = new DeviceManager()
})

afterEach(() => {
  deviceManager = null
})

describe('setPeerID() test', () => {
  it('will set peerid when it is string', () => {
    const peerid = 'mypeerid'
    deviceManager.setPeerID(peerid)
    expect(deviceManager.peerid).toBe(peerid)
  })

  it('will throw error, when peerid is not string', () => {
    const peerid = 0
    expect(() => deviceManager.setPeerID(peerid)).toThrow()
  })
})

describe('_register() test', () => {
  let conn, data

  beforeEach(() => {
    conn = {}
    data = {
      type: 'response',
      target: 'profile',
      method: 'get',
      body: {
        uuid: 'test-uuid',
        ssg_peerid: 'ssg-peerid'
      }
    }
  })

  afterEach(() => {
    conn = null
    data = null
  })

  it('will register, when parameters are correct', () => {
    return deviceManager._register(conn, data).then(device => {
      expect(device).toBeInstanceOf(Device)
    })
  })

  it('will register only one later device, when same uuid is used', () => {
    const data2 = Object.assign({}, data, { body: { uuid: 'test-uuid', peerid: 'test-peerid', message: 'latest' }})

    return deviceManager._register(conn, data)
      .then(() => deviceManager._register(conn, data2))
      .then( device => {
        expect(deviceManager.devices).toHaveLength(1)
        expect(deviceManager.devices[0]).toMatchObject(device)
      })
  })

  it('will reject, when type is not "response"', () => {
    data.type = 'not_response'

    const test = deviceManager._register(conn, data)
      .catch( err => {
        expect(err).toBeInstanceOf(Error)
      })

    return test
  })
  it('will reject, when target is not "profile"', () => {
    data.target = 'not_profile'

    const test = deviceManager._register(conn, data)
      .catch( err => {
        expect(err).toBeInstanceOf(Error)
      })

    return test
  })
  it('will reject, when method is not "get"', () => {
    data.method = 'not_get'

    const test = deviceManager._register(conn, data)
      .catch( err => {
        expect(err).toBeInstanceOf(Error)
      })

    return test
  })
  it('will raise error, when body is undefined', () => {
    data.body = undefined

    return deviceManager._register(conn, data)
      .catch(err => expect(err.message).toBeDefined())
  })
  it('will raise error, when uuid is undefined', () => {
    data.body = {uuid: undefined}

    return deviceManager._register(conn, data)
      .catch(err => expect(err.message).toBeDefined() )
  })
  it('will raise error, when uuid is not string', () => {
    data.body = {uuid: 0}

    return deviceManager._register(conn, data)
      .catch(err => expect(err.message).toBeDefined())
  })
  it('will raise error, when conn is not object', () => {
    conn = 'hello world'

    return deviceManager._register(conn, data)
      .catch(err => expect(err.message).toBeDefined())
  })
})

class Conn extends EventEmitter {
  constructor() {
    super()

    this.preamble = 'SSG:'
    this.body = JSON.stringify({
      type: 'response',
      target: 'profile',
      method: 'get',
      body: {
        uuid: 'test-uuid',
        ssg_peerid: 'ssg-peerid'
      }
    })
    this.data = ''
    this.createData()
  }

  createData() {
    this.data = [this.preamble, this.body].join("")
  }

  send(path) {
    if(path === 'SSG:profile/get') this.emit('data', Buffer.from(this.data))
  }
}



describe('register() test', () => {
  let conn,device

  beforeEach(() => {
    conn = new Conn()
    device = new Device({
      uuid: 'test-uuid',
      profile: { uuid: 'test-uuid', ssg_peerid: 'ssg-peerid' },
      connection: conn,
      peerid: 'ssg-peerid'
    })
  })

  afterEach(() => {
    conn = null
    device = null
  })

  it('will register device, when profile response from peer is correct', () => {
    return deviceManager.register(conn).then( ret => {
      expect(ret).toMatchObject(device)
      expect(deviceManager.devices).toHaveLength(1)
    })
  })

  it('will raise timeout error, when profile response body is too short', () => {
    conn.body = ''
    conn.createData()
    jest.useFakeTimers()

    const test = deviceManager.register(conn)
      .then( device => console.log(device))
      .catch( err => {
        expect(err.message).toMatch(/timeout/)
      })
    jest.runAllTimers()
    return test
  })

  it('will reject, when profile preamble of response body is incorrect', () => {
    conn.preamble = 'ssg:'
    conn.createData()

    const test = deviceManager.register(conn)
      .catch( err => {
        expect(err).toBeInstanceOf(Error)
      })

    return test
  })

  it('will reject, when profile response does not include uuid', () => {
    // property should be uuid, not UUID
    conn.body = JSON.stringify({
      type: 'response', target: 'profile', method: 'get',
      body: { UUID: 'test-uuid', peerid: 'ssg-peerid' }
    })

    conn.createData()

    const test = deviceManager.register(conn)
      .catch( err => {
        expect(err).toBeInstanceOf(Error)
      })
    return test
  })

  it('will reject, when profile response does not include peerid', () => {
    // propery should be peerid, not PEERID
    conn.body = JSON.stringify({
      type: 'response', target: 'profile', method: 'get',
      body: { uuid: 'test-uuid', PEERID: 'ssg-peerid' }
    })

    conn.createData()

    const test = deviceManager.register(conn)
      .catch( err => {
        expect(err).toBeInstanceOf(Error)
      })
    return test
  })
})

describe('unregister() test', () => {
  let conn, device

  beforeEach(() => {
    conn = new Conn()
    device = new Device({
      uuid: 'test-uuid',
      profile: { uuid: 'test-uuid', ssg_peerid: 'ssg-peerid' },
      connection: conn,
      peerid: 'ssg-peerid'
    })
  })

  afterEach(() => {
    conn = null
    device = null
  })

  it('will remove device, when proper uuid is specified', () => {
    return deviceManager.register(conn)
      .then( device => {
        expect(deviceManager.devices).toHaveLength(1)
        return deviceManager.unregister(device.uuid)
      })
      .then( () => expect(deviceManager.devices).toHaveLength(0) )
  })

  it('will raise reject, when uuid is not exist', () => {
    return deviceManager.register(conn)
      .then( device => {
        expect(deviceManager.devices).toHaveLength(1)
        return deviceManager.unregister('unexist-uuid')
      }).catch(err => expect(err).toBeDefined())
  })
})

describe('setCallObect(uuid, call) test', () =>{
  let conn, device

  beforeEach(() => {
    conn = new Conn()
    device = new Device({
      uuid: 'test-uuid',
      profile: { uuid: 'test-uuid', ssg_peerid: 'ssg-peerid' },
      connection: conn,
      peerid: 'ssg-peerid'
    })
    deviceManager.register(conn)
  })

  afterEach(() => {
    conn = null
    device = null
  })

  it('will set call object, when uuid is exist. then return true', () => {
    expect(deviceManager.setCallObject('test-uuid', {})).toBe(true)
  })

  it('will return false, when uuid is unexist.', () => {
    expect(deviceManager.setCallObject('unexist-uuid', {})).toBe(false)
  })
})

describe('unsetCallObject(uuid) test', () => {
  let conn, device

  beforeEach(() => {
    conn = new Conn()
    deviceManager.register(conn)
      .then(() => deviceManager.setCallObject('test-uuid', {}))
  })

  afterEach(() => {
    conn = null
    device = null
  })

  it('will return true, when uuid is exist', () => {
    expect(deviceManager.unsetCallObject('test-uuid')).toBe(true)
  })

  it('will return false, when uuid is unexist', () => {
    expect(deviceManager.unsetCallObject('unexist-uuid')).toBe(false)
  })
})

describe('getCallObject(uuid) test', () => {
  let conn, device, callObj
  class Call {
  }

  beforeEach(done => {
    conn = new Conn()
    callObj = new Call()
    deviceManager.register(conn)
      .then(() => {
        deviceManager.setCallObject('test-uuid', callObj)
        done()
      })
  })

  afterEach(() => {
    conn = null
    device = null
    callObj = null
  })

  it('will return Object, when uuid is exist', () => {
    expect(deviceManager.getCallObject('test-uuid')).toBeInstanceOf(Call)
  })

  it('will return null, when uuid is unexist', () => {
    expect(deviceManager.getCallObject('unexist-uuid')).toBeNull()
  })
})

describe('utility methods test', () => {
  let conn, device

  beforeEach(() => {
    conn = new Conn()
    deviceManager.register(conn)

    device = new Device({
      uuid: 'test-uuid',
      profile: { uuid: 'test-uuid', ssg_peerid: 'ssg-peerid' },
      connection: conn,
      peerid: 'ssg-peerid'
    })
  })

  afterEach(() => {
    conn = null
    device = null
  })

  test('getDataChannelConnection() returns connection instance when uuid exists', () => {
    expect(deviceManager.getDataChannelConnection('test-uuid')).toMatchObject(conn)
  })

  test('getDataChannelConnection() returns null when uuid unexists', () => {
    expect(deviceManager.getDataChannelConnection('unexist-uuid')).toBeNull()
  })

  test('getPeerid() returns peerid when uuid exists', () => {
    expect(deviceManager.getPeerid('test-uuid')).toBe('ssg-peerid')
  })

  test('getPeerid() returns NULL when uuid unexists', () => {
    expect(deviceManager.getPeerid('unexist-uuid')).toBeNull()
  })

  test('getUUID() returns uuid when peerid exists', () => {
    expect(deviceManager.getUUID('ssg-peerid')).toBe('test-uuid')
  })

  test('getUUID() returns NULL when peerid unexists', () => {
    expect(deviceManager.getUUID('unexist-peerid')).toBeNull()
  })

  test('exist() returns true when uuid exists', () => {
    expect(deviceManager.exist('test-uuid')).toBe(true)
  })

  test('exist() returns false when uuid unexists', () => {
    expect(deviceManager.exist('unexist-uuid')).toBe(false)
  })
})
