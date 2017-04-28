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
    always()
  })
}