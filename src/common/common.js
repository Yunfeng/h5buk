const WEBAPP_NAME = '/Flight'
const ORDER_TYPE_FLIGHT = '01'
const ORDER_TYPE_TRIP = '06'
/**
* 
*/
Date.prototype.format = function(format){
 /*
  * eg:format="YYYY-MM-dd hh:mm:ss";
  */
 var o = {
  "M+" :  this.getMonth()+1,  //month
  "d+" :  this.getDate(),     //day
  "h+" :  this.getHours(),    //hour
  "m+" :  this.getMinutes(),  //minute
  "s+" :  this.getSeconds(), //second
  "q+" :  Math.floor((this.getMonth()+3)/3),  //quarter
  "S"  :  this.getMilliseconds() //millisecond
  };
 
   if(/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
   }
 
   for(var k in o) {
    if(new RegExp("("+ k +")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
    }
   }
 return format;
}

function convertLongToTimeDesc (l) {
  return getFormatDate(new Date(l))
}

function getFormatDate (date, pattern) {
  if (date === undefined) {
    date = new Date()
  }
  if (pattern === undefined) {
    pattern = 'yyyy-MM-dd hh:mm:ss'
  }
  return date.format(pattern)
}

 function addDate(d0, x) {
  var d1 = new Date(d0)
  
  d1 = d1.valueOf()
  d1 = d1 + x * 24 * 60 * 60 * 1000
  d1 = new Date(d1)

  return d1.format("yyyy-MM-dd")
}

function getURLParameter (sParam) {
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++) 
  {
      var sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] == sParam) 
      {
          return sParameterName[1];
      }
  }
}

function copySelectionText(){
    var copysuccess // var to check whether execCommand successfully executed
    try{
        copysuccess = document.execCommand("copy") // run command to copy selected text to clipboard
    } catch(e){
        copysuccess = false
    }
    return copysuccess
}

function copyfieldvalue(e, id){
    var field = document.getElementById(id)
    field.focus()
    field.setSelectionRange(0, field.value.length)
    var copysuccess = copySelectionText()
}

function getSelectionText(){
    var selectedText = ""
    if (window.getSelection){ // all modern browsers and IE9+
        selectedText = window.getSelection().toString()
    }
    return selectedText
}

function selectElementText(el){
    var range = document.createRange() // create new range object
    range.selectNodeContents(el) // set range to encompass desired element text
    var selection = window.getSelection() // get Selection object from currently user selected text
    selection.removeAllRanges() // unselect any user selected text (if any)
    selection.addRange(range) // add range to Selection object to select it
}

 function copySelectionText(id){
  var para = document.getElementById(id);
  selectElementText(para);
  var paratext = getSelectionText();
  //alert(paratext) // alerts "My mama always says..."
  document.execCommand("copy");
}

 function getCabinClassDesc (cabinClass, offset) {
  if (cabinClass === 'F') {
    if (offset === 100) {
      return '头等'
    } else if (offset > 0) {
      return '头等' + offset + '折'  
    } else {
      return '头等'
    }
    
  } else if (cabinClass === 'Y') {
    if (offset === 100) {
      return '全价'
    } else if (offset > 0) {
      return offset + '折'  
    } else {
      return ''
    }
  } else if (cabinClass === 'C') {
    if (offset === 100) {
      return '商务'
    } else if (offset > 0) {
      return '商务' + offset + '折'  
    } else {
      return '商务'
    }
  }
}

 function showIdTypeDesc (idType) {
  var desc = ''
  switch (idType) {
    case '1': desc = '身份证'; break
    case '2': desc = '护照'; break
  }
  return desc
}

 

 function showRefundOrderStatus (status) {
  var desc = ''
  switch (status) {
    case 0: desc = '申请中'; break
    case 1: desc = '已提交航司'; break
    case 2: desc = '已退款 '; break
    case 4: desc = '已取消'; break
    case 8: desc = '已完成'; break
    default:
      desc = status
  }
  return desc
}

 function showChangeOrderStatus (status) {
  var desc = ''
  switch (status) {
    case 0: desc = '申请中'; break
    case 1: desc = '处理中'; break
    case 2: desc = '处理中 '; break
    case 4: desc = '已取消'; break
    case 8: desc = '已完成'; break
    default:
      desc = status
  }
  return desc
}

 function showTripOrderStatus (status) {
  var desc = ''
  switch (status) {
    case 0: desc = '等待确认'; break
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

function callService(url, {
  cbDone = function () {},
  cbAlways = function () {},
  cbFail = function () {},
  type = 'post',
  dataType = 'json',
  data = null,
  contentType = 'application/x-www-form-urlencoded; charset=UTF-8'
}) {
  $.ajax({
    type: type,
    url: url,
    dataType: dataType,
    data: data,
    contentType: contentType
  }).done(function (jsonResult) {
    cbDone(jsonResult)
  }).fail(function (jqXHR, textStatus, errorThrown) {
    if (jqXHR.status === 403) {
      window.alert('您没有相关授权，或者可以退出系统后重新登录，再试一次！(403)')
    } else {
      cbFail()
    }
  }).always(function () {
    cbAlways()
  })
}

export {
  WEBAPP_NAME,
  WEBAPP_NAME as APP_FLIGHT_PATH,
  getURLParameter,
  convertLongToTimeDesc,
  isPositiveNum,
  callService,
  showFlightOrderStatus,
  showVasOrderStatus,
  showPayType,
  showItineraryType,
  showPsgType,
  today,
  addDate,
  getCabinClassDesc,
  showTripOrderStatus,
  showIdTypeDesc,
  showChangeOrderStatus,
  showRefundOrderStatus,
  copySelectionText,
  ORDER_TYPE_TRIP
}
