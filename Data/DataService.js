var DB_CONN_STR = 'mongodb://localhost:27017/micodata';   
var MongoClient = require('mongodb').MongoClient;
var BusiService=require('./BusiService');
function DataService(){
    var _this=this;
    var res;
    var req;
    var busiService;
    //连接数据库
    this.init=function(callback){
        var userdb=DB_CONN_STR;
        if (_this.session.userdb)
            userdb= DB_CONN_STR + "_udb_"+ _this.session.userdb;
        
        busiService=new BusiService();
        busiService.init(_this);
        MongoClient.connect(userdb, function(err, db) {
            if (!err){
                _this.db=db;
                if(callback) callback(true);
            }else{
                if(callback) callback(false);
            }
        });

    }
    //返回用户默认的数据
    //用一张keyvalues表存储一些基本的数据，这里返回主界面上五个圆球里面的基本数值
    //keyvalues的结构为_id,datatype,key,value.
    this.getUserData=function(callback){
        _this.getDataValues("资金",function(rtn){
            if (rtn.value){
                callback(rtn);
            }else{
                _this.initUserData(callback);
            }
        });
    }
    //初始化数据库时设置用户的默认数据
    this.initUserData=function(callback){
        
        var count=0;
        function bk(rtn){
            count++;
            if (count==4){
                var data={"现金":0,"应收":0,"应付":0,"存货":0};
                var rtn={};
                rtn.value=data;
                callback(rtn);
            }
        }
        _this.saveDataValue("资金","现金",0,bk);
        _this.saveDataValue("资金","应收",0,bk);
        _this.saveDataValue("资金","应付",0,bk);
        _this.saveDataValue("资金","存货",0,bk);

    }
    //从keyvalues表中取得对应的数据
    this.getDataValues=function(type,callback){
        var table = _this.db.collection("keyvalues");
        where = {datatype:type};
        table.find(where).sort({"updateTime":-1}).toArray(function(err, arr) {
            var rtn={};
            var data=null;
            if (arr.length>0) data={};
            for(var i=0;i<arr.length;i++){
                var obj=arr[i];
                data[obj.key]=obj.value;
            }
            rtn.value=data;
            callback(rtn);
        });
    }
    //从keyvalues中取得一个具体数值
    this.getDataValue=function(type,key,callback){
        var table = _this.db.collection("keyvalues");
        where = {datatype:type,key:key};
        table.find(where).sort({"updateTime":-1}).toArray(function(err, arr) {
            var rtn={};
            if (arr.length>0)
                rtn.value=arr[0];
            else
                rtn.value=null;
            callback(rtn);
        });
    }
    //在指定数据上增加一定的数值
    this.addDataValue=function(type,key,addvalue,callback){
        var rtn={value:true};
        if (!addvalue ){
            if (callback) callback(rtn);
            return;
        }
        this.getDataValue(type,key,function(rtn){
            if (!rtn.error){
                var val=0;
                if (rtn.value && rtn.value.value) 
                    val=parseFloat( rtn.value.value);
                if (!val) val=0;
                val+= parseFloat(addvalue);
                _this.saveDataValue(type,key,val,function(rtn2){
                    if (callback) callback(rtn2);
                });
            }else{
                if (callback) callback(rtn);
            }
        });
    }
    //保存数据值到keyvalues表中。
    this.saveDataValue=function(type,key,value,callback){
        var table = _this.db.collection("keyvalues");
        var data={datatype:type,key:key,value:value}
        data.updateTime=new Date().Format("yyyy-MM-dd hh:mm:ss");
        if (!data.createTime){
            data.createTime=data.updateTime;
        }

        where = {datatype:type,key:key};
        table.find(where).toArray(function(err, arr) {
            
            if (arr.length>0){
                var odata=arr[0];
                odata.value=data.value;
                data=odata;
            }
            table.save(data, function(err, result) { 
            var rtn={};
            if(err)
            {
                console.log('saveDataValue Error:'+ err);
                rtn.error=err;
                rtn.value=false;
                return;
            }else{
                console.log('saveDataValue ok');
                rtn.value=true;
                callback(rtn);
            }
        });

        });


    }
    //从指定名称的数据表中返回一组数据
    //name：数据表名称
    //where：查询对象格式为：{$or:[{"customer":this.customer.name},{"customer.dbname":this.customer.dbname},{"customer.phone":this.customer.phone}]};
    //from：开始行
    //to：结束行
    this.getDataList=function(name,where,from,to,callback){
        var table = _this.db.collection(name);
        if (where=="") where=null;
        var opt={};
        opt.sort={"updateTime":-1};
        if (from>0) opt.skip=from;
        if (to>0) opt.limit=to;
        var rtn={};
        var bData=false;
        var bCount=false;
        table.find(where,opt).toArray(function(err, arr) {
            rtn.value=arr;
            bData=true;
            if (bData && bCount) callback(rtn);
        });
        table.count(where,function(err,count){
            rtn.count=count;
            bCount=true;
            if (bData && bCount) callback(rtn);
        })
        
    }
    //从指定表中取得指定id的数据。
    //name:数据表名
    //id：数据id
    this.getData=function(name,id,callback){
        var table = _this.db.collection(name);
        table.find({id:id}).toArray(function(err, arr) {
            var rtn={};
            if (arr){
                if (arr.length>0){
                    rtn.value=arr[0];
                    callback(rtn);
                }else{
                    callback(null);
                }
            }else{
                callback(null);
            }
        });
    }
    //根据某字段值取得指定的一条数据，如果有多条返回第一条
    //dataname:数据表名称
    //fieldName:字段名称
    //fieldvalue:字段值
    this.getDataByField=function(dataname,fieldName,fieldValue,callback){
        var table = _this.db.collection(dataname);
        var where={};
        where[fieldName]=fieldValue;
        table.find(where).toArray(function(err, arr) {
            var rtn={};
            if (arr){
                if (arr.length>0){
                    rtn.value=arr[0];
                    if (callback) callback(rtn);
                }else{
                    if (callback) callback({});
                }
            }else{
                if (callback) callback({});
            }
        });
    }
    //保存数据
    //name:数据表名称
    //data：要保存的数据
    this.saveData=function(name,data,callback){
        var table = _this.db.collection(name);
        data.updateTime=new Date().Format("yyyy-MM-dd hh:mm:ss");
        if (!data.createTime){
            data.createTime=data.updateTime;
        }
        data["_id"]=data.id;
        if (!data.state) data.state="";
        var oldData=null;
        table.find({id:data.id}).toArray(function(err, arr) {
            var rtn={};
            if (arr){
                if (arr.length>0){
                    oldData=arr[0];
                }
            }
            if (busiService.onBeforeDataSave){
                busiService.onBeforeDataSave(name,oldData,data,function(rtn2){
                    if (rtn2.error){
                        rtn.error=rtn2.error;
                        rtn.value=false;
                        callback(rtn);
                    }else{
                        saveData(rtn2.value);
                    }
                });
            }else{
                saveData(data);
            }
            function saveData(data){
                table.save(data, function(err, result) { 
                    var rtn={};
                    if(err)
                    {
                        console.log('saveData Error:'+ err);
                        rtn.error=err;
                        rtn.value=false;
                        return;
                    }else{
                        console.log('saveData ok');
                        busiService.onDataSave(name,oldData,data,function(rtn){
                            console.log('onDataSave ok');
                            rtn.log="busback";
                            callback(rtn);
                        });
                    }
                });
            }

        });


        //db.表名.update({id:data.id},{$set:data});
    }
    //删除指定的数据
    //name:数据表名称
    //data：要保存的数据
    this.deleteData=function(name,data,callback){
        var table = _this.db.collection(name);
        table.remove({id:data.id}, function(err, result) {
            var rtn={};
            if(err)
            {
                console.log('deleteData Error:'+ err);
                rtn.error=err;
                rtn.value=false;
                return;
            }else{
                console.log('deleteData ok');
                busiService.onDataDelete(name,data,function(rtn){
                    console.log('onDataSave ok');
                    if (callback) callback(rtn);
                });
            }
        })
    }
    //保存一组数据
    //dataname:数据表名称
    //list：要保存的数据列表
    this.saveDataList=function(dataname,list,callback){

        var table = _this.db.collection(dataname);
        var rtn={};
        rtn.count=0;
        for(var i=0;i<list.length;i++){
            var data=list[i];
            data.updateTime=new Date().Format("yyyy-MM-dd hh:mm:ss");
            if (!data.createTime){
                data.createTime=data.updateTime;
            }
            data["_id"]=data.id;
            table.save(data, funsave); 
        }

        function funsave(err,result){
            
            if(err)
            {
                console.log('saveData Error:'+ err);
                rtn.error=err;
                rtn.value=false;
                callback(rtn);
            }else{
                rtn.count++;
                if (rtn.count==list.length){
                    rtn.value=true;
                    callback(rtn);
                }
                console.log('saveData ok');
                
            }
        }
    }
    //清除一张表的数据
    this.removeTable=function(tablename,callback){
        _this.db.dropCollection(tablename,{safe:true},function(err,result){
            callback(!err);
        }); 
    }
    //清除除个人设置外的全部数据
    this.clearDB=function(callback){
        var tables=["Customer","Supplier","Income","Expenditure","Invoice","Purchase","Users","Message","Stock","CapitalAccount"];
        var delcount=0;
        function funback(){
            delcount++;
            if (delcount>=tables.length){
                _this.initUserData(function(){
                    callback({value:true});
                });
            }
        }
        
        for(var i=0;i<tables.length;i++){
            _this.removeTable(tables[i],funback);
        }
    }
    //按日期得到分组数据
    this.getTotalByDate=function(dataname,totalFun,totalField,dateField,where,callback){
        var table=_this.db.collection(dataname);
        
        var group={};
        group._id="$"+dateField;
        group._id ={year:{$substr:["$"+dateField,0,4]},month:{$substr:["$"+dateField,0,7]}};

        var sort={};
        sort["_id"]=-1;

        group[totalField]={};
        group[totalField]["$"+totalFun]="$"+totalField;

        if (where){
            table.aggregate([{$match: where},{$group: group},{$sort:sort}], funback);
        }else{
            table.aggregate([{$group: group},{$sort:sort}], funback);
        }

        
        
        function funback(err, result) {
            if (err) {
                console.log(err);
                callback({error:err,value:[]});
            }else{
                
                if (result.length<1){
                    callback({value:[]});
                    return;
                }
                var arr=[];
                
                for(var i=0;i<result.length;i++){
                    var d=result[i]._id;
                    d[totalField]=result[i][totalField];
                    d.datetime=d.month+"-01";
                    d.type="total";
                    d.group="month";
                    d.pos=0;
                    arr.push(d);
                }
                
                callback({value:arr});
            }
            
        }
    }
    

    //得到时间轴上的数据，该数据由两个表中的数据拼合而成。
    //data1:时间轴左侧的数据表名称
    //data2:时间轴右侧的数据表名称
    //where:查询条件，格式为{field:value}
    this.getDataFlow= function(dataInfo,where,callback){

        var data1=dataInfo.data1.id;
        var data2=dataInfo.data2.id;
        var isTotal=dataInfo.isTotal;
        var dflow=[];
        var arr1=null;
        var arr2=null;

        this.getDataList(data1,where,0,200,function(list){
            arr1=list.value;
            funback();
            //if (arr2!=null) callback(createFlow(arr1,arr2,isTotal));
        })
        this.getDataList(data2,where,0,200,function(list){
            arr2=list.value;
            funback();
            //if (arr1!=null) callback(createFlow(arr1,arr2,isTotal));
        })
        function funback(){
            if (arr1 && arr2){
                dflow=createFlow(arr1,arr2,isTotal);
                callback(dflow);
            }
        }
    }
    //得到数据轴上的汇总数据
    this.getDataFlowTotal=function(dataInfo,where,callback){
        var data1=dataInfo.data1.id;
        var data2=dataInfo.data2.id;
        var arrt1=null;
        var arrt2=null;
        this.getTotalByDate(data1,"sum","money","datetime",null,function(rt){
            arrt1=rt.value;
            funback();
        });
        this.getTotalByDate(data2,"sum","money","datetime",null,function(rt){
            arrt2=rt.value;
            funback();
        });
        function funback(){
            if (arrt1 && arrt2 ){
                var dtflow=getTotalFlow(arrt1,arrt2);
                callback(dtflow);
            }
        }
    }
        function getTotalFlow(t1,t2){

            for(var i=0;i<t1.length;i++){
                var data=t1[i];
                data.m1=data.money;
                var bfind=false;
                for(var j=0;j<t2.length;j++){
                    var t=t2[j];
                    if (t.month==data.month){
                        bfind=true;
                        data.m2=t.money;
                        break;
                    }
                    if (bfind==false && t.month<data.month){
                        t.m2=t.money;
                        t.m1=0;
                        t1.splice(i,0,t);
                        break;
                    }
                }
            }
            if (t1.length<1){
                t1=t2;
                for(var j=0;j<t2.length;j++){
                    var t=t2[j];
                    t.m2=t.money;
                    t.m1=0;
                }
            }
            if (t1.length<1){
                return t1;
            }
            var curdate=t1[0].year;
            var sumyear={type:"total",group:"year",datetime:data.month+"-01",m1:0,m2:0,pos:0};
            for(var i=0;i<t1.length;i++){
                var data=t1[i];
                if (!data.m1) data.m1=0;
                if (!data.m2) data.m2=0;
                if (data.year!=curdate){
                    t1.splice(i,0,sumyear);
                    sumyear={type:"total",group:"year",datetime:data.month+"-01",m1:0,m2:0,pos:0};
                }else{
                    sumyear.m1+=data.m1;
                    sumyear.m2+=data.m2;
                }
            }
            t1.push(sumyear);

            return t1;
        }

        function createFlow(arr1,arr2,total){
            var arr=[];

            for(var i=0;i<arr1.length;i++){
                var a=arr1[i];
                a.pos=1;
                var binsert=false;
                for(var j=0;j<arr.length;j++){
                    var aa=arr[j];
                    if (aa.datetime<a.datetime){
              
                        arr.splice(j,0,a);
                        binsert=true;
                        break;
                    }
                }
                if (binsert==false)
                    arr.push(a);
            }
            for(var i=0;i<arr2.length;i++){
                var a=arr2[i];
                a.pos=2;
                var binsert=false;
                for(var j=0;j<arr.length;j++){
                    var aa=arr[j];
                    if (aa.datetime<a.datetime){
                 
                        arr.splice(j,0,a);
                        binsert=true;
                        break;
                    }
                }
                if (binsert==false)
                    arr.push(a);
            }

            if (total && arr.length>0){

                var curdate=new Date();
                if (arr.length>0)
                    curdate=new Date(arr[0].datetime.substring(0,10).replace(/\-/g, "/"));

                var sumday={type:"total",group:"day",datetime:curdate.Format("yyyy-MM-dd"),m1:0,m2:0,pos:0};
                var sumweek={type:"total",group:"week",datetime:curdate.Format("yyyy-MM-dd"),m1:0,m2:0,pos:0};
                var summonth={type:"total",group:"month",datetime:curdate.Format("yyyy-MM")+"-01",m1:0,m2:0,pos:0};
                var sumyear={type:"total",group:"year",datetime:curdate.Format("yyyy")+"-01-01",m1:0,m2:0,pos:0};
                
                for(var i=0;i<arr.length;i++){
                    var a=arr[i];
                    if (a.pos!=0){
                        var dt=new Date(a.datetime.substring(0,10).replace(/\-/g, "/"));

                        if (curdate.getDay()!=dt.getDay()){
                            
                            arr.splice(i,0,sumday);
                            i+=1;
                            sumday={type:"total",group:"day",datetime:dt.Format("yyyy-MM-dd"),m1:0,m2:0,pos:0};
                        }
                        /*
                        if (curdate.getWeekOfYear()!=dt.getWeekOfYear() ){
                            
                            arr.splice(i,0,sumweek);
                            i+=1;
                            sumweek={type:"total",group:"week",datetime:dt.Format("yyyy-MM-dd"),m1:0,m2:0,pos:0};
                        }*/
                        if (curdate.getMonth()!=dt.getMonth() ){
                            
                            arr.splice(i,0,summonth);
                            i+=1;
                            summonth={type:"total",group:"month",datetime:dt.Format("yyyy-MM")+"-01",m1:0,m2:0,pos:0};
                        }
                        if (curdate.getYear()!=dt.getYear() ){
                            
                            arr.splice(i,0,sumyear);
                            i+=1;
                            sumyear={type:"total",group:"year",datetime:dt.Format("yyyy")+"-01-01",m1:0,m2:0,pos:0};
                        }
                        var m=parseFloat(a.money);
                        if (a.pos==1){
                            if (m) {
                                sumday.m1+=m;
                                sumweek.m1+=m;
                                summonth.m1+=m;
                                sumyear.m1+=m;
                            }
                        }else{
                            if (m) {
                                sumday.m2+=m;
                                sumweek.m2+=m;
                                summonth.m2+=m;
                                sumyear.m2+=m;
                            }
                            
                        }
                        curdate=dt;

                    }

                }
                arr.push(sumday);
                arr.push(summonth);
                //arr.push(sumyear);
            }
            return arr;
        }
}
module.exports = DataService;
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
Date.prototype.getWeekOfYear = function() { // weekStart：每周开始于周几：周日：0，周一：1，周二：2 ...，默认为周日  
  
    var year = this.getFullYear();  
    var firstDay = new Date(year, 0, 1);  
    var firstWeekDays = 7 - firstDay.getDay();  
    var dayOfYear = (((new Date(year, this.getMonth(), this.getDate())) - firstDay) / (24 * 3600 * 1000)) + 1;  
    return Math.ceil((dayOfYear - firstWeekDays) / 7) + 1;  
}  