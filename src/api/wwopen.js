import { WEBAPP_NAME, callService } from '../common/common.js'

export function getLoginInfo(params, cbDone, cbAlways) {
  const url = WEBAPP_NAME + '/wwopen/login'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function getUserInfo(params, cbDone, cbAlways) {
  const url = WEBAPP_NAME + '/wwopen/user'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}
