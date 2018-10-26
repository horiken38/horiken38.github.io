// @flow

class Device {
  uuid: string // uuid of this device
  profile: Object // profile data
  connection: Object // SkyWay connection object of this device
  peerid: string // peerid of this device
  callobj: Object|null // SkyWay call object of this device

  /**
   * @params {string} uuid
   * @params {object} profile
   * @params {object} connection
   * @params {string} peerid
   */
  constructor( {uuid, profile, connection, peerid}:
      {uuid: string, profile: Object, connection: Object, peerid: string} ) {
    if( typeof(uuid) !== 'string') throw new Error(`Device: wrong uuid : ${uuid}`)
    if( typeof(profile) !== 'object') throw new Error(`Device: wrong profile: ${typeof(profile)}`)
    if( typeof(connection) !== 'object') throw new Error(`Device: wrong connection: ${typeof(connection)}`)
    if( typeof(peerid) !== 'string' ) throw new Error(`Device: wrong peerid : ${peerid}`)

    this.uuid = uuid
    this.profile = profile
    this.connection = connection
    this.peerid = peerid
    this.callobj = null
  }

  /**
   * @param {Object} callobj
   */
  setCallObj(callobj: Object): boolean {
    if(callobj !== null && typeof(callobj) === 'object') {
      this.callobj = callobj
      return true
    } else {
      return false
    }
  }

  /**
   */
  unsetCallObj(): void {
    this.callobj = null
  }
}

export default Device
