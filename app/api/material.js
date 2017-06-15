import { WEBAPP_NAME } from '../common/common.js'

export function searchMaterials(params, done, fail, always) {
  $.ajax({
    type: "post",
    url: WEBAPP_NAME + '/material/list',
    timeout: 10000,
    data: params,
    dataType: "json"
  }).done(function (jsonResult) {
    done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
    // fail(jqXHR.status, jqXHR.statusText)
  }).always(function () {
    always()
  })
}

export function searchMediaName(id, done, fail, always) {
  $.ajax({
    type: "post",
    url: "/Flight/material/" + id,
    timeout: 10000,
    dataType: "json"
  }).done(function (jsonResult) {
    done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
  }).always(function () {
  })
}

export function saveMediaPlayStatus(id, status, done, fail, always) {
  $.ajax({
    type: 'post',
    url: '/Flight/material/' + id + '/play/' + status,
    timeout: 10000,
    dataType: "json"
  }).done(function (jsonResult) {
    // done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
  }).always(function () {
  })
}

export function isMediaAdmin(id, done, fail, always) {
  $.ajax({
    type: 'post',
    url: '/Flight/material/' + id + '/isAdmin',
    timeout: 10000,
    dataType: "json"
  }).done(function (jsonResult) {
    done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
  }).always(function () {
  })
}

export function updateMediaInfo(params, done, fail, always) {
  $.ajax({
    type: 'post',
    url: '/Flight/material/update',
    timeout: 10000,
    dataType: "json",
    data: params
  }).done(function (jsonResult) {
    done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
  }).always(function () {
  })
}

export function searchWxMaterials(params, done, fail, always) {
  $.ajax({
    type: "post",
    url: WEBAPP_NAME + '/material/wx/list',
    timeout: 10000,
    data: params,
    dataType: "json"
  }).done(function (jsonResult) {
    done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
    // fail(jqXHR.status, jqXHR.statusText)
  }).always(function () {
    always()
  })
}