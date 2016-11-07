//付款单
function Expenditure(){
    var _this=this;
    var dataService = null;
    this.init=function(dService,callback){
        dataService=dService;
        _this.dataService=dService;
        _this.session=dService.session;
        var Service = require("./Supplier");
        var supService= new Service();
        supService.init(_this.dataService,function(){
            if (callback) callback(_this);
        });
        _this.supService=supService;
        
    }

    this.onDataSave=function(name,oldData,data,callback){
        var addmoney=data.money;
        if (oldData && oldData.state=="beshared" && data.state=="sign") oldData.money=0;
        if (oldData) addmoney=data.money-oldData.money;

        if (addmoney){
            dataService.addDataValue("资金","现金",-addmoney,callback);
            if (data.supplier)
                _this.supService.addMoney(data.supplier,-addmoney,function(){});
            else{
                //dataService.addDataValue("资金","应付",-addmoney);
            }
        }else{
            callback({value:true});
        }

    }
    this.onDataDelete=function(name,data,callback){
        var addmoney=data.money;
        if (addmoney){
            dataService.addDataValue("资金","现金",addmoney,callback);
            if (data.supplier) {
                _this.supService.addMoney(data.supplier,addmoney,function(){});
            }else{
                //dataService.addDataValue("资金","应付",-addmoney);
            }
        }else{
            callback({value:true});
        }
    }
}
module.exports = Expenditure;