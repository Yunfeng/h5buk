import { WEBAPP_NAME, callService } from '../common/common.js'

export function getWxOpenid(params, cbDone) {
  const url = WEBAPP_NAME + '/weixin/getOpenId'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function getWxUserInfo(params, cbDone) {
  const url = WEBAPP_NAME + '/weixin/getUserInfo'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function initJsSdkParam(url, done, fail, always) {
  $.ajax({
    type: "post",
    url: "/Flight/weixin/jssdk_config",
    timeout: 10000,
    data: { 'url': url },
    dataType: "json"
  }).done(function (jsonResult) {
    done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
    // fail(jqXHR.status, jqXHR.statusText)
  }).always(function () {
    // always()
  })
}

export function getDomainUrl (cb) {
  $.ajax({
    type: 'post',
    url: '/Flight/pay/domain',
    dataType: 'text',
    success: function (jsonResult) {
      cb(jsonResult)
    }
  })    
}