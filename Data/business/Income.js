//收款单
function InCome(){
    var _this=this;
    var dataService = null;
    var cusService=null;
    this.init=function(dService,callback){
        dataService=dService;
        _this.dataService=dService;
        _this.session=dService.session;
        var Service = require("./Customer");
        cusService= new Service();
        cusService.init(_this.dataService,function(){
            if (callback) callback(_this);
        });
        _this.cusService=cusService;
    }

    this.onDataSave=function(name,oldData,data,callback){

        var addmoney=data.money;
        if (oldData && oldData.state=="beshared" && data.state=="sign") oldData.money=0;
        if (oldData) addmoney=data.money-oldData.money;
        if (addmoney){
            dataService.addDataValue("资金","现金",addmoney,callback);
            if (data.customer){ 
                _this.cusService.addMoney(data.customer,-addmoney,function(){});
            }else{
                //dataService.addDataValue("资金","应收",-addmoney);
            }
        }else{
            callback({value:true});
        }
 
    }
    this.onDataDelete=function(name,data,callback){
        var addmoney=data.money;
        if (addmoney){
            dataService.addDataValue("资金","现金",-addmoney,callback);
            if (data.customer) {
                _this.cusService.addMoney(data.customer,addmoney,function(){});
            }else{
                //dataService.addDataValue("资金","应收",-addmoney);
            }
        }else{
            callback({value:true});
        }
    }
}
module.exports = InCome;