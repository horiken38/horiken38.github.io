// @flow

/**
 * Response class for SiRuClient
 * @class
 *
 * @param {Object} params - parameter
 * @param {number} params.status - 200,404 etc.
 * @param {string} params.method - "get", "post" etc
 * @param {number} params.transaction_id - transaction id
 * @param {string} params.text - response text
 */
class Response {
  status: number
  method: string
  transaction_id: number
  _text: string

  constructor( params: Object ) {

    if( typeof(params.status) !== 'number' ||
        typeof(params.method) !== 'string' ||
        typeof(params.transaction_id) !== 'number' ||
        typeof(params.text) !== 'string' ) throw new Error('invalid options')

    this.status = params.status
    this.method = params.method
    this.transaction_id = params.transaction_id
    this._text = params.text
  }
  /**
   * get response text
   *
   * @returns {Promise<string>} response text
   * @method Response#text
   */
  text():Promise<string> {
    return new Promise((resolv, reject) => {
      if(this._text && typeof(this._text) === 'string') resolv(this._text)
      else reject(new Error("can not find text"))
    })
  }

  /**
   * get response in json object
   *
   * @returns {Promise<Object>} response in json object
   * @method Response#json
   */
  json():Promise<Object> {
    return new Promise((resolv, reject) => {
      this.text().then(text => {
        try {
          const json = JSON.parse(text)
          resolv(json)
        } catch(err) {
          reject(err)
        }
      }).catch(err => {
        reject(err)
      })
    })
  }
}

module.exports = Response
