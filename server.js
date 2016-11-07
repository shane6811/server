
function Server() {
	var http = require("http");
	var url = require("url");
	var sysFile = require("fs");
	var qs = require('querystring');
	var _this=this;
	var _server=this;
	this.route=function(req,res,next){
  
		var data=_this.getData(req);
		var urlPath = url.parse(req.url).pathname;
		var funInfo=_this.getFunInfo(urlPath);
		
		var file=_this.getFileName(urlPath);
		if (funInfo){
			var service=_this.getService(funInfo);
			if (service){
				service.req=req;
				service.res=res;
				service.session=req.session;

				if (funInfo.functionName=="getScheme"){
					var scheme =getScheme(funInfo.className, service);
					res.header("Content-Type", "application/json;charset=utf-8");
					res.write(JSON.stringify(scheme));
					res.end();
				}else{
					res.header("Content-Type", "application/json;charset=utf-8");
					function funreturn(data){
						res.write(JSON.stringify(data));
						res.end();
					}
					function funrun(){
						var fun=service[funInfo.functionName];
						if (fun){
							var params=_this.getParams(data);
							params.push(funreturn);
							fun.apply(service,params);
							
						}else{
							res.write("{error:'function " + funInfo.functionName +" () not find'}");
						}
					}
					function inited(bok){
						if (bok) funrun();
					}
					if (service["init"]){
						service["init"](inited);
					}else{
						funrun();
					}
				}
				
			}else{
				next();
			}
		}else{
			next();
		}
	}
	this.getData=function(req){
		var data=null;
		var method=req.method;
		
        if (method == 'POST') {
			data=req.body;
        }else if (method == 'GET') {
            data = url.parse(req.url, true).query;
        } else {
        	data=method;
        }
		//var data=JSON.parse(data);
		if (data.params)
			req.datas=JSON.parse(data.params);
		else
			req.datas={};

		if (data.auth){
			req.auth=JSON.parse(data.auth);
			req.sessionID=req.auth.sessionID;
		}
		//var params=JSON.parse(data.params);
		return req.datas;//JSON.parse(data.params);
	}
	this.getParams=function(data){
		var arr=[];
		if (data){
			for(var p in data){ 
				
				if(typeof(data[p])!="function" && typeof(data[p])!="undefined"){ 
					// p 为属性名称，obj[p]为对应属性的值
					//props+= p + "=" + obj[p] + "\t";
					var val=data[p];
					if (val!="undefined" && val!="null"){
						val=JSON.parse(val);
						arr.push(val);
					}
				};
			} 
		}
		return arr;
	}
	this.getFileName=function(urlPath){
		var fileName=__dirname+"/"+urlPath;
		if (!sysFile.existsSync(fileName)) 
			fileName=__dirname+"/"+urlPath + ".htm";
		else
			return fileName;
		if (!sysFile.existsSync(fileName)) 
			fileName=__dirname+"/"+urlPath + ".html";
		else
			return fileName;
		if (!sysFile.existsSync(fileName)) 
			fileName=__dirname+"/"+urlPath + ".txt";
		else
			return fileName;

		return "";
	}
	this.getFunInfo=function(urlPath){
		var funInfo={};
		var path=urlPath;
		var ps=path.split('/');
		if (ps.length<2) return null;

		funInfo.functionName=ps[ps.length-1];
		funInfo.className=ps[ps.length-2];
		var filePath="";
		for(var i=0;i<ps.length-2;i++){
			if (ps[i]!=""){
				filePath+=ps[i]+"/";
			}
		}
		funInfo.fileName=funInfo.className+".js";
		funInfo.filePath=filePath+funInfo.fileName;
		funInfo.servicePath='./' + filePath + funInfo.className;

		if (sysFile.existsSync(__dirname+"/"+funInfo.filePath)){
			return funInfo;
		}else{
			return null;
		}
	}
	this.getService=function(funInfo){
		var Service = require(funInfo.servicePath);
		if (Service){
			service = new Service();
			return service;
		}else{
			return null;
		}
	}
}
module.exports=Server;

function getScheme(className,obj){
	var sch={};
	sch.className=className;
	
	var arrfun=[];
	for(var f in obj){ 
		if(typeof(obj[f])=="function"){ 
			// p 为属性名称，obj[p]为对应属性的值
			//props+= p + "=" + obj[p] + "\t";
			var scm=getFunScheme(f, obj[f]);
			arrfun.push(scm);
		};
	} 
	sch.functions=arrfun;
	return sch;
	
}

function getFunScheme(funName,objfun){
	var obj={};
	obj.fun=funName;
	var str=objfun.toString();
	var first=str.indexOf("(")+1;
	var last=str.indexOf(")");
	var str2=str.substring(first,last);
	obj.params=str2.split(",");
	if (obj.params[obj.params.length-1] = "callback" ){
		obj.params.splice(obj.params.length-1, 1);
	}
	return obj;
}