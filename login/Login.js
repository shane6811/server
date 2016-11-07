var DB_CONN_STR = 'mongodb://localhost:27017/micodata';   
var MongoClient = require('mongodb').MongoClient;
var uuid = require('node-uuid');
function Login(){
    var _this=this;
    var res;
    var req;
    this.init=function(callback){

        MongoClient.connect(DB_CONN_STR, function(err, db) {
            if (!err){
                _this.db=db;
                callback(true);
            }else{
                callback(false);
            }
        });

    }
    this.autoLogin=function(username,deviceID,serverID,callback){
        
        var rtn={};
        this.getUserData(username,deviceID,function(rtn2){
            if (rtn2.value){
                var user=rtn2.value;
                _this.session.loginUser=user;
                _this.session.userdb=user.dbname;
                rtn.value=true;
                callback(rtn);
            }else{
                rtn.value=false;
                callback(rtn);
            }
        });
        
       
    }
    this.getUserByPhone=function(phone,callback){
        var rtn={};
        rtn.value=null;
        var users = _this.db.collection('users');

        if (phone==""){
            rtn.error="手机号没有指定";
            callback(rtn);
            return;
        }
        
        var bfind=false;
        var objWhere = {"$or":[{username:phone},{phone:phone},{dbname:phone}]};

        users.find(objWhere).toArray(function(err, arr) {
            if(err){
                console.log('Error:'+ err);
                rtn.error="查询错误";
                callback(rtn);
            }else{
                if (arr.length==0) {
                    rtn.error="账号未注册";
                    callback(rtn);
                }else{
                    var user=arr[0];
                    rtn.value=user;
                    callback(rtn);
                
                }
            }     
            
        });
    }
    this.autoCreateUser=function(loginUser,userinfo,callback){
        var rtn={};
        rtn.value=false;
        if(_this.session.loginUser.username!=loginUser) {
            rtn.error="当前用户尚未登录，无此权限";
            callback(rtn);
        }
        var objuser={username:userinfo.phone,name:userinfo.name,phone:userinfo.phone};

        var table = _this.db.collection('users');

        var bfind=false;
        var objWhere = {$or:[{username:objuser.phone},{phone:objuser.phone}]};

        table.find(objWhere).toArray(function(err, arr) {
            if(err){
                console.log('Error:'+ err);
                rtn.error="查询错误";
                callback(rtn);
            }else{
                if (arr.length>0) {
                    rtn.value=arr[0];
                    if (!rtn.value.dbname) rtn.value.dbname=rtn.value.username;
                    callback(rtn);
                }else{
                    addUser(objuser, callback);
                }
            }     
            
        });
        
        function addUser(data, callback){
            if (!data.id) data.id=uuid.v1();
            if (!data._id) data._id=data.id;
            data.updateTime=new Date().Format("yyyy-MM-dd hh:mm:ss");
            if (!data.createTime){
                data.createTime=data.updateTime;
            }
            data.dbname=data.username;
            data.password="micodata";
            data.state="autoCreate";
            table.insert(data, function(err, result) { 
                if(err)
                {
                    console.log('Error:'+ err);
                    return;
                }else{
                    rtn.value=data;
                    callback(rtn);
                }
            });
        }
        
    }
    this.login=function(username,password,callback){
        var data={};
    	data.username=username;
    	data.password=password;
        var rtn={};
        rtn.value=false;
        var users = _this.db.collection('users');

        if (username==""){
            rtn.error="用户名没有填写";
            callback(rtn);
            return;
        }
        if (password==""){
            rtn.error="密码没有填写";
            callback(rtn);
            return;
        }
        var bfind=false;
        var objWhere = {username:username};

        users.find(objWhere).toArray(function(err, arr) {
            if(err){
                console.log('Error:'+ err);
                rtn.error="查询错误";
                callback(rtn);
            }else{
                if (arr.length==0) {
                    rtn.error="账号未注册";
                    callback(rtn);
                }else{
                    var user=arr[0];
                    if (user.password==data.password){
                        rtn.value=true;
                        if (!user.dbname) user.dbname=user.username;
                        //保存用户的登陆时间和状态
                        user.loginTime=new Date().Format("yyyy-MM-dd hh:mm:ss");
                        user.state="userreg";
                        users.save(user,function(err,res){

                        })
                        _this.session.loginUser=user;
                        _this.session.userdb=user.dbname;
                        callback(rtn);
                    }else{
                        rtn.error="密码不正确";
                        callback(rtn);
                    }
                }
            }     
            
        });
    }
    this.getUserData=function(username,clientid,callback){
        var data={};
    	data.username=username;
        var rtn={};
        rtn.value=false;
        var users = _this.db.collection('users');

        if (username==""){
            rtn.error="用户名没有填写";
            callback(rtn);
            return;
        }
        
        var bfind=false;
        var objWhere = {username:username};

        users.find(objWhere).toArray(function(err, arr) {
            if(err){
                console.log('Error:'+ err);
                rtn.error="查询错误";
                callback(rtn);
            }else{
                if (arr.length==0) {
                    rtn.error="账号未注册";
                    callback(rtn);
                }else{
                    var user=arr[0];
                    rtn.value=user;
                    callback(rtn);
                
                }
            }     
            
        });
    }
    this.getVCode=function(phone,callback){
        var users = _this.db.collection('users');
        var rtn={};
        var vcode=(parseInt(Math.random() * 10000) +"0000").toString(10).substring(0,4);
        _this.session.VCode=vcode;
        _this.session.phone=phone;
        rtn.value=vcode;
        _this.sendVCode(phone,vcode,null);
        callback(rtn);
        /*

        */
    }
    this.checkPhone=function(phone,callback){
        var bfind=false;
        var objWhere = {$or:[{username:phone},{phone:phone}]};
        var rtn={};
        var users = _this.db.collection('users');
        users.find(objWhere).toArray(function(err, arr) {
            if(err){
                console.log('Error:'+ err);
                rtn.error="查询错误";
                rtn.value=false;
                callback(rtn);
            }else{
                if (arr.length>0) {
                    
                    for(var i=0;i<arr.length;i++){
                        if (!arr[i].state) arr[i].state="autoCreate"; 
                        if (arr[i].state!="autoCreate"){
                            rtn.value=true;
                            callback(rtn);
                            return;
                        }
                    }
                    rtn.value=false;
                    callback(rtn);
                }else{
                    rtn.value=false;
                    callback(rtn);
                }
            }    
        });
    }
    this.sendVCode=function(phone,vcode,callback){
        var Huyi = require('../sms/iHuyi');
        var sms=new Huyi();
        var str="验证码："+vcode+"，有效期30分钟。微数据是小微企业业务协作平台，欢迎您的使用。"
        //var str="您的验证码是："+vcode+"。请不要把验证码泄露给其他人。";
        sms.send(phone,str,function(err,simid){
            var rtn={error:err,value:simid};
            if (callback){
                callback(rtn);
            }
        });
    }
    this.registe=function(username,password,callback){

        
        var rtn={};
        rtn.value=false;
        if (username==""){
            rtn.error="用户名没有填写";
            callback(rtn);
            return;
        }
        if (password==""){
            rtn.error="密码没有填写";
            callback(rtn);
            return;
        }
        var users = _this.db.collection('users');

        var bfind=false;
        var objWhere = {username:username};

        users.find(objWhere).toArray(function(err, arr) {
            if(err){
                console.log('Error:'+ err);
                rtn.error="查询错误";
                callback(rtn);
            }else{
                for(var i=0;i<arr.length;i++){
                    var a=arr[i];
                    if (!a.state) a.state="autoCreate";
                    if (a.state!="autoCreate"){
                        rtn.error="账号已注册";
                        callback(rtn);
                        return;
                    }
                }
                var data={};

                if (arr.length<0 ){	
                    data.username=username;
                    data.password=password;
                    data.phone=username;
                    data.dbname=username;
                }else{
                    data=arr[0];
                    if (!data){
                        data={};
                        data.username=username;
                        data.phone=username;
                        data.dbname=username;
                    }
                    data.password=password;
                }
                _this.session.loginUser=data;
                _this.session.userdb=data.dbname;
                saveUser(data,callback);              
            }     
            
        });

        function saveUser(data,callback){
            data.state="userreg";
            if (!data.dbname) data.dbname=data.username;
            if (!data.id) data.id=uuid.v1();
            if (!data._id) data._id=data.id;
            data.updateTime=new Date().Format("yyyy-MM-dd hh:mm:ss");
            data.regTime=new Date().Format("yyyy-MM-dd hh:mm:ss");
            if (!data.createTime){
                data.createTime=data.updateTime;
            }
            var rtn={value:true};
            users.save(data, function(err, result) { 
                if(err)
                {
                    console.log('Error:'+ err);
                    rtn.error=err;
                    rtn.value=false;
                    callback(rtn);
                }else{
                    rtn.value=true;
                    callback(rtn);
                }
            });
        }

    }
    this.changePassword=function(username,vcode,password,callback){
    	var data={};
    	data.username=username;
    	data.password=password;
        var rtn={};
        rtn.value=false;
        if (username==""){
            rtn.error="用户名没有填写";
            callback(rtn);
            return;
        }
        if (password==""){
            rtn.error="密码没有填写";
            callback(rtn);
            return;
        }
        if (vcode!=_this.session.VCode){
            rtn.error="验证码错误";
            callback(rtn);
            return;
        }
        var users = _this.db.collection('users');

        var bfind=false;
        var objWhere = {username:username};

        users.find(objWhere).toArray(function(err, arr) {
            if(err){
                console.log('Error:'+ err);
                rtn.error="查询错误";
                callback(rtn);
            }else{
                if (arr.length==0) {
                    rtn.error="无此账号";
                    callback(rtn);
                    addUser(callback);
                }else{
                    rtn.value=true;
                    data=arr[0];
                    data.password=password;

                    users.save(data, function(err, result) { 
                        if(err)
                        {
                            console.log('Error:'+ err);
                            return;
                        }else{
                            rtn.value=true;
                            callback(rtn);
                        }
                    });

                }
            }     
            
        });
    }
    this.saveUserData=function(username,data,callback){

        var rtn={};
        rtn.value=false;
        var users = _this.db.collection('users');

        if (username==""){
            rtn.error="用户名不能为空";
            callback(rtn);
            return;
        }

        var bfind=false;
        var objWhere = {username:username};

        users.find(objWhere).toArray(function(err, arr) {
            if(err){
                console.log('Error:'+ err);
                rtn.error="查询错误";
                callback(rtn);
            }else{
                if (arr.length==0) {
                    rtn.error="账号未注册";
                    callback(rtn);
                }else{
                    var user=arr[0];
                    data["_id"]=user["_id"];

                    users.save(data, function(err, result) { 
                        if(err)
                        {
                            console.log('Error:'+ err);
                            return;
                        }else{
                            rtn.value=true;
                            callback(rtn);
                        }
                    });

                }
            }     
            
        });
    }
    this.getScode=function(phone){

    }
    this.forgetPassword=function(phone,scode,password){

    }
}
module.exports = Login;
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
}