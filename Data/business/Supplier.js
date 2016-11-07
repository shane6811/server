var AutoShareService=require('../AutoShare');
function Supplier(){
    var _this=this;
    var dataService = null;
    var autoShare=null;
    var uuid = require('node-uuid');  

    this.init=function(dService,callback){
        dataService=dService;
        _this.session=dService.session;
        _this.dataService=dService;
        autoShare=new AutoShareService();
        autoShare.session=_this.session;
        autoShare.init(function(){
            if(callback) callback(_this);
        });
    }
    this.onBeforeDataSave=function(name,oldData,data,callback){
        var rtn={};
        rtn.value=data;
        if (!data.phone) {
            callback(rtn);
            return;
        }
        autoShare.getUser(data,function(rtn2){
            
            var user=rtn.value;
            rtn.value.dbname=rtn2.value.dbname;
            rtn.value.state=rtn2.value.state;
            callback(rtn);
        });

    }
    this.onDataSave=function(name,oldData,data,callback){
        var val = parseFloat(data.money);
        if (oldData && oldData.money){
            val-=parseFloat(oldData.money);
        }
        if (val){
            dataService.addDataValue("资金","应付",val,function(rtn2){
                callback(rtn2);
            });
        }else{
            callback({value:true});
        }
        //对于自动创建的用户，自动保存一个供应商用户到对方的数据库中
        if (data.dbname && data.state=="autoCreate" ){
            var me=_this.session.loginUser;
            var sup={type:"Customer",name:me.name,username:me.username,phone:me.phone,dbname:me.dbname,money:data.money,photo:me.photo}
            autoShare.saveData(data,"Customer",sup,{$or: [{phone:me.phone},{dbname:me.phone}]},function(rtn){
                console.log(rtn.value);
            });
        }
    }
    this.onDataDelete=function(name,data,callback){
        var val = parseFloat(data.money);
        if (val){
            dataService.addDataValue("资金","应付",-val,function(rtn2){
                callback(rtn2);
            });
        }else{
            callback({value:true});
        }
    }
    this.addMoney=function(supplier,moneyadd,callback){
        if (typeof supplier=="string"){
            _this.dataService.getDataByField("Supplier","name",supplier,supback);
        }else{
            _this.dataService.getDataByField("Supplier","phone",supplier.phone,supback);
        }
        
        function supback(rtn){
            var cus=rtn.value;
            if (!cus){
                cus={id:uuid.v1(),name:supplier,money:moneyadd};
                cus.money=0;
                dataService.saveData("Supplier",cus,callback);
            }else{
                if (!cus.money) cus.money=0;
                cus.money=parseFloat(cus.money)+parseFloat(moneyadd);
                dataService.saveData("Supplier",cus,callback);
            }
        }
    }
}
module.exports = Supplier;