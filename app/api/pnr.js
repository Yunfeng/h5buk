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