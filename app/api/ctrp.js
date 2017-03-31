export function syncSpecialPolicy (params, done, fail, always) {
  $.ajax({
    type: "post",
    url: "/Flight/api/syncSpecialPolicy",
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

export function searchBottomPrice(params, doneCb, fail, alwaysCb) {
  $.ajax({
    type: "post",
    url: "/Flight/api/searchPolicyManage",
    data: params,
    dataType: "json"
  })
  .done( function (jsonResult) {
    doneCb(jsonResult)
  })
  .always( alwaysCb() )
}

export function searchSpecialPolicy(params, doneCb, fail, alwaysCb) {
  $.ajax({
    type: "post",
    url: "/Flight/api/searchSpecialPolicy",
    data: params,
    dataType: "json"
  })
  .done( function (jsonResult) {
    doneCb(jsonResult)
  })
  .always( alwaysCb() )
}

export function searchSpecialPolicyDetail(id, doneCb, fail, alwaysCb) {
  $.ajax({
    type: "post",
    url: "/Flight/api/policy/special/" + id,
    dataType: "json"
  })
  .done( function (jsonResult) {
    doneCb(jsonResult)
  })
  .always( alwaysCb() )
}