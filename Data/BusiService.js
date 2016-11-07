var Scheme=require('./Scheme');
var AutoShareService=require('./AutoShare');
function BusiService(){
    var _this=this;
    var sysFile = require("fs");
    var dataService = null;
    var autoShare=null;
    var data_Scheme;
    var total_Scheme;
    new Scheme().getDataScheme(function(scheme){
        data_Scheme=scheme;
    });
    this.init=function(dService){
        dataService=dService;
        _this.session=dService.session;
        _this.dataService=dService;
        autoShare=new AutoShareService();
        autoShare.session=_this.session;
        autoShare.init();
        total_Scheme=[];

    }
    this.getBusService=function(name,callback){
        var filepath=__dirname+"/business/"+name+".js";
        if (sysFile.existsSync(filepath)){
            var Service = require("./business/"+name);
            var service= new Service();
            service.session=_this.session;
            service.init(_this.dataService,function(ret){
                if (callback) callback(ret);
            });
            return service;
        }else{
            callback(null);
            return null;
        }
        
    }
    this.createRefData=function(name,data,callback){
        var tableInfo=data_Scheme[name];
        if (!tableInfo) {
            callback(data);
            return;
        }
        var fdcount=0;
        var rtcount=0;
        var fields=[];
        //找到所有应该转为引用对象的字段
        for(var i=0;i<tableInfo.Fields.length;i++){
            var fd=tableInfo.Fields[i];
            if (fd.datatype=="object"){
                var value = data[fd.id];
                if (value){
                    if (typeof value=="string"){
                        fields.push(fd);
                    }
                }
            }
        }
        
        if (fields.length<1){
            callback(data);
            return;
        }
        //为该字段赋值
        for(var i=0;i<fields.length;i++){    
            var fd=fields[i];      
            getRefData(data,fd.id, fd.datasource,function(data){
                rtcount++;
                if (rtcount>=fields.length){
                    callback(data);
                }
            });
        }
        function getRefData(data,fieldname,refdataname,callback){
            dataService.getDataByField(refdataname,"name",data[fieldname],function(rtnb){
                var refdata=null;
                if (rtnb.value){
                    data[fieldname]=rtnb.value;
                }
                callback(data);
            });
        }
    }
    this.onBeforeDataSave=function(name,oldData,data,callback){
        var rtn={value:data};
        this.createRefData(name,data,function(rdata){
            rtn.value=rdata;
            var service=_this.getBusService(name,function(service){
                if (service && service.onBeforeDataSave)
                    service.onBeforeDataSave(name,oldData,data,callback);
                else
                    callback(rtn);
            });

        })
    }
    this.onDataSave=function(name,oldData,data,callback){
        var rtn={value:true};
        var service=_this.getBusService(name,function(){
            if (service && service.onDataSave){
                service.onDataSave(name,oldData,data,callback);
            }else{
                callback(rtn);
            }

            autoShare.autoShare(name,data);

        });
    }
    /*该方法未完成
    this.onDataEvents=function(name,data,event,callback){
        var dinfo=null;
        for(var i=0;i<sinfo.length;i++){
            if (sinfo[i].id==name){
                dinfo=sinfo[i];
            }
        }
        if (!dinfo){
            callback({value:false});
            return;
        }

        for(var i=0;i<dinfo.events.length;i++){
            var e=dinfo.events[i];
            var objWhere=e.where;

            dataService.getDataList(e.data,objWhere,0,0,function(rtn){
                var arr=rtn.value;
                if (arr.length>0){
                    var d=arr[0];
                    if (e.fun=="+") d[e.field]+=data[e.value];
                    if (e.fun=="-") d[e.field]-=data[e.value];
                    dataService.saveData(e.data,d);
                }
            })
        }
    }*/
    this.onDataDelete=function(name,data,callback){
        var service=_this.getBusService(name);
        var rtn={value:true};
        if (service && service.onDataDelete)
            service.onDataDelete(name,data,callback);
        else
            callback(rtn);
    }
}
module.exports = BusiService;