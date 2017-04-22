export function incPoints(params, done, fail, always) {
  $.ajax({
    type: 'post',
    url: '/Flight/user/customer/points',
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