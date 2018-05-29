import { WEBAPP_NAME } from '../common/common.js'

export function searchSubscribers(params, done, fail, always) {
  $.ajax({
    type: 'post',
    url: '/Flight/weixin/subscribers',
    dataType: 'json',
    data: params
  }).done(function (jsonResult) {
    done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
    // fail(jqXHR.status, jqXHR.statusText)
  }).always(function () {
    if (always !== undefined && always !== null) {
      always()  
    }    
  })
}

export function searchTemplates(params, done, fail, always) {
  $.ajax({
    type: 'post',
    url: '/Flight/weixin/templates',
    // dataType: 'json',
    data: params
  }).done(function (jsonResult) {
    done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
    // fail(jqXHR.status, jqXHR.statusText)
  }).always(function () {
    always()
  })
}

export function searchCustomMenus(done, fail, always) {
  $.ajax({
    type: 'post',
    url: '/Flight/weixin/menus',
    dataType: 'json'
  }).done(function (jsonResult) {
    done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
    // fail(jqXHR.status, jqXHR.statusText)
  }).always(function () {
    always()
  })
}

export function deleteCustomMenu(id, done, fail, always) {
  $.ajax({
    type: 'post',
    url: '/Flight/weixin/menu/' + id + '/delete',
    dataType: 'json'
  }).done(function (jsonResult) {
    done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
    // fail(jqXHR.status, jqXHR.statusText)
  }).always(function () {
    always()
  })
}

export function createCustomMenu(params, done, fail, always) {
  $.ajax({
    type: 'post',
    url: '/Flight/weixin/menu/create',
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

export function searchEntConfig(done, fail, always) {
  $.ajax({
    type: 'post',
    url: WEBAPP_NAME + '/user/searchEntConfig',
    dataType: 'json',
  }).done(function (jsonResult) {
    done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
    // fail(jqXHR.status, jqXHR.statusText)
  }).always(function () {
    always()
  })
}

export function saveEntConfig(params, done, fail, always) {
  $.ajax({
    type: 'post',
    url: WEBAPP_NAME + '/user/updateEntConfig',
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

export function searchHistoryRav(params, done, fail, always) {
  $.ajax({
    type: 'post',
    url: WEBAPP_NAME + '/flights/rav/history',
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
