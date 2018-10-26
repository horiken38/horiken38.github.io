const Response = require('./response')

describe('check constructor', () => {
  let options = {}

  beforeEach(() => {
    options = Object.assign({}, {
      status: 200,
      method: "get",
      transaction_id: 12345,
      text: "hoge"
    })
  })

  afterEach(() => {
    options = Object.assign({})
  })

  test('correct pattern', () => {
    expect(new Response(options)).toBeDefined()
  })

  test('status code is not number', () => {
    options = Object.assign({}, options, {status: "200"})
    expect(() => new Response(options)).toThrow()
  })

  test('method is not string', () => {
    options = Object.assign({}, options, {method: 80})
    expect(() => new Response(options)).toThrow()
  })

  test('transaction_id is not number', () => {
    options = Object.assign({}, options, {transaction_id: "hoge"})
    expect(() => new Response(options)).toThrow()
  })

  test('text is not string', () => {
    options = Object.assign({}, options, {text: 80})
    expect(() => new Response(options)).toThrow()
  })
})


describe('check text()', () => {
  test('text() returns options.text', () => {
    let response = new Response({
      status: 200,
      method: 'get',
      transaction_id: 123,
      text: 'hello'
    })

    return response.text().then( text => expect(text).toBe('hello') )
  })
})

describe('check json()', () => {
  test('when text is JSON stringified, it returns json object', () => {
    const response = new Response({
      status: 200,
      method: 'get',
      transaction_id: 123,
      text: JSON.stringify({text: 'hello'})
    })

    return response.json().then(json => expect(json).toEqual({text: 'hello'}))
  })

  test('when text is not JSON stringified, it calls reject()', () => {
    const response = new Response({
      status: 200,
      method: 'get',
      transaction_id: 123,
      text: 'non json string'
    })

    return response.json().catch( e => expect(e.message).toMatch('Unexpected'))
  })
})

