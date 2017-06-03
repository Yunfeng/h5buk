import { WEBAPP_NAME } from '../common/common.js'

export function createInsurance(params, done, fail, always) {
  $.ajax({
    type: 'post',
    url: WEBAPP_NAME + '/p/insurance/create',
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

export function searchInsurances(params, done, fail, always) {
  $.ajax({
    type: 'post',
    url: WEBAPP_NAME + '/p/insurances',
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

export function deleteInsurance(id, done, fail, always) {
  $.ajax({
    type: 'post',
    url: WEBAPP_NAME + '/p/insurance/delete/' + id,
    dataType: 'json'
  }).done(function (jsonResult) {
    done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
    // fail(jqXHR.status, jqXHR.statusText)
  }).always(function () {
    always()
  })
}