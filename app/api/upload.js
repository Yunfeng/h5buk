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

export function locallySaveKey (key, done, fail, always) {
  $.ajax({
    type: "post",
    url: "/Flight/material/local-save",
    dataType: "text",
    data: {'key': key}
  }).done(function (jsonResult) {
    // done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
    // fail(jqXHR.status, jqXHR.statusText)
  }).always(function () {
    // always()
  })
}