// @flow

/**
 * Device Manager
 *
 *
 */

import Device from './Device'
import util from './util'

const PROFILE_GET  = 'SSG:profile/get'
const STREAM_START = 'SSG:stream/start'
const STREAM_STOP  = 'SSG:stream/stop'
const TIMEOUT = 30000

class DeviceManager {
  devices: Array<Device>  // store other connecting devices
  peerid: string  // peerid of this device
  timeout: number   // timeout value waiting for profile from other device

  constructor() {
    this.devices = []
    this.peerid = ""
    this.timeout = TIMEOUT
  }

  /**
   * @param {string} peerid - my peerid
   */
  setPeerID(peerid: string): void {
    if( typeof(peerid) !== 'string' )
      throw new Error('setPeerID: peerid should be string')

    this.peerid = peerid
  }

  /**
   * This method 1st send request to get profile for peer.
   * When we receive respond of profile data, beginning from the preamble of 'SSG:',
   * we will register this device.
   *
   * @param {objcect} conn - datachannel connection object
   */
  register(conn: Object): Promise<any> {
    return new Promise((resolv, reject) => {
      let retFlag = false

      // listener for profile response
      const registerListener =  data => {
        if(data.length <= 4) return
        conn.removeListener('data', registerListener)
        retFlag = true

        const head = data.slice(0,4).toString()
          , body = data.slice(4).toString()

        if(head !== "SSG:" ||  !util.isJSONString(body)) {
          reject(new Error( 'register error' ));
        } else {
          this._register(conn, JSON.parse(body))
            .then((device) => {
              resolv(device)
            }).catch(err => {
              reject(err)
            })
        }
      }

      // set listener
      conn.on('data', registerListener)

      // send profile request
      conn.send(PROFILE_GET)

      setTimeout(() => {
        if(!retFlag) reject( new Error('register: timeout'))
      }, this.timeout)
    })
  }

  /**
   * unregister device
   *
   * @param {string} uuid - uuid of target device
   *
   */
  unregister(uuid: string): Promise<any> {
    return new Promise((resolv, reject) => {
      this.devices = this.devices.filter(device => device.uuid !== uuid)
      resolv()
    })
  }

  /**
   * set call object
   *
   * @param {string} uuid
   * @param {Object} callobj
   */
  setCallObject(uuid: string, callobj: Object): boolean {
    let ret = false
    this.devices.filter(device => device.uuid === uuid)
      .forEach(device => {
        ret = device.setCallObj(callobj)
      })

    return ret
  }

  /**
   * unset call object
   *
   * @param {string} uuid
   */
  unsetCallObject(uuid: string): boolean {
    let ret = false

    this.devices.filter(device => device.uuid === uuid)
      .forEach(device => {
        device.unsetCallObj()
        ret = true
      })

    return ret
  }

  /**
   * get call object
   *
   * @param {string} uuid
   */
  getCallObject(uuid: string): Object|null {
    let ret = null
    this.devices.filter(device => device.uuid === uuid)
      .forEach(device => {
        ret = device.callobj
      })

    return ret
  }

  /**
   *
   * @param {object} conn - connection object
   * @param {object} data - data
   */
  _register(conn: Object, data: Object): Promise<any> {
    return new Promise((resolv, reject) => {
      const uuid      = data.body && data.body.uuid
        , peerid      = data.body && ( data.body.peerid || data.body.ssg_peerid )
        , connection  = conn
        , profile     = data.body

      try {
        if(data.type === 'response' && data.target === 'profile' && data.method === 'get') {
          const device = new Device({uuid, peerid, connection, profile})

          // we will avoid duplicationg uuid. previous one will be removed
          this.devices = this.devices.filter(_device => _device.uuid !== uuid)

          this.devices.push(device)
          resolv(device)
        } else {
          reject( new Error(`_register - does not match. type: ${data.type}, target: ${data.target}, method: ${data.method}`) );
        }
      } catch(err) {
        reject(err)
      }
    })
  }



  /**
   *
   * @param {string} uuid
   */
  getDataChannelConnection(uuid: string): Object | null{
    let conn = null;

    this.devices.filter(device => {return device.uuid === uuid})
      .forEach(device => conn = device.connection )

    return conn;
  }

  /**
   *
   * @param {string} uuid
   */
  getPeerid(uuid: string): string | null {
    let peerid = null;

    this.devices.filter(device => device.uuid === uuid)
      .forEach(device => peerid = device.peerid )

    return peerid
  }

  /**
   *
   * @param {string} peerid
   */
  getUUID(peerid: string): string | null {
    let uuid = null;

    this.devices.filter(device => device.peerid === peerid)
      .forEach(device => uuid = device.uuid)

    return uuid
  }


  /**
   * @param {string} uuid
   */
  exist(uuid: string): boolean {
    let ret = false

    this.devices.filter(device => device.uuid === uuid)
      .forEach(device => ret = true)
    return ret
  }
}

export default DeviceManager
