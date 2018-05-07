import { WEBAPP_NAME, callService } from '../common/common.js'


export function payForTmcOrder(params, cbDone) {
  const url = WEBAPP_NAME + '/orders/payForTmcOrder.do'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function searchOrders(params, cbDone, cbFail, cbAlways) {
  const url = WEBAPP_NAME + '/orders/search.do'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbFail: cbFail,
    cbAlways: cbAlways
  })
}

export function cancelOrder(params, cbDone, cbFail, cbAlways) {
  const url = WEBAPP_NAME + '/orders/cancelTmcOrder.do'
  callService(url, {
    data: params,
    cbDone: cbDone,
    cbFail: cbFail,
    cbAlways: cbAlways
  })
}

export function confirmTicketNoCorrect(params, cbDone) {
  const url = WEBAPP_NAME + '/orders/confirmOrderTicketCorrect.do'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

export function confirmTicketNoWrong(params, cbDone) {
  const url = WEBAPP_NAME + '/orders/confirmOrderTicketWrong.do'
  callService(url, {
    data: params,
    cbDone: cbDone
  })
}

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

export function searchTripOrders(params, done, fail, always) {
  $.ajax({
    type: 'post',
    url: WEBAPP_NAME + '/trip/orders',
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

export function searchTripOrderDetail(id, done, fail, always) {
  $.ajax({
    type: 'post',
    url: WEBAPP_NAME + '/trip/order/detail/' + id,
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

export function payTripOrder(id, done, fail, always) {
  $.ajax({
    type: 'post',
    url: WEBAPP_NAME + '/trip/order/pay/' + id,
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

export function acceptTripOrder(id, done, fail, always) {
  $.ajax({
    type: 'post',
    url: WEBAPP_NAME + '/trip/order/' + id + '/accept',
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

export function denyTripOrder(id, params, done, fail, always) {
  $.ajax({
    type: 'post',
    url: WEBAPP_NAME + '/trip/order/' + id + '/deny',
    dataType: 'json',
    data: params,
  }).done(function (jsonResult) {
    done(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
    fail(jqXHR.status, jqXHR.statusText)
  }).always(function () {
    always()
    // setTimeout(() => { always() }, 5000)
  })
}

export function showOrderStatusDesc (status) {
  var desc = ''
  switch (status) {
    case 0: desc = '等待接单'; break
    case 1: desc = '待支付'; break
    case 2: desc = '付款确认中 '; break
    case 4: desc = '已拒单'; break
    case 8: desc = '等待开票'; break
    case 12: desc = '开票中'; break
    case 16: desc = '已出票'; break
    case 32: desc = '已完成'; break
    case 64: desc = '订单结束'; break
    case 128: desc = '已取消'; break
    case 1024: desc = '未提交'; break
    default:
      desc = status
  }
  return desc
}