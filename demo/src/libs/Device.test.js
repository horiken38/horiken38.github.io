import Device from './Device'

describe('constructor test', () => {
  let params

  beforeAll(() => {
    params = Object.assign({}, {
      uuid: 'test-uuid',
      profile: {},
      connection: {},
      peerid: 'test-peerid'
    })
  })

  afterAll(() => {
    params = {}
  })

  test('params is correct, it returns Device object', () => {
    expect(new Device(params)).toBeInstanceOf(Device)
  })

  test('when uuid is not string, it throws Error', () => {
    params.uuid = 0

    expect(() => new Device(params)).toThrow()
  })
  test('when profile is not object, it throws Error', () => {
    params.profile = 0

    expect(() => new Device(params)).toThrow()
  })
  test('when connection is not object, it throws Error', () => {
    params.connection = 0

    expect(() => new Device(params)).toThrow()
  })
})

describe('setCallObj and unsetCallObj test', () => {
  let device,params

  beforeEach(() => {
    params = Object.assign({}, {
      uuid: 'test-uuid',
      profile: {},
      connection: {},
      peerid: 'test-peerid'
    })
    device = new Device(params)
  })

  afterEach(() => {
    params = {}
    device = null
  })

  test('setCallObj(callobj) return true, when typeof callobj equal object', () => {
    expect(device.setCallObj({})).toBe(true)
  })

  test('setCallObj(callobj) return false, when typeof callobj is not object', () => {
    expect(device.setCallObj(null)).toBe(false)
  })

  test('unsetCallObj() remove callobj', () => {
    device.setCallObj({})
    expect(device.callobj).toBeInstanceOf(Object)
    device.unsetCallObj()
    expect(device.callobj).toBeNull()
  })
})

