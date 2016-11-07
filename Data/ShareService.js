var DB_CONN_STR = 'mongodb://localhost:27017/micodata';   
var MongoClient = require('mongodb').MongoClient;
var DataService=require('./DataService');


var dataService=new DataService();
var uuid = require('node-uuid');
function ShareService(){
    var _this=this;
    this.init=function(callback){
        dataService.session=_this.session;
        dataService.init();
        MongoClient.connect(DB_CONN_STR, function(err, db) {
            if (!err){
                _this.db=db;
                callback(true);
            }else{
                callback(false);
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
    
    this.jpushMessage=function(data){
        var JPush = require("jpush-sdk");
        var client = JPush.buildClient('297f0bf296106693d418a7d3', 'a21665237511afce572bc6f3');
        client.push().setPlatform('ios', 'android')
            .setAudience(null, JPush.alias(data.users))
            .setNotification(data.title,
                JPush.ios(data.message,null,1,null,data.data),
                JPush.android(data.title,data.message,1,data.data))
            .setMessage(data.message,data.title,"share",data.data)
            .setOptions(null, 60)
            .send(function(err, res) {
                if (err) {
                    if (err instanceof JPush.APIConnectionError) {
                        console.log(err.message);
                        console.log(err.isResponseTimeout);
                    } else if (err instanceof  JPush.APIRequestError) {
                        console.log(err.message);
                    }
                } else {
                    console.log('Sendno: ' + res.sendno);
                    console.log('Msg_id: ' + res.msg_id);
                }
            });
    }
    
    this.signMyDataFlow=function(dataInfo,where,callback){
        dataInfo.isTotal=false;
        dataService.getDataFlow(dataInfo,where,function(rtn){
            var arr=rtn;
            for (var i=0;i<arr.length;i++){
                var a=arr[i];
                a.state="sign";
                dataService.saveData(a.type,a,funsaved);
            }
            var rtnc={count:0,errcount:0};

            function funsaved(rtn2){
                var bok=rtn2.value;
                rtnc.count++;
                if (bok==false) {
                    rtnc.errcount++;
                }
                if (rtnc.count>=arr.length){
                    rtnc.value = (rtnc.errcount==0);
                    callback(rtnc);
                }
            }
            
        });
    };
    this.unSignMyDataFlow=function(dataInfo,where,callback){
        dataInfo.isTotal=false;
        dataService.getDataFlow(dataInfo,where,function(rtn){
            var arr=rtn;
            for (var i=0;i<arr.length;i++){
                var a=arr[i];
                
                dataService.deleteData(a.type,a,funsaved);
            }
            var rtnc={count:0,errcount:0};

            function funsaved(rtn2){
                var bok=rtn2.value;
                rtnc.count++;
                if (bok==false) {
                    rtnc.errcount++;
                }
                if (rtnc.count>=arr.length){
                    rtnc.value = (rtnc.errcount==0);
                    callback(rtnc);
                }
            }
            
        });
    };
    this.signUserDataFlow=function(dataInfo,fromuser,sign,callback){
        var touser=this.session.loginUser;
        var where={state:"share",$or:[{customer:touser.name},{"customer.dbname":touser.dbname}]};
        if (dataInfo.id=="Payable"){
            where={state:"share",$or:[{supplier:touser.name},{"supplier.dbname":touser.dbname}]};
        }
        var time=new Date().Format("yyyy-MM-dd hh:mm:ss");
        this.openDb(fromuser.dbname,function(db){

            var table1 = db.collection(dataInfo.data1.id);
            var table2 = db.collection(dataInfo.data2.id);
            var rtn2={};
            function funUpdate(){
                if (rtn2.data1 && rtn2.data2){
                    if (rtn2.data1.value && rtn2.data2.value)
                        rtn2.value=true;
                    else
                        rtn2.value=false;
                    callback(rtn2);
                }
            }
            var state="";
            if (sign) 
                state="sign";
            else
                state="unsign";
            table1.update(where,{$set:{state:state,updateTime:time}},{multi:true},function(err,result){
                rtn2.data1={error:err,value:result};
                funUpdate();
            });
            table2.update(where,{$set:{state:state,updateTime:time}},{multi:true},function(err,result){
                rtn2.data2={error:err,value:result};
                funUpdate();
            });
        });
    }
    
    this.signDataFlow=function(dataInfo,fromuser,sign,callback){
        var _this=this;

        var where={state:"beshared",$or:[{customer:fromuser.name},{"customer.dbname":fromuser.dbname}]};
        if (dataInfo.id=="Payable"){
            where={state:"beshared",$or:[{supplier:fromuser.name},{"supplier.dbname":fromuser.dbname}]};
        }
        var rtn3={};
        function funSign(){
            if (rtn3.signMy && rtn3.signUser){
                if (rtn3.signMy.value && rtn3.signUser.value) 
                    rtn3.value=true;
                else
                    rtn3.value=false;

                callback(rtn3);
            }
        }
        if (sign){
            this.signMyDataFlow(dataInfo,where,function(rtn4){
                rtn3.signMy=rtn4;
                funSign();
            });
        }else{
            this.unSignMyDataFlow(dataInfo,where,function(rtn4){
                rtn3.signMy=rtn4;
                funSign();
            });
        }
        var dataInfo2={};
        if (dataInfo.id=="Payable"){
            dataInfo2={id:"Receivable",name:"应收",data1:{id:"Income",name:"收款"},data2:{id:"Invoice",name:"发货"}};
        }else{
            dataInfo2={id:"Payable",name:"应付",data1:{id:"Purchase",name:"进货"},data2:{id:"Expenditure",name:"付款"}};
        }
        this.signUserDataFlow(dataInfo2,fromuser,sign,function(rtn5){
            rtn3.signUser=rtn5;
            funSign();
        });
    }
    this.shareMyDataFlow=function(dataInfo,where,callback){

        var time=new Date().Format("yyyy-MM-dd hh:mm:ss");
        this.openDb(this.session.loginUser.dbname,function(db){

            var table1 = db.collection(dataInfo.data1.id);
            var table2 = db.collection(dataInfo.data2.id);
            var rtn2={};
            function funUpdate(){
                if (rtn2.data1 && rtn2.data2){
                    if (rtn2.data1.value && rtn2.data2.value)
                        rtn2.value=true;
                    else
                        rtn2.value=false;
                    callback(rtn2);
                }
            }
            table1.update(where,{$set:{state:'share',updateTime:time}},{multi:true},function(err,result){
                rtn2.data1={error:err,value:result};
                funUpdate();
            });
            table2.update(where,{$set:{state:'share',updateTime:time}},{multi:true},function(err,result){
                rtn2.data2={error:err,value:result};
                funUpdate();
            });
        });
    }

    this.shareDataFlow=function(dataInfo,touser,callback){
        var _this=this;
        dataInfo.isTotal=false;
        var where={state:"",$or:[{customer:touser.name},{"customer.dbname":touser.dbname}]};
        if (dataInfo.id=="Payable" || dataInfo.id=="Supplier" ){
            where={state:"",$or:[{supplier:touser.name},{"supplier.dbname":touser.dbname}]};
        }

        dataService.getDataFlow(dataInfo,where,function(rtn){
            var arr=rtn;
            var myarr=[];
            if (arr.length<1){
                callback({error:"您没有发生未共享的新业务，无需对账",value:false});
                return;
            }
            for (var i=0;i<arr.length;i++){
                var a=arr[i];
                _this.getMyData(_this.session.loginUser,a.type,a,function(mydataname,mydata){
                    mydata.state="";
                    myarr.push(mydata);
                });
            }
            var rtnc={count:0,errcount:0};

            function funsaved(bok){
                rtnc.count++;
                if (bok==false) rtnc.errcount++;
                var saved=true;
                for(var i=0;i<myarr.length;i++){
                    if (myarr[i].state==""){
                        saved=false;
                        break;
                    }
                }
                if (rtnc.count>=myarr.length){
                    rtnc.value=saved;
                    
                    _this.shareMyDataFlow(dataInfo,where,function(rtn5){
                        if (rtn5.error || rtn5.value==false) 
                            rtnc.value==false;
                        callback(rtnc);
                    });
                    
                }
            }
            for(var i=0;i<myarr.length;i++){
                _this.saveUserData(touser,myarr[i],funsaved);
            }

        });

    }
    this.saveUserData=function(touser,data,callback){
        this.openDb(touser.dbname,function(db){         
            var table = db.collection(data.type);
            data.state="beshared";
            table.save(data,function(err,rsult){

                if (err){
                    data.state="";
                    callback(false);
                }else{
                    callback(true);
                }

            });

        });
    }
    this.getUserData=function(fromuser,dataname,id,callback){
        this.openDb(fromuser.dbname,function(db){
            
            var table = db.collection(dataname);
            table.find({id:id}).toArray(function(err, arr) {
                
                if (arr){
                    if (arr.length>0){
                        var data=arr[0]
                        callback(data);
                    }else{
                        callback(null);
                    }
                }else{
                    callback(null);
                }
            });
        });
    }
    
    this.getMyData=function(fromuser,dataname,data,callback){
        var myData={};
        myData.Income="Expenditure";
        myData.Expenditure="Income";
        myData.Invoice="Purchase";
        myData.Purchase="Invoice";

        var myDataName=myData[dataname];
        if (dataname=="Income" || dataname=="Invoice" ) {
            data.supplier=fromuser;
            data.customer="";
        }
        if (dataname=="Expenditure" || dataname=="Purchase" ) { 
            data.customer=fromuser;
            data.supplier="";
        }
        if (!data.updateTime) data.updateTime=new Date().Format("yyyy-MM-dd hh:mm:ss");
        if (!data.createTime) data.createTime=data.updateTime;

        data.type=myDataName;
        callback(myDataName,data)
    }

    this.getShareData=function(shareid,callback){
        
        var table = _this.db.collection("sys_sharedata");
        var sdata=null;
        table.find({id:shareid}).toArray(function(err, arr) {
            var rtn={};
            if (arr){
                if (arr.length>0){
                    sdata=arr[0];
                    _this.getUserData(sdata.fromuser,sdata.dataname,sdata.dataid,function(data){
                        _this.getMyData(sdata.fromuser,sdata.dataname,data,function(mydataname,mydata){
                            sdata.mydataname=mydataname;
                            rtn.sharedata=sdata;
                            rtn.value=mydata;
                            callback(rtn);

                        });
                        
                    });
                }
            }
        });
    }
    this.unSignData=function(shareid,dataname,data,callback){
        var table = _this.db.collection("sys_sharedata");
        var sdata=null;
        var where={id:shareid};
        var rtn={};
        if (!shareid) where={dataid:data.id};
        table.find(where).toArray(function(err, arr) {
           
            if (arr){
                if (arr.length>0){
                    sdata=arr[0];
                    _this.signUserData(sdata.fromuser,sdata.dataname,sdata.dataid,false,"",function(bok){                        
                        rtn.user=true;
                        rtn.uservalue=bok;
                        funback();
                    });
                }
            }
        });
        this.openDb(_this.session.loginUser.dbname,function(db){
            var tabled=db.collection(dataname);
            var tablemsg=db.collection("Message");
            
            tabled.remove({id:data.id}, function(err, result) {
                rtn.data=true;
                rtn.datavalue=!err;
                funback();
            });
            tablemsg.remove({shareDataid:data.id}, function(err, result) {
                rtn.msg=true;
                rtn.msgvalue=!err;
                funback();
            });
        });
        function funback(){
            if (rtn.data && rtn.msg && rtn.user){
                rtn.value=(rtn.datavalue && rtn.msgvalue && rtn.uservalue);
                callback(rtn);
            }
        }
    }
    this.signData=function(shareid,dataname,data,callback){
        var table = _this.db.collection("sys_sharedata");
        var sdata=null;
        var where={id:shareid};
        if (!shareid) where={dataid:data.id};
        table.find(where).toArray(function(err, arr) {
            var rtn={};
            if (arr){
                if (arr.length>0){
                    sdata=arr[0];
                    sdata.sign=true;
                    sdata.state="sign";
                    var rtn={};
                    //更新共享信息表中的签字状态
                    table.save(sdata,function(err,result){
                        rtn.signuser=true;
                        back(rtn);
                    });
                    //对消息发送方的数据签字
                    _this.signUserData(sdata.fromuser,sdata.dataname,sdata.dataid,true,"",function(bok){
                        
                        rtn.update=true;
                        back(rtn);
                   
                    });
                    //对我的当前数据签字，并且设置消息状态为已读
                    _this.signMyData(dataname,data,function(){
                        rtn.signmy=true;
                        back(rtn);
                    });
                    //返回函数
                    function back(rtn){
                        if (rtn.signuser && rtn.signmy && rtn.update) {
                            rtn.value=true;
                            callback(rtn);
                        }
                    }
                    //});
                }
            }
        });
    }
    this.signMyData=function(dataname,data,callback){
        this.openDb(_this.session.loginUser.dbname,function(db){
            var table = db.collection(dataname);
            data.state="sign";
            data.sign=true;
            data.updateTime==new Date().Format("yyyy-MM-dd hh:mm:ss");
            var rtn={};
            dataService.saveData(dataname,data,function(rb){
                rtn.save=true;
                funback();
            });

            var msgtable=db.collection("Message");
            msgtable.update({shareDataid:data.id},{$set:{read:1}},{multi:true},function(err,result){
                rtn.msg=true;
                funback();
            });
            function funback(){
                if (rtn.save && rtn.msg){
                    rtn.value=true;
                    callback(rtn);
                }
            }
        });
    }
    this.signUserData=function(touser,dataname,dataid,sign,message,callback){
        this.openDb(touser.dbname,function(db){
            
            var table = db.collection(dataname);
            var rtn={value:true};
            table.find({id:dataid}).toArray(function(err, arr) {
                
                if (arr){
                    if (arr.length>0){
                        var data=arr[0];
                        var state="sign";
                        if (sign==false) state="unsign";
                        data.state=state;
                        data.sign=sign;
                        table.save(data,function(err,result){
                            if (err){
                                rtn.value=false;
                                callback(rtn);
                            }else{
                                callback(rtn);
                            }
                        });

                        var msgTable = db.collection("Message");
                        if (!message){
                            if (sign)
                                message="对方已经签字确认";
                            else
                                message="对方拒绝签字";
                        }
                        var msg={shareid:"",shareDataid:dataid,shareDatatype:dataname,fromuser:_this.session.loginUser,message:message,data:data,date:new Date().Format("yyyy-MM-dd hh:mm:ss")};
                        msg.shareDatatype=dataname;
                        msg.shareDataid=dataid;
                        msg.id=uuid.v1();
                        msg._id=msg.id;
                        msg.ismydata=true;
                        msg.read="";
                        msg.updateTime=msg.date;
                        msg.createTime=msg.date;
                        msgTable.save(msg,function(err,result){
                            if (err){

                            }else{

                            }
                        })

                    }else{
                        rtn.value=false;
                        callback(rtn);
                    }
                }else{
                    rtn.value=false;
                    callback(rtn);
                }
            });

        });
    }
    //设置数据的签字状态
    this.setDataState=function(user,data,state,callback){
        this.openDb(user.dbname,function(db){
            var table = db.collection(data.type);
            data.state=state;
            data.updateTime=new Date().Format("yyyy-MM-dd hh:mm:ss");
            table.update({id:data.id},{$set:{state:state,updateTime:data.updateTime}},{multi:true},function(err,result){
                if(!err)
                    callback(true);
                else
                    callback(false);
            });
        });
    }
    //共享数据
    this.shareData=function(shareinfo,callback){
        var fromuser=shareinfo.fromuser;
        var touser=shareinfo.touser;
        var dataname=shareinfo.dataname;
        var dataid=shareinfo.dataid;
        var sharedata=shareinfo.data;
        var id=shareinfo.id;
        //var table = _this.db.collection(fromuser);
        var msgdata={};
        msgdata.shareid=id;
        msgdata.fromuser=fromuser;
        msgdata.touser=touser.phone;
        msgdata.dataname=shareinfo.dataname;
        msgdata.dataid=shareinfo.dataid;

        this.jpushMessage({group:"",users:"13717850991",title:"有人找你",message:shareinfo.message,data:msgdata});
        this.setDataState(_this.session.loginUser,shareinfo.data,"share",function(rn){

            if (!rn){
                callback({value:false});
                return;
            }
            shareinfo.readmark=false;
            shareinfo.readuser="";
            
            shareinfo.fromuser=_this.session.loginUser;
            shareinfo.updateTime=new Date().Format("yyyy-MM-dd hh:mm:ss");
            if (!shareinfo.createTime){
                shareinfo.createTime=shareinfo.updateTime;
            }
            shareinfo["_id"]=shareinfo.id;
            var table = _this.db.collection("sys_sharedata");
            table.save(shareinfo, function(err, result) { 
                var rtn={};
                if(err)
                {
                    console.log('saveData Error:'+ err);
                    rtn.error=err;
                    rtn.value=false;
                    return;
                }else{
                    console.log('saveData ok');
                    rtn.value=shareinfo;
                    var msg={shareid:shareinfo.id,fromuser:_this.session.loginUser,message:shareinfo.message,sharedata:shareinfo,date:shareinfo.updateTime};
                    _this.sendMessage(shareinfo.touser,msg,function(rtn){
                        callback(rtn);
                    });
                }
            });
        });
    }
    //发送共享消息
    this.sendMessage=function(touser,message,callback){
        var data=message;
        if (!data.id) data.id=uuid.v1();
        if (!data._id) data._id=data.id;
        data.updateTime=new Date().Format("yyyy-MM-dd hh:mm:ss");
        data.shareDatatype=data.sharedata.data.type;
        data.shareDataid=data.sharedata.data.id;
        
        if (!data.read) data.read="";
        if (!data.createTime){
            data.createTime=data.updateTime;
        }

        _this.getMyData(_this.session.loginUser,data.sharedata.dataname,data.sharedata.data,function(mydatatype,mydata){
            
            _this.openDb(touser.dbname,function(db){
                data.datatype=mydatatype;
                mydata.state="beshared";
                data.data=mydata;
                var rtnb={};
                function funrtn(){
                    if (rtnb.message && rtnb.data){
                        if (rtnb.message.value && rtnb.data.value){
                            rtnb.value=true;
                        }else{
                            rtnb.value=false;
                        }
                        callback(rtnb);
                    }
                }

                var table = db.collection("Message");
                table.save(data,function(err,result){
                    rtnb.message={error:err,value:result};
                    funrtn();
                });

                var table2= db.collection(mydata.type);
                
                table2.save(mydata,function(err,result){
                    rtnb.data={error:err,value:result};
                    funrtn();
                })
            });
        });
    }
}
module.exports = ShareService;