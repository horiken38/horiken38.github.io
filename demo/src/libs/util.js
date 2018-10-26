// @flow

import Enum from 'enum'

const clientMessages = new Enum([
  'SEND_OFFER',
  'SEND_ANSWER',
  'SEND_CANDIDATE',
  'SEND_LEAVE',
  'ROOM_JOIN',
  'ROOM_LEAVE',
  'ROOM_GET_LOGS',
  'ROOM_GET_USERS',
  'ROOM_SEND_DATA',
  'SFU_GET_OFFER',
  'SFU_ANSWER',
  'SFU_CANDIDATE',
  'PING'
]);

const serverMessages = new Enum([
  'OPEN',
  'ERROR',
  'OFFER',
  'ANSWER',
  'CANDIDATE',
  'LEAVE',
  'ROOM_LOGS',
  'ROOM_USERS',
  'ROOM_DATA',
  'ROOM_USER_JOIN',
  'ROOM_USER_LEAVE',
  'SFU_OFFER'
]);



const util: {
  KEEPALIVETIMER: number,
  TIMEOUT: number,
  MESSAGE_TYPES: any,
  isJSONString: Function
}= {
  KEEPALIVETIMER: 25000,
  TIMEOUT: 5000,
  MESSAGE_TYPES : {
    CLIENT: clientMessages,
    SERVER: serverMessages
  },

  /**
  * check str is JSON string or not
  *
  * @params {string} str
  */
  isJSONString: function(str: string): boolean {
    if(typeof(str) !== 'string') return false

    try {
      const tmp = JSON.parse(str)
      return true
    } catch(e) {
      return false
    }
  }
}


export default util

