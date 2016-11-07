var express = require('express');
var router = express.Router();
var http = require("http");
var url = require("url");
var sysFile = require("fs");
/* GET home page. */
router.get('/', function(req, res, next) {
  
  try{
	    var path = url.parse(req.url).pathname;
	    console.log("req for " + path + " received.");
	    var ps=path.split('/');
	    var pathName="";
	    var modelName="";
	    var functionName="";
	    if (ps.length>1) pathName=ps[1];
	    if (ps.length>2) modelName=ps[2];
	    if (ps.length>3) functionName=ps[3];
	    //if (modelName=="" ) return;
	    //if (functionName=="" ) return;
	    if (path=="/"){
	    	modelName="index.html";
	    }

	    if (!sysFile.existsSync(pathName )){
	    	res.write('can not find path:' + pathName );
	    	return;
	    }
	    var fileName=pathName + '/' + modelName + ".js";
	    var findFile=sysFile.existsSync(fileName);
	    //sysFile.realpathSync(pathName + '/' + modelName)
	    if (findFile){
	    	res.writeHead(200, {"Content-Type": "text/plain"});
		    var Class = require('./' + pathName + '/' + modelName);
			obj = new Class(); 
			var fun=obj[functionName];
			if (fun){
				var obj=fun(req, res); 
				var rtn=JSON.stringify(obj);
				res.write(rtn);
			}else{
				res.write('can not find function:' + functionName);
			}
			res.end();
		}else{
			res.writeHead(200, {"Content-Type": "text/html"});
			fileName=pathName + '/' + modelName;
			if (!sysFile.existsSync(fileName)) fileName=pathName + '/' + modelName + ".htm";
			if (!sysFile.existsSync(fileName)) fileName=pathName + '/' + modelName + ".html";
			if (!sysFile.existsSync(fileName)) fileName=pathName + '/' + modelName + ".txt";
			
			if (sysFile.existsSync(fileName)){
				
				sysFile.readFile(fileName, {flag: 'r+', encoding: 'utf8'}, function (err, data) {
				   	if (err) {
				       //return console.error(err);
				       return;
				   	}else{
				   		res.write(data.toString());
				   		console.log(data.toString());
				   	}
				   	res.end();
				});
				
				//var data=sysFile.readFileSync(fileName, {flag: 'r+', encoding: 'utf8'});
				//res.write(data.toString());
			}else{
				
				res.write('can not find file:' + fileName);
				res.end();
			}
			//res.write('find file:' + fileName);
		}
	    
	}catch(err)
	{
		console.log(err.message);
	}

});

module.exports = router;
