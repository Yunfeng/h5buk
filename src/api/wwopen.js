import { WEBAPP_NAME, callService } from '../common/common.js'

export function getLoginInfo(params, cbDone) {
  const url = WEBAPP_NAME + '/wwopen/login'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}
