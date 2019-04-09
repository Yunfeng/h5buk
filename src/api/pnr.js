export function statPnr(params, done, fail, always) {
  $.ajax({
    type: 'post',
    url: '/Flight/pnr/stat',
    data: params,
    dataType: 'json',
  }).done(function (jsonResult) {
    done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
    fail(jqXHR.status, jqXHR.statusText)
  }).always(function () {
    always()
  })
}

export function searchTpr(params, done, fail, always) {
  $.ajax({
    type: 'post',
    url: '/Flight/flights/tprs/',
    data: params,
    dataType: 'json',
  }).done(function (jsonResult) {
    done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
    fail(jqXHR.status, jqXHR.statusText)
  }).always(function () {
    always()
  })
}

export function getPnr(id, done, fail, always) {
  $.ajax({
    type: 'post',
    url: '/Flight/pnr/' + id,
    dataType: 'json',
  }).done(function (jsonResult) {
    done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
    fail(jqXHR.status, jqXHR.statusText)
  }).always(function () {
    always()
  })
}

export function searchPnr(params, done, fail, always) {
  $.ajax({
    type: 'post',
    url: '/Flight/pnr/list',
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

export function searchPnrUsed(params, done, fail, always) {
  $.ajax({
    type: 'post',
    url: '/Flight/pnr/listUsed',
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
