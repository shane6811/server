var DB_CONN_STR = 'mongodb://localhost:27017/micodata';   
var MongoClient = require('mongodb').MongoClient;
var uuid = require('node-uuid');
function AutoShareService(){
    var _this=this;
    
    this.init=function(callback){
        MongoClient.connect(DB_CONN_STR, function(err, db) {
            if (!err){
                _this.db=db;
                if(callback) callback(true);
            }else{
                if(callback) callback(false);
            }
        });

    }
    this.openDb=function(dbname,callback){
       
        var userdb=DB_CONN_STR;
        userdb= DB_CONN_STR + "_udb_"+ dbname;
        var MClient = require('mongodb').MongoClient;
        MClient.connect(userdb, function(err, db) {
            if (!err){
                callback(db);
            }
        });

    }
    this.autoShare=function(name,data,callback){
        
        var shareInfo=[
            {dataid:"Income",userfield:"customer"},
            {dataid:"Invoice",userfield:"customer"},
            {dataid:"Expenditure",userfield:"supplier"},
            {dataid:"Purchase",userfield:"supplier"}
        ];

        for(var i=0;i<shareInfo.length;i++){
            var shinfo=shareInfo[i];
            if (name==shinfo.dataid){
                var touser = data[shinfo.userfield];
                if (touser && typeof touser=="object"){
                    if (touser.state=="autoCreate"){
                        this.shareData(touser,name,data,callback);
                    }else{
                        if (callback) callback({value:false});
                    }
                }else{
                    if (callback) callback({value:false});
                }
                return;
            }
        }
        
        if (callback) callback({value:false});
    }
    this.getUser=function(userinfo,callback){
        var rtn={};
        rtn.value=false;

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
    //把数据转义后再保存
    this.shareData=function(touser,dataname,data,callback){
        var fromuser=_this.session.loginUser;
        var rtn={value:false};
        if (!touser || touser.state!="autoCreate"){
            if (callback) callback({value:false});
            return;
        }
        //只对自动创建的用户才做自动保存
        this.getMyData(fromuser,dataname,data,function(mydataname,mydata){
            
            _this.saveData(touser,mydataname,mydata,null,callback);
            
        });
    }
    //直接保存数据
    this.saveData=function(touser,dataname,data,where,callback){
        var rtn={value:false};
        if (!touser.dbname || touser.state!="autoCreate"){
            rtn.error="对方的账户不存在，或状态错误";
            if (callback) callback(rtn);
            return;
        }
        _this.openDb(touser.dbname,function(db){
            var table = db.collection(dataname);
            if (where){
                table.find(where).toArray(function(err, arr) {
                    if (arr.length>0){
                        //更新id后再保存，可以保证不会重复写入
                        data.id=arr[0].id;
                        data._id=arr[0]._id;

                        data.updateTime=new Date().Format("yyyy-MM-dd hh:mm:ss");
                        funSave(data);
                    }else{
                        funSave(data);
                    }
                });
            }else{
                funSave(data);
            }

            function funSave(data){
            
                table.save(data,function(err,result){
                    if (err){
                        rtn.value=false;
                        rtn.error=err;
                        if (callback) callback(rtn);
                    }else{
                        rtn.value=true;
                        if (callback) callback(rtn);
                    }
                });
            }
        });

    }
    this.getMyData=function(fromuser,dataname,data,callback){
        var myData={};
        myData.Income="Expenditure";
        myData.Expenditure="Income";
        myData.Invoice="Purchase";
        myData.Purchase="Invoice";
        myData.Customer="Supplier";
        myData.Supplier="Customer";

        var myDataName=myData[dataname];
        if (dataname=="Income" || dataname=="Invoice" ) {
            data.supplier=fromuser;
            data.customer="";
        }
        if (dataname=="Expenditure" || dataname=="Purchase" ) { 
            data.customer=fromuser;
            data.supplier="";
        }
        callback(myDataName,data)
    }

}
module.exports = AutoShareService;
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