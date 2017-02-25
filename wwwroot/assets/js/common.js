//去掉空格 并用去掉空格后的字符串替代显示
function delspace(name){
	var inputValue=$("#"+name).val();
	while(inputValue.indexOf(" ")!=-1){
		inputValue=inputValue.replace(" ","");
	}
	$("#"+name).val(inputValue);
} 


/* Get all checked checkboxes' values. */
getCheckBoxValue = function (controlName) {
    var check = document.getElementsByName(controlName);
    var ret = "";
    for (var i = 0; i < check.length; ++i) {
        if (check[i].checked) {
            ret += ";" + check[i].value;
        }
    }
    return ret;
};

checkboxSet = function (checkname) {
    var list = document.getElementsByName(checkname);
    for (var i = 0; i < list.length; ++i) {
        list[i].checked = true;
    }
};

checkboxClear = function (checkname) {
    var list = document.getElementsByName(checkname);
    for (var i = 0; i < list.length; ++i) {
        list[i].checked = false;
    }
};


function showDataList(requests) {
    var source = $("#thead-tr-data-template").html();
    $("#tableData thead").empty().append(source);

    source = $("#tr-data-template").html();
    var tempate = Handlebars.compile(source);

    $("#tableData tbody").empty();
    for(var i = 0; i < requests.length; i++) {
        var msg = requests[i];
        if (msg.createDate !== undefined && msg.createDate !== null) msg.createDate = msg.createDate.substring(0, 10);
        if (msg.ddate !== undefined && msg.ddate !== null) msg.ddate = msg.ddate.substring(0, 10);
        if (msg.goFlightEffectDate !== undefined && msg.goFlightEffectDate !== null) msg.goFlightEffectDate = msg.goFlightEffectDate.substring(0, 10);
        if (msg.goFlightExpiryDate !== undefined && msg.goFlightExpiryDate !== null) msg.goFlightExpiryDate = msg.goFlightExpiryDate.substring(0, 10);
        if (msg.lastupdate !== undefined && msg.lastupdate !== null) msg.lastupdate = msg.lastupdate.replace(/T/, ' ');
        if (msg.lastUpdate !== undefined && msg.lastUpdate !== null) msg.lastUpdate = msg.lastUpdate.replace(/T/, ' ');
        if (msg.lastDataTime !== undefined && msg.lastDataTime !== null) msg.lastDataTime = msg.lastDataTime.replace(/T/, ' ');
        if (msg.downloadBeginTime !== undefined && msg.downloadBeginTime !== null) msg.downloadBeginTime = msg.downloadBeginTime.replace(/T/, ' ');

        if (msg.excludeAirports !== undefined && msg.excludeAirports !== null && msg.excludeAirports.length > 10) {
            msg.excludeAirportsAbbr = msg.excludeAirports.substring(0, 11) + "...";
        } else {
            msg.excludeAirportsAbbr = msg.excludeAirports;
        }

        var context = {
            info: msg
        };
        var content = tempate(context);
        $("#tableData tbody").append(content);
    }
}


function GetURLParameter(sParam)
{
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

//是否为正整数  
function isPositiveNum(s){
    var re = /^[0-9]*[1-9][0-9]*$/ ;  
    return re.test(s)  
} 

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
};