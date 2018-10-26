import util from './util'

describe('utility test', () => {
  test('isJSONString return true, when str is JSON String', () => {
    const str = JSON.stringify({"text": "hello"})
    expect(util.isJSONString(str)).toBe(true)
  })
  test('isJSONString return false, when str is not String', () => {
    const str = 1
    expect(util.isJSONString(str)).toBe(false)
  })
  test('isJSONString return false, when str is not JSON String', () => {
    const str = "hello"
    expect(util.isJSONString(str)).toBe(false)
  })
})
