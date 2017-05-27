import { WEBAPP_NAME } from '../common/common.js'

export function createTrip(params, done, fail, always) {
  $.ajax({
    type: 'post',
    url: WEBAPP_NAME + '/trip/create',
    dataType: 'json',
    data: params
  }).done(function (jsonResult) {
    done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
    // fail(jqXHR.status, jqXHR.statusText)
  }).always(function () {
    always()
  })
}

export function searchTrips(params, done, fail, always) {
  $.ajax({
    type: 'post',
    url: WEBAPP_NAME + '/trip/list',
    dataType: 'json',
    data: params
  }).done(function (jsonResult) {
    done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
    // fail(jqXHR.status, jqXHR.statusText)
  }).always(function () {
    always()
  })
}

export function getTripDetail(id, done, fail, always) {
  $.ajax({
    type: 'post',
    url: WEBAPP_NAME + '/trip/' + id,
    dataType: 'json',
  }).done(function (jsonResult) {
    done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
    fail(jqXHR.status, jqXHR.statusText)
  }).always(function () {
    always()
  })
}