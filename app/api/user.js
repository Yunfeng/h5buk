import { WEBAPP_NAME, callService } from '../common/common.js'

export function getProfile(cbDone, cbFail, cbAlways) {
  const url = WEBAPP_NAME + '/user/profile'
  callService(url, {
    type: 'get',
    cbDone: cbDone,
    cbFail: cbFail,
    cbAlways: cbAlways
  })
}

export function updateProfile(params, cbDone, cbFail, cbAlways) {
  const url = WEBAPP_NAME + '/user/profile'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbFail: cbFail,
    cbAlways: cbAlways
  })
}

export function incPoints(params, done, fail, always) {
  $.ajax({
    type: 'post',
    url: '/Flight/user/customer/points',
    data: params,
    dataType: 'json',
  }).done(function (jsonResult) {
    done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
    // fail(jqXHR.status, jqXHR.statusText)
  }).always(function () {
    always()
  })
}

export function searchCustomers(params, done, fail, always) {
  $.ajax({
    type: 'post',
    url: '/Flight/user/customers',
    data: params,
    dataType: 'json',
  }).done(function (jsonResult) {
    done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
    // fail(jqXHR.status, jqXHR.statusText)
  }).always(function () {
    if (always !== null) {
      always()  
    }
  })
}

export function checkIn(done) {
  $.ajax({
    type: 'post',
    url: '/Flight/user/checkIn',
    dataType: 'json',
  }).done(function (jsonResult) {
    done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
    // fail(jqXHR.status, jqXHR.statusText)
  }).always(function () {
  })
}
