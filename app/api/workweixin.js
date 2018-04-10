import { WEBAPP_NAME, callService } from '../common/common.js'

export function authWorkWeixinUser(params, cbDone) {
  const url = WEBAPP_NAME + '/ww/user'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}
