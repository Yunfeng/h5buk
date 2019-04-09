import { WEBAPP_NAME } from '../common/common.js'

export function searchCities(done, fail, always) {
  $.ajax({
    type: 'post',
    url: WEBAPP_NAME + '/api/cities',
    dataType: 'json',
  }).done(function (jsonResult) {
    done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
    // fail(jqXHR.status, jqXHR.statusText)
  }).always(function () {
    if (always !== undefined)
      always()
  })
}