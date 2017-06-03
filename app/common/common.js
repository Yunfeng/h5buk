export const WEBAPP_NAME = '/Flight'
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

export function convertLongToTimeDesc (l) {
  return getFormatDate(new Date(l))
}

export function getFormatDate (date, pattern) {
  if (date === undefined) {
    date = new Date()
  }
  if (pattern === undefined) {
    pattern = 'yyyy-MM-dd hh:mm:ss'
  }
  return date.format(pattern)
}

export function addDate(d0, x) {
  var d1 = new Date(d0)
  
  d1 = d1.valueOf()
  d1 = d1 + x * 24 * 60 * 60 * 1000
  d1 = new Date(d1)

  return d1.format("yyyy-MM-dd")
}

export function getURLParameter (sParam) {
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

export function getCabinClassDesc (cabinClass, offset) {
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

export function showIdTypeDesc (idType) {
  var desc = ''
  switch (idType) {
    case '1': desc = '身份证'; break
    case '2': desc = '护照'; break
  }
  return desc
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

export function showRefundOrderStatus (status) {
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

export function showChangeOrderStatus (status) {
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
