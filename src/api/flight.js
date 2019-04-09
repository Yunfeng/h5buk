import { WEBAPP_NAME, callService } from '../common/common.js'

export function createFlightOrder(params, cbDone, cbAlways) {
  const url = WEBAPP_NAME + '/orders/createFlightOrder/v2'
  callService(url, {
    contentType: 'application/json',
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}

export function processPnrDetail(params, cbDone, cbAlways) {
  const url = WEBAPP_NAME + '/pnr/processPnrDetail'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbAlways: cbAlways
  })
}


export function rav(params, done, fail, always) {
  $.ajax({
    type: "post",
    url: "/Flight/flights/rav",
    timeout: 10000,
    data: params,
    dataType: "json"
  }).done(function (jsonResult) {
    done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
    fail(jqXHR.status, jqXHR.statusText)
  }).always(function () {
    always()
  })
}


export function searchTgq(params, done, fail, always) {
  $.ajax({
    type: "post",
    url: '/Flight/flights/tgq',
    timeout: 3000,
    data: params,
    dataType: "json"
  }).done(function (jsonResult) {
    done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
    // fail(jqXHR.status, jqXHR.statusText)
  }).always(function () {
    // always()
  })
}

