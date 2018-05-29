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

export function searchMyTrips(params, done, fail, always) {
  $.ajax({
    type: 'post',
    url: WEBAPP_NAME + '/trip/my-list',
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

export function createTripDay(params, done, fail, always) {
  $.ajax({
    type: 'post',
    url: WEBAPP_NAME + '/trip/day/create',
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

export function delTripDayInfo(id, done, fail, always) {
  $.ajax({
    type: 'post',
    url: WEBAPP_NAME + '/trip/day/' + id + '/delete',
    dataType: 'json',
  }).done(function (jsonResult) {
    done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
    fail(jqXHR.status, jqXHR.statusText)
  }).always(function () {
    always()
  })
}

export function createTripPrice(params, done, fail, always) {
  $.ajax({
    type: 'post',
    url: WEBAPP_NAME + '/trip/price/create',
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

export function delTripPriceInfo(id, done, fail, always) {
  $.ajax({
    type: 'post',
    url: WEBAPP_NAME + '/trip/price/' + id + '/delete',
    dataType: 'json',
  }).done(function (jsonResult) {
    done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
    fail(jqXHR.status, jqXHR.statusText)
  }).always(function () {
    always()
  })
}