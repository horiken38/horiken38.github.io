import SiRuClient from './SiRuClient'

jest.mock('skyway-js')

let roomName, key
beforeAll(() => {
  roomName = 'testroom'
  key = 'test-key'
})
afterAll(() => {
  roomName = ''
})

describe('constructor() test', () => {
  let siru
  beforeEach(() => {
    siru = new SiRuClient(roomName, {key})
  })

  afterEach(() => {
    siru = null
  })


  test('when constructed, it will emit series of state messages', done => {
    const __events = []
    const expected = [
      'SKYWAY_CONNECTED',
      'ROOM_JOINED',
      'USER_LIST_OBTAINED',
      'STARTED'
    ]

    // check making instance succeeded
    expect(siru).toBeInstanceOf(SiRuClient)

    // after construction, 'connect' message will be fired. we will check state events at that moment.
    siru.on('state:change', state => {
      __events.push(state)
    })

    siru.on('connect', () => {
      expect(__events).toMatchObject(expected)
      done()
    })
  })

  it('will fire meta event, after creation finished.', done => {
    siru.on('meta', profile => {
      expect(profile).toBeInstanceOf(Object)
      done()
    })
  })

  it('will raise error, when roomName is not specified', () => {
    expect(() => new SiRuClient(undefined, { key })).toThrow()
    expect(() => new SiRuClient(123, { key })).toThrow()
  })
  it('will raise error, when key is not specified', () => {
    expect(() => new SiRuClient(roomName, { })).toThrow()
  })
})

describe('fetch() test', () => {
  let siru
  beforeEach(() => {
    siru = new SiRuClient(roomName, {key})
  })

  afterEach(() => {
    siru = null
  })
  it('will return "hello", when request path is "test-uuid/echo/hello"', done => {
    setTimeout( ev => {
      siru.fetch('test-uuid/echo/hello')
        .then(res => res.text())
        .then(text => {
          expect(text).toBe('hello')
          done()
        })
    }, 500)
  })

  it('will reject(), when request path is "unexist-uuid/echo/hello"', () => {
    return siru.fetch('unexist-uuid/echo/hello').catch( err => {
      expect(err).toBeDefined()
    })
  })
})

describe('pubsub test', () => {
  let siru

  beforeEach(() => {
    siru = new SiRuClient(roomName, {key})
  })

  afterEach(() => {
    siru = null
  })

  test('subscribe add topic', () => {
    expect(siru.subscribe('test')).toBeUndefined()
    expect(siru.topics).toMatchObject(['test'])
  })

  test('subscribe will raise error when topic is not string', () => {
    expect( () => siru.subscribe(0)).toThrow()
  })

  test('when subscribe called with same topic, only one ', () => {
    siru.subscribe('same-topic')
    siru.subscribe('same-topic')
    expect(siru.topics).toMatchObject(['same-topic'])
  })

  test('unsubscribe remove topic', () => {
    siru.subscribe('test')
    siru.subscribe('other-topic')
    expect(siru.topics).toMatchObject(['test', 'other-topic'])
    siru.unsubscribe('other-topic')
    expect(siru.topics).toMatchObject(['test'])
  })

  test('unsubscribe will raise error when topic is not string', () => {
    expect( () => siru.unsubscribe(0)).toThrow()
  })

  test('publish will fire string message, when subscribed', done => {
    siru.subscribe('test')

    siru.on('message', (topic, message) => {
      expect(topic).toBe('test')
      expect(message).toBe('hello')
      done()
    })

    siru._handleDCData(JSON.stringify({topic: 'test', payload: 'hello'}) )
  })

  test('publish will fire Object message, when subscribed', done => {
    siru.subscribe('test')

    siru.on('message', (topic, message) => {
      expect(topic).toBe('test')
      expect(message).toMatchObject({str: 'hello'})
      done()
    })

    siru._handleDCData(JSON.stringify({topic: 'test', payload: { str: 'hello'}}) )
  })

  test('wildcard test with `test/+` for subscribe', done => {
    siru.subscribe('test/+')

    siru.on('message', (topic, message) => {
      expect(topic).toBe('test/fuga')
      expect(message).toBe('hello')
      done();
    });

    siru._handleDCData(JSON.stringify({topic: 'test/fuga', payload: 'hello'}) )
  });

  test('wildcard test with `+/fuga` for subscribe', done => {
    siru.subscribe('+/fuga')

    siru.on('message', (topic, message) => {
      expect(topic).toBe('test/fuga')
      expect(message).toBe('hello')
      done();
    });

    siru._handleDCData(JSON.stringify({topic: 'test/fuga', payload: 'hello'}) )
  });

  test('wildcard test with `test/+/+` for subscribe', done => {
    siru.subscribe('test/+/+')

    siru.on('message', (topic, message) => {
      expect(topic).toBe('test/fuga/hoge')
      expect(message).toBe('hello')
      done();
    });

    siru._handleDCData(JSON.stringify({topic: 'test/fuga/hoge', payload: 'hello'}) )
  });

  test('wildcard test with `test/#` for subscribe', done => {
    siru.subscribe('test/#')

    siru.on('message', (topic, message) => {
      expect(topic).toBe('test/fuga/hoge')
      expect(message).toBe('hello')
      done();
    });

    siru._handleDCData(JSON.stringify({topic: 'test/fuga/hoge', payload: 'hello'}) )
  });





  test('publish will raise error, when topic is not string', () => {
    expect(() => siru.publish(0, 'hoge')).toThrow()
  })

  test('publish will raise error, when message is not string', () => {
    expect(() => siru.publish('test', 0)).toThrow()
  })

  test('publish will not be fired, when not subscribed', done => {
    let ret

    siru.on('message', (topic, message) => {
      ret = message
    })
    siru.publish('test', 'hello')
    setTimeout( ev => {
      expect(ret).toBeUndefined()
      done()
    }, 1000)
  })
})

describe('streaming test', () => {
  let siru
  const uuid = 'test-uuid'
  beforeEach(() => {
    siru = new SiRuClient(roomName, {key})
  })

  afterEach(() => {
    siru = null
  })

  test('requestStreaming() will resolv stream object', done => {
    setTimeout( ev => {
      siru.requestStreaming(uuid)
        .then( stream => {
          expect(stream).toBeInstanceOf(Object)
          done()
        })
    }, 500)
  })

  test('stopStreaming() will resolv', done => {
    setTimeout( ev => {
      siru.requestStreaming(uuid)
        .then( stream => siru.stopStreaming(uuid) )
        .then( dummy => {
          expect(dummy).toBeUndefined()
          done()
        })
   }, 500)
  })
})

describe('sendStream() test', () => {
  // todo - write timeout test
  //
  let siru
  const uuid = 'test-uuid'

  beforeEach(() => {
    siru = new SiRuClient(roomName, {key})
  })

  afterEach(() => {
    siru = null
  })

  test('sendStream return resolve when proper arguments are set', done => {
    setTimeout( ev => {
      const stream = new Object();
      siru.sendStream( uuid, stream )
        .then( call => {
          expect( call ).toBeDefined();
          done();
        });
    }, 500);
  })
  test('sendStream return reject when uuid is not exist', done => {
    setTimeout( ev => {
      const stream = new Object();
      siru.sendStream( 'unexist-id', stream )
        .catch( err => {
          expect( err ).toBeInstanceOf(Error);
          done();
        });
    }, 500);
  })
  test('sendStream return reject when uuid is not set', done => {
    setTimeout( ev => {
      siru.sendStream()
        .catch( err => {
          expect( err ).toBeInstanceOf(Error);
          done();
        });
    }, 500);
  })
  test('sendStream return reject when uuid is not string', done => {
    setTimeout( ev => {
      const stream = new Object();
      siru.sendStream( 12345, stream )
        .catch( err => {
          expect( err ).toBeInstanceOf(Error);
          done();
        });
    }, 500);
  })

  test('sendStream return reject when stream is not set', done => {
    setTimeout( ev => {
      siru.sendStream( 12345 )
        .catch( err => {
          expect( err ).toBeInstanceOf(Error);
          done();
        });
    }, 500);
  })
  test('sendStream return reject when stream is not object', done => {
    setTimeout( ev => {
      siru.sendStream( uuid, 'hoge' )
        .catch( err => {
          expect( err ).toBeInstanceOf(Error);
          done();
        });
    }, 500);
  })
  test('sendStream return reject when options is set but not object', done => {
    setTimeout( ev => {
      const stream = new Object();
      siru.sendStream( uuid, stream, 123 )
        .catch( err => {
          expect( err ).toBeInstanceOf(Error);
          done();
        });
    }, 500);
  })
});
