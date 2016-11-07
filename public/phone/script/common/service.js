var host = window.location.host;
var agent=navigator.userAgent;
var urlServer="";
var inPhone=false;
//判断当前环境是否正式打包的移动版
if (agent.indexOf("MicoData") > 0){
	urlServer="http://www.micodata.net";
	inPhone=true;
}else if(host=="www.micodata.net"){
	urlServer="http://www.micodata.net";
}else{
	urlServer="http://192.168.0.213";
	inPhone=false;
	//urlServer="http://192.168.1.108";	
}
//urlServer="http://www.micodata.net";

var serviceFactory={};
//命名规范 clsName=namespace.className
//其中namespace对应服务器上的物理路径
//className对应js文件名以及js文件名中的类名
serviceFactory.getService=function getService(clsName,callback)
{
	function Service(clsName){
		var strs=clsName.split(".");
		var className=strs[strs.length-1];
		var namespace="";
		if (strs.length==2){
			namespace=strs[0];
		}
		var _this=this;
		this.server=urlServer;
		this.pathName=namespace;
		this.className=className;
		//函数加载完成后才完成初始化
		this.inited=false;
		this.post = function(funName,data,callback){
			
			var url=urlServer+"/"+_this.pathName+"/"+_this.className+"/"+funName;
			
			//$.post(url,obj,callback,'text');
			//return;
			var session=getSession();
			
			$.ajaxSetup({
			    headers: {clientid: session.clientID,sessionid: session.sessionID}
			});
			
			var json={params:JSON.stringify(data),auth:JSON.stringify(session)};
			
			$.post(url,json,callback,'text');
			/*
			$.ajax({
			    url: url,
			    type: "POST",
			    data: data,
             	dataType: "text",

			    success: function (data) {
			        callback(data);
			    },
			    error: function (xhr, textStatus, errorThrow) {
			        alert(xhr.readyState);
			    }
			});
			*/
			
		};
		
		this.post("getScheme",{},function(ret){
			var serviceInfo=JSON.parse(ret);
			var funs=serviceInfo.functions;
		
			for(var i=0;i<funs.length;i++)
			{
				var funInfo=funs[i];
				_this[funInfo.fun]=new Function(_this,funInfo);
			}
			this.inited=true;
			if (callback)
				callback(this);
			if (_this.onload){
				_this.onload(_this);
			}
		});
	}

	var service=new Service(clsName);
	return service;
};
function Function (service,funInfo){
	var _this=this;
	_this.service=service;
	_this.funName=funInfo.fun;
	_this.params=funInfo.params;
	_this.fun=function(){
		var data={};
		var funName=_this.funName;
		var params=_this.params;
		var service=_this.service;
	
		for(var i=0;i<arguments.length;i++){
			var pvalue=arguments[i];
			pvalue=JSON.stringify(pvalue);
			if (params.length>i){
				var pname=params[i];
				data[pname]=pvalue;
			}
		}
		
		var callback="";
		if(typeof(arguments[arguments.length-1])=="function"){
			callback=arguments[arguments.length-1];
		}else{
			callback=false;
		}
		_this.service.post(funName,data,function(ret){
			var json=JSON.parse(ret);
			
			if (json) {
				if (json.value)
					getDataObject(json.value);
				else
					getDataObject(json);
					
				ret=json;
			}
			if (callback){
				callback(ret);
			}
		});
	};
	return _this.fun;
};
function getDataObject(json,i){
	if (!i) i=0;
	if (!json) return;
	if (i>4) return;
	if (json instanceof Array){
		for(var k=0;k<json.length;k++){
			var obj=json[k];
			if (typeof obj =="object"){
				getDataObject(obj,i+1);
			}
		}
	}else if (typeof json =="object"){
		json.toString=ToString;
		for(var f in json){ 
			var objc=json[f];
			if(typeof objc=="object"){
				getDataObject(objc,i+1);
			}
		}
	}
	
	function ToString(){
		if (this.name) return this.name;
		if (this.text) return this.text;
		if (this.message) return this.message;
		if (this.content) return this.content;
		return "";
	}
};

function getSession(){
	var loginUser = localStorage.getItem("username");
	var clientID=localStorage.getItem("clientID");
	var sessionID=localStorage.getItem("sessionID");
	if (!clientID) {
		clientID=guid();
		localStorage.setItem("clientID",clientID);
	}
	if (!sessionID){
		sessionID=guid();
		localStorage.setItem("sessionID",sessionID);
	}
	return {clientID:clientID,sessionID:sessionID};
};
function guid() {
    function S4() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
};
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o){
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
    return fmt;
};
function getDateText(time){
    if(!time) return "";
    
    var curTime=new Date().Format("yyyy-MM-dd") ;
    var today=new Date();
    var sday=1000*60*60*24;
    var t0=curTime;
    var t1=(new Date(today.getTime()-sday).Format("yyyy-MM-dd")) ;
    var t2=(new Date(today.getTime()-7*sday).Format("yyyy-MM-dd")) + " 00:00:00";
    var t3=(new Date(today.getTime()-30*sday).Format("yyyy-MM-dd")) + " 00:00:00";
    var t4=(new Date(today.getTime()-180*sday).Format("yyyy-MM-dd")) + " 00:00:00";
    
    var weeks=["日","一","二","三","四","五","六"];
    var cutTime = time.substr(0,10);
    if(cutTime==t0)
        cutTime = time.substr(11,5);
    else if(cutTime==t1)
        cutTime = "昨天";
    else if(cutTime<t1 && cutTime>t2){
        cutTime = "周" + weeks[parseInt((new Date(time.substr(0,10))).getDay())] ;
    }
    else if(cutTime<t2 && cutTime>t3)
        cutTime = time.substr(5,5);
    else
        cutTime = time.substr(0,10);
    return cutTime;
};