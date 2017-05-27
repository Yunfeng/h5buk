import { WEBAPP_NAME } from '../common/common.js'

export function createGroupTravel(params, done, fail, always) {
  $.ajax({
    type: 'post',
    url: WEBAPP_NAME + '/group/create',
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

export function searchGroups(params, done, fail, always) {
  $.ajax({
    type: 'post',
    url: WEBAPP_NAME + '/group/list',
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

export function getGroupTravel(id, done, fail, always) {
  $.ajax({
    type: 'post',
    url: WEBAPP_NAME + '/group/' + id,
    dataType: 'json',
  }).done(function (jsonResult) {
    done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
    fail(jqXHR.status, jqXHR.statusText)
  }).always(function () {
    always()
  })
}