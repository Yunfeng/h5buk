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

export function processPnrDetail(params, done, fail, always) {
  $.ajax({
    type: "post",
    url: '/Flight/pnr/processPnrDetail',
    timeout: 3000,
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
