export function processOrder(url, params, done, fail, always) {
  $.ajax({
    type: 'post',
    url: url,
    data: params,
    dataType: 'json'
  }).done(function (jsonResult) {
    done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
    if (fail !== null) {
      fail(jqXHR.status, jqXHR.statusText)  
    }    
  }).always(function () {
    always()
  })
}

export function searchOrders(params, done, fail, always) {
  $.ajax({
    type: 'post',
    url: '/Flight/orders/search.do',
    data: params,
    dataType: 'json',
  }).done(function (jsonResult) {
    done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
    fail(jqXHR.status, jqXHR.statusText)
  }).always(function () {
    always()
    // setTimeout(() => { always() }, 5000)
  })
}

export function searchOrderDetail(params, done, fail, always) {
  $.ajax({
    type: 'post',
    url: '/Flight/orders/searchOrderDetail',
    data: params,
    dataType: 'json',
  }).done(function (jsonResult) {
    done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
    fail(jqXHR.status, jqXHR.statusText)
  }).always(function () {
    always()
    // setTimeout(() => { always() }, 5000)
  })
}

export function searchPolicies(params, done, fail, always) {
  $.ajax({
    type: 'post',
    url: '/Flight/policies/',
    data: params,
    dataType: 'json',
  }).done(function (jsonResult) {
    done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
    fail(jqXHR.status, jqXHR.statusText)
  }).always(function () {
    always()
    // setTimeout(() => { always() }, 5000)
  })
}

export function cancelOrder(params, done, fail, always) {
  $.ajax({
    type: 'post',
    url: '/Flight/orders/cancelTmcOrder.do',
    data: params,
    dataType: 'json',
  }).done(function (jsonResult) {
    done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
    fail(jqXHR.status, jqXHR.statusText)
  }).always(function () {
    always()
    // setTimeout(() => { always() }, 5000)
  })
}

export function commitRefundRequest(params, done, fail, always) {
  $.ajax({
    type: 'post',
    url: '/Flight/refunds/createRefundOrder',
    data: params,
    dataType: 'json',
  }).done(function (jsonResult) {
    done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
    fail(jqXHR.status, jqXHR.statusText)
  }).always(function () {
    always()
    // setTimeout(() => { always() }, 5000)
  })
}

export function searchRefundOrders(params, done, fail, always) {
  $.ajax({
    type: 'post',
    url: '/Flight/refunds/',
    data: params,
    dataType: 'json',
  }).done(function (jsonResult) {
    done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
    fail(jqXHR.status, jqXHR.statusText)
  }).always(function () {
    always()
    // setTimeout(() => { always() }, 5000)
  })
}

export function searchRefundOrderDetail(id, done, fail, always) {
  $.ajax({
    type: 'post',
    url: '/Flight/refunds/' + id,
    dataType: 'json',
  }).done(function (jsonResult) {
    done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
    fail(jqXHR.status, jqXHR.statusText)
  }).always(function () {
    always()
    // setTimeout(() => { always() }, 5000)
  })
}

// change the ticket 
export function commitChangeRequest(params, done, fail, always) {
  $.ajax({
    type: 'post',
    url: '/Flight/changes/createChangeOrder',
    data: params,
    dataType: 'json',
  }).done(function (jsonResult) {
    done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
    fail(jqXHR.status, jqXHR.statusText)
  }).always(function () {
    always()
    // setTimeout(() => { always() }, 5000)
  })
}

export function searchChangeOrders(params, done, fail, always) {
  $.ajax({
    type: 'post',
    url: '/Flight/changes/',
    data: params,
    dataType: 'json',
  }).done(function (jsonResult) {
    done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
    fail(jqXHR.status, jqXHR.statusText)
  }).always(function () {
    always()
    // setTimeout(() => { always() }, 5000)
  })
}

export function searchChangeOrderDetail(id, done, fail, always) {
  $.ajax({
    type: 'post',
    url: '/Flight/changes/' + id,
    dataType: 'json',
  }).done(function (jsonResult) {
    done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
    fail(jqXHR.status, jqXHR.statusText)
  }).always(function () {
    always()
    // setTimeout(() => { always() }, 5000)
  })
}

export function searchPayRates(done) {
  $.ajax({
    type: 'post',
    url: '/Flight/pay/rates',
    dataType: 'json',
  }).done(function (jsonResult) {
    done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
    // fail(jqXHR.status, jqXHR.statusText)
  }).always(function () {
    // always()
    // setTimeout(() => { always() }, 5000)
  })
}

export function specifyBuyerForOrder(id, params, done, fail, always) {
  $.ajax({
    type: 'post',
    url: '/Flight/orders/' + id +'/buyer',
    dataType: 'json',
    data: params
  }).done(function (jsonResult) {
    done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
    // fail(jqXHR.status, jqXHR.statusText)
  }).always(function () {
    if (always) always()
    // always()
    // setTimeout(() => { always() }, 5000)
  })
}