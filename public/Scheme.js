function Scheme(){

    var data_Customer={id:"Customer",name:"客户"};
    var data_Supplier={id:"Supplier",name:"供应商"};
    var data_Stock ={id:"Stock ",name:"存货"};
    var data_CapitalAccount={id:"CapitalAccount",name:"账户"};
    var data_Income={id:"Income",name:"收入"};
    var data_Expenditure={id:"Expenditure",name:"支出"};
    var data_Invoice={id:"Invoice",name:"发货"};
    var data_Purchase={id:"Purchase",name:"进货"};
    var data_Users={id:"Users",name:"用户"};
    var data_Message={id:"Message",name:"消息"};

    data_Customer.Fields=[];
    data_Supplier.Fields=[];
    data_Stock.Fields=[];
    data_CapitalAccount.Fields=[];
    data_Income.Fields=[];
    data_Expenditure.Fields=[];
    data_Invoice.Fields=[];
    data_Purchase.Fields=[];
    data_Users.Fields=[];
    data_Message.Fields=[];

    this.getDataScheme=function (callback){
        
        var dataTables=[data_Customer,data_Supplier,data_Stock,data_CapitalAccount,data_Income,data_Expenditure,data_Invoice,data_Purchase,data_Users,data_Message];
        for(var i=0;i<dataTables.length;i++){
            var table=dataTables[i];
            table.Fields.push({id:"id",datatype:"guid",type:"system",visible:false});
            table.Fields.push({id:"createUser",datatype:"string",datalength:32,type:"system",visible:false});
            table.Fields.push({id:"updateUser",datatype:"string",datalength:32,type:"system",visible:false});
            table.Fields.push({id:"createTime",datatype:"datetime",datalength:32,type:"system",visible:false});
            table.Fields.push({id:"updateTime",datatype:"datetime",datalength:32,type:"system",visible:false});
        }
        getFields();
        callback (dataTables);
    }

    function getFields(){
        //客户
        data_Customer.Fields.push({id:"name",name:"姓名",datatype:"string",datalength:32,dataformat:"text",type:"user",visible:true,datalevel:1});
        data_Customer.Fields.push({id:"money",name:"应收",datatype:"number",datalength:32,dataformat:"number",type:"user",visible:true,datalevel:1});
        data_Customer.Fields.push({id:"photo",name:"头像",datatype:"image",datalength:32,dataformat:"image",type:"user",visible:true,datalevel:1});
        data_Customer.Fields.push({id:"phone",name:"手机",datatype:"string",datalength:32,dataformat:"number",type:"user",visible:true,datalevel:1});
        data_Customer.Fields.push({id:"telephone",name:"电话",datatype:"string",datalength:32,dataformat:"number",type:"user",visible:true,datalevel:2});
        data_Customer.Fields.push({id:"email",name:"邮箱",datatype:"string",datalength:32,dataformat:"text",type:"user",visible:true,datalevel:3});
        data_Customer.Fields.push({id:"weixin",name:"微信",datatype:"string",datalength:32,dataformat:"text",type:"user",visible:true,datalevel:3});
        data_Customer.Fields.push({id:"qq",name:"qq",datatype:"string",datalength:32,dataformat:"text",type:"user",visible:true,datalevel:3});
        data_Customer.Fields.push({id:"note",name:"备注",datatype:"string",datalength:32,dataformat:"text",type:"user",visible:true,datalevel:2});
        //供货商
        data_Supplier.Fields.push({id:"name",name:"姓名",datatype:"string",datalength:32,dataformat:"text",type:"user",visible:true,datalevel:1});
        data_Supplier.Fields.push({id:"money",name:"应付",datatype:"number",datalength:32,dataformat:"number",type:"user",visible:true,datalevel:1});
        data_Supplier.Fields.push({id:"photo",name:"头像",datatype:"image",datalength:32,dataformat:"image",type:"user",visible:true,datalevel:1});
        data_Supplier.Fields.push({id:"phone",name:"手机",datatype:"string",datalength:32,dataformat:"number",type:"user",visible:true,datalevel:1});
        data_Supplier.Fields.push({id:"telephone",name:"电话",datatype:"string",datalength:32,dataformat:"number",type:"user",visible:true,datalevel:2});
        data_Supplier.Fields.push({id:"email",name:"邮箱",datatype:"string",datalength:32,dataformat:"text",type:"user",visible:true,datalevel:3});
        data_Supplier.Fields.push({id:"weixin",name:"微信",datatype:"string",datalength:32,dataformat:"text",type:"user",visible:true,datalevel:3});
        data_Supplier.Fields.push({id:"qq",name:"qq",datatype:"string",datalength:32,dataformat:"text",type:"user",visible:true,datalevel:3});
        data_Supplier.Fields.push({id:"note",name:"备注",datatype:"string",datalength:32,dataformat:"text",type:"user",visible:true,datalevel:2});
        //员工
        data_Users.Fields.push({id:"userid",name:"姓名",datatype:"string",datalength:32,dataformat:"text",type:"system",visible:true,datalevel:1});
        data_Users.Fields.push({id:"name",name:"姓名",datatype:"string",datalength:32,dataformat:"text",type:"user",visible:true,datalevel:1});
        data_Users.Fields.push({id:"photo",name:"头像",datatype:"image",datalength:32,dataformat:"image",type:"user",visible:true,datalevel:1});
        data_Users.Fields.push({id:"phone",name:"手机",datatype:"string",datalength:32,dataformat:"number",type:"user",visible:true,datalevel:1});
        data_Users.Fields.push({id:"telephone",name:"电话",datatype:"string",datalength:32,dataformat:"number",type:"user",visible:true,datalevel:2});
        data_Users.Fields.push({id:"email",name:"邮箱",datatype:"string",datalength:32,dataformat:"text",type:"user",visible:true,datalevel:3});
        data_Users.Fields.push({id:"weixin",name:"微信",datatype:"string",datalength:32,dataformat:"text",type:"user",visible:true,datalevel:3});
        data_Users.Fields.push({id:"qq",name:"qq",datatype:"string",datalength:32,dataformat:"text",type:"user",visible:true,datalevel:3});
        data_Users.Fields.push({id:"note",name:"备注",datatype:"string",datalength:32,dataformat:"text",type:"user",visible:true,datalevel:2});

        //存货
        data_Stock.Fields.push({id:"name",name:"名称",datatype:"string",datalength:32,dataformat:"text",type:"user",visible:true,datalevel:1});
        data_Stock.Fields.push({id:"model",name:"型号",datatype:"string",datalength:32,dataformat:"text",type:"user",visible:true,datalevel:1});
        data_Stock.Fields.push({id:"money",name:"金额",datatype:"number",datalength:32,dataformat:"number",type:"user",visible:true,datalevel:1});
        data_Stock.Fields.push({id:"photo",name:"相片",datatype:"image",datalength:32,dataformat:"image",type:"user",visible:true,datalevel:1});
        data_Stock.Fields.push({id:"unit",name:"单位",datatype:"string",datalength:32,dataformat:"text",type:"user",visible:true,datalevel:2});
        data_Stock.Fields.push({id:"price",name:"价格",datatype:"number",datalength:32,dataformat:"number",type:"user",visible:true,datalevel:2});
        data_Stock.Fields.push({id:"count",name:"存量",datatype:"number",datalength:32,dataformat:"number",type:"user",visible:true,datalevel:2});
        //银行账号
        data_CapitalAccount.Fields.push({id:"name",name:"名称",datatype:"string",datalength:32,dataformat:"text",type:"user",visible:true,datalevel:1});
        data_CapitalAccount.Fields.push({id:"money",name:"金额",datatype:"number",datalength:32,dataformat:"number",type:"user",visible:true,datalevel:1});
        data_CapitalAccount.Fields.push({id:"bankname",name:"银行",datatype:"string",datalength:32,dataformat:"text",type:"user",visible:true,datalevel:1});
        data_CapitalAccount.Fields.push({id:"cardno",name:"卡号",datatype:"number",datalength:32,dataformat:"number",type:"user",visible:true,datalevel:1});
        data_CapitalAccount.Fields.push({id:"note",name:"备注",datatype:"string",datalength:32,dataformat:"text",type:"user",visible:true,datalevel:2});
        //收入
        
        data_Income.Fields.push({id:"money",name:"金额",datatype:"number",datalength:32,dataformat:"number",type:"user",visible:true,datalevel:1});
        data_Income.Fields.push({id:"customer",name:"客户",datatype:"object",datalength:32,dataformat:"object",datasource:"Customer",type:"user",visible:true,datalevel:1});
        data_Income.Fields.push({id:"intype",name:"类别",datatype:"string",datalength:32,dataformat:"text",type:"user",visible:true,datalevel:2});
        data_Income.Fields.push({id:"account",name:"账号",datatype:"object",datalength:32,dataformat:"object",datasource:"CapitalAccount",type:"user",visible:true,datalevel:2});
        data_Income.Fields.push({id:"user",name:"员工",datatype:"object",datalength:32,dataformat:"object",datasource:"Users",type:"user",visible:true,datalevel:2});
        data_Income.Fields.push({id:"image",name:"照片",datatype:"image",datalength:32,dataformat:"image",type:"user",visible:true,datalevel:1});
        data_Income.Fields.push({id:"note",name:"备注",datatype:"string",datalength:32,dataformat:"text",type:"user",visible:true,datalevel:2});
        
        
        //支出
        data_Expenditure.Fields.push({id:"money",name:"金额",datatype:"number",datalength:32,dataformat:"number",type:"user",visible:true,datalevel:1});
        data_Expenditure.Fields.push({id:"supplier",name:"供应商",datatype:"object",datalength:32,dataformat:"object",datasource:"Supplier",type:"user",visible:true,datalevel:1});
        data_Expenditure.Fields.push({id:"extype",name:"类别",datatype:"string",datalength:32,dataformat:"text",type:"user",visible:true,datalevel:2});
        data_Expenditure.Fields.push({id:"image",name:"照片",datatype:"image",datalength:32,dataformat:"image",type:"user",visible:true,datalevel:1});
        data_Expenditure.Fields.push({id:"account",name:"账号",datatype:"object",datalength:32,dataformat:"object",datasource:"CapitalAccount",type:"user",visible:true,datalevel:2});
        data_Expenditure.Fields.push({id:"user",name:"员工",datatype:"object",datalength:32,dataformat:"object",datasource:"Users",type:"user",visible:true,datalevel:2});
        data_Expenditure.Fields.push({id:"note",name:"备注",datatype:"string",datalength:32,dataformat:"text",type:"user",visible:true,datalevel:2});
        
        //发货
        data_Invoice.Fields.push({id:"money",name:"金额",datatype:"number",datalength:32,dataformat:"number",type:"user",visible:true,datalevel:1});
        data_Invoice.Fields.push({id:"customer",name:"客户",datatype:"object",datalength:32,dataformat:"object",datasource:"Customer",type:"user",visible:true,datalevel:1});
        data_Invoice.Fields.push({id:"image",name:"照片",datatype:"image",datalength:32,dataformat:"image",type:"user",visible:true,datalevel:1});
        data_Invoice.Fields.push({id:"address",name:"收货地址",datatype:"string",datalength:32,dataformat:"text",type:"user",visible:true,datalevel:2});
        data_Invoice.Fields.push({id:"user",name:"员工",datatype:"object",datalength:32,dataformat:"object",datasource:"Users",type:"user",visible:true,datalevel:2});
        data_Invoice.Fields.push({id:"note",name:"备注",datatype:"string",datalength:32,dataformat:"text",type:"user",visible:true,datalevel:2});
        data_Invoice.Fields.push({id:"list",name:"货物清单",datatype:"list",datalength:32,dataformat:"list",datasource:"InvoiceDetail",type:"user",visible:true,datalevel:2});
        
        //进货
        data_Purchase.Fields.push({id:"money",name:"金额",datatype:"number",datalength:32,dataformat:"number",type:"user",visible:true,datalevel:1});
        data_Purchase.Fields.push({id:"supplier",name:"供货商",datatype:"object",datalength:32,dataformat:"object",datasource:"Supplier",type:"user",visible:true,datalevel:1});
        data_Purchase.Fields.push({id:"image",name:"照片",datatype:"image",datalength:32,dataformat:"image",type:"user",visible:true,datalevel:1});
        data_Purchase.Fields.push({id:"user",name:"员工",datatype:"object",datalength:32,dataformat:"object",datasource:"Users",type:"user",visible:true,datalevel:2});
        data_Purchase.Fields.push({id:"note",name:"备注",datatype:"string",datalength:32,dataformat:"text",type:"user",visible:true,datalevel:2});
        data_Purchase.Fields.push({id:"list",name:"货物清单",datatype:"list",datalength:32,dataformat:"list",datasource:"InvoiceDetail",type:"user",visible:true,datalevel:2});
        
        data_Message.Fields.push({id:"fromuser",name:"发送者",datatype:"object",datalength:32,dataformat:"object",datasource:"Users",type:"user",visible:true,datalevel:1});
        data_Message.Fields.push({id:"date",name:"时间",datatype:"string",datalength:128,dataformat:"datetime",type:"user",visible:true,datalevel:1});
        data_Message.Fields.push({id:"message",name:"消息内容",datatype:"string",datalength:128,dataformat:"string",type:"user",visible:true,datalevel:1});
        data_Message.Fields.push({id:"dataType",name:"数据类型",datatype:"string",datalength:128,dataformat:"string",type:"system",visible:false,datalevel:0});
        data_Message.Fields.push({id:"data",name:"数据",datatype:"object",datalength:128,dataformat:"object",type:"system",visible:false,datalevel:0});

    }


}
module.exports = Scheme;