export function searchMaterials(params, done, fail, always) {
  $.ajax({
    type: "post",
    url: "/Flight/material/list",
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

export function syncMaterials(params, done, fail, always) {
  $.ajax({
    type: "post",
    url: "/Flight/material/sync",
    timeout: 10000,
    dataType: "json"
  }).done(function (jsonResult) {
    done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
    fail(jqXHR.status, jqXHR.statusText)
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