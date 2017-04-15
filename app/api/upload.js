export function getUploadToken (params, done, fail, always) {
  $.ajax({
    type: "post",
    url: "/Flight/upload/uploadToken",
    dataType: "text"
  }).done(function (jsonResult) {
    done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
    fail(jqXHR.status, jqXHR.statusText)
  }).always(function () {
    always()
  })
}