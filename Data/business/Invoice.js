//发货
function Invoice(){
    var _this=this;
    var dataService = null;
    this.init=function(dService,callback){
        dataService=dService;
        _this.dataService=dService;
        _this.session=dService.session;
        var Service = require("./Customer");
        var cusService= new Service();
        cusService.init(_this.dataService,function(){
            if (callback) callback(_this);
        });
        _this.cusService=cusService;
    }
    this.onDataDelete=function(name,data,callback){
        if (data.paid){
            //如果已经支付，则增加现金而不是增加应收款
            var addmoney=-data.money;
            if (addmoney){
                dataService.addDataValue("资金","现金",addmoney,callback);
            }else{
                callback({value:true});
            }
        }else{
            //如果用户未支付，则增加应付而不是现金
            var addmoney=-data.money;
            if (addmoney){
                _this.cusService.addMoney(data.customer,addmoney,callback);
            }else{
                if (callback) callback({value:true});
            }
        }
    }
    this.onDataSave=function(name,oldData,data,callback){
        
        if (data.paid){
            //如果已经支付，则增加现金而不是增加应收款
            var addmoney=data.money;
            if (oldData && oldData.state=="beshared" && data.state=="sign") oldData.money=0;
            if (oldData && oldData.money) addmoney=data.money-oldData.money;
            if (addmoney){
                dataService.addDataValue("资金","现金",addmoney,callback);
            }else{
                callback({value:true});
            }
        }else{
            //如果用户未支付，则增加应付而不是现金
            var addmoney=data.money;
            if (oldData && oldData.state=="beshared" && data.state=="sign") oldData.money=0;
            if (oldData && oldData.money) addmoney=data.money-oldData.money;
            if (addmoney){
                _this.cusService.addMoney(data.customer,addmoney,callback);
            }else{
                callback({value:true});
            }
        }
  
        /*
        dataService.getDataValue("资金","应收",function(rtn){
            if (!rtn.error){
                var val=parseFloat( rtn.value.value);
                val+= parseFloat(data.money);
                if (oldData){
                    if (oldData.money){
                        val-=parseFloat(oldData.money);
                    }
                }
                dataService.saveDataValue("资金","应收",val,function(rtn2){
                    callback(rtn2);
                });
            }else{
                callback(rtn);
            }
        });
        */
    }
}
module.exports = Invoice;