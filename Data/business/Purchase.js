//进货单
function Purchase(){
    var _this=this;
    var dataService = null;
    this.init=function(dService,callback){
        dataService=dService;
        _this.dataService=dService;
        _this.session=dService.session;
        var Service = require("./Supplier");
        var supService= new Service();
        _this.supService=supService;
        supService.init(_this.dataService,function(){
            if (callback) callback(_this);
        });
        
    }
    this.onDataDelete=function(name,data,callback){
        if (data.paid){
            var addmoney=-data.money;
            if (addmoney){
                dataService.addDataValue("资金","现金",-addmoney,callback);
            }else{
                callback({value:true});
            }
        }else{

            var addmoney=-data.money;
            if (addmoney){
                _this.supService.addMoney(data.supplier,addmoney,callback);
            }else{
                callback({value:true});
            }
        }
    }
    this.onDataSave=function(name,oldData,data,callback){
        if (data.paid){
            var addmoney=data.money;
            if (oldData && oldData.state=="beshared" && data.state=="sign") oldData.money=0;
            if (oldData) addmoney=data.money-oldData.money;
            if (addmoney){
                dataService.addDataValue("资金","现金",-addmoney,callback);
            }else{
                callback({value:true});
            }
        }else{

            var addmoney=data.money;
            if (oldData && oldData.state=="beshared" && data.state=="sign") oldData.money=0;
            if (oldData) addmoney=data.money-oldData.money;
            if (addmoney){
                _this.supService.addMoney(data.supplier,addmoney,callback);
            }else{
                callback({value:true});
            }
        }
  
        /*
        dataService.getDataValue("资金","应付",function(rtn){
            if (!rtn.error){
                var val=parseFloat( rtn.value.value);
                val+= parseFloat(data.money);
                if (oldData){
                    if (oldData.money){
                        val-=parseFloat(oldData.money);
                    }
                }
                dataService.saveDataValue("资金","应付",val,function(rtn2){
                    callback(rtn2);
                });
            }else{
                callback(rtn);
            }
        });
        */
    }
}
module.exports = Purchase;