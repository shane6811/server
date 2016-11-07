var data_Customer={id:"Customer",name:"客户"};
var data_Supplier={id:"Supplier",name:"供应商"};
var data_Stock ={id:"Stock ",name:"存货"};
var data_CapitalAccount={id:"CapitalAccount",name:"账户"};
var data_Income={id:"Income",name:"收入"};
var data_Expenditure={id:"Expenditure",name:"支出"};
var data_Invoice={id:"Invoice",name:"发货"};
var data_Purchase={id:"Purchase",name:"进货"};
var data_Users={id:"Users",name:"用户"};
var data_PhoneContact={id:"PhoneContact",name:"联系人"};


var uics=[

	{window:"WinMain",control:"DataIcon",event:"onclick",mothod:"openWindow",dataNames:["Stock","Payable","Cash","Receivable"], newWindow:"WinFlow",params:["control.data","control","flow"]},
	{window:"WinMain",control:"DataDom",event:"onclick",mothod:"openWindow",dataNames:["Customer","Supplier"], newWindow:"WinList",params:["control.dataInfo","control","top"]},
	{window:"WinMain",control:"DataIcon",event:"onclick",mothod:"openWindow",dataNames:["Message"], newWindow:"WinMsg",params:["control.dataInfo","control","left"]},
	
	{window:"WinFlow",control:"DataDom",event:"onclick",mothod:"openWindow",dataNames:["Income","Expenditure","Invoice","Purchase"],newWindow:"WinData",params:["control.dataInfo","control.parent","extend"]},
	
	{window:"WinList",control:"DataDom",event:"onclick",mothod:"openWindow",dataNames:["Customer","Supplier"], newWindow:"WinCusFlow",params:["win.dataInfo","control","extend"]},
	
	{window:"WinCusFlow",control:"DataDom",event:"onclick",mothod:"openChildWindow",dataNames:["Income","Expenditure","Invoice","Purchase"], newWindow:"WinData",params:["control.dataInfo","control.parent","control.defaultData"]},
	
];

function initUIModel(scheme){
	//scheme.Customer.UIModel=new ui_Income();
	scheme.Income.UIModel=new ui_Income();//收入
	scheme.Expenditure.UIModel=new ui_Expenditure();//支出
	scheme.Invoice.UIModel=new ui_Invoice();//发货
	scheme.Purchase.UIModel=new ui_Purchase();//进货
	scheme.PhoneContact=data_PhoneContact;
	scheme.PhoneContact.UIModel=new ui_PhoneContact();
	
	scheme.Customer.UIModel=new ui_Customer();//客户
	scheme.Supplier.UIModel=new ui_Supplier();//供货商
	
	scheme.Message.UIModel=new ui_Message();//供货商
	
	scheme.Customer.data1=scheme.Income;
	scheme.Customer.data2=scheme.Invoice;
	scheme.Supplier.data1=scheme.Purchase;
	scheme.Supplier.data2=scheme.Expenditure;
}
function ui_Income(){
	this.getText=function(data){
		if (data.customer && data.customer.name)
			return data.customer+"还款:"+data.money+"元";
		else
			return "收入："+data.money+"元";
	};
	this.onDataChanged=function(oldData,newData){
		
	};
}
function ui_Expenditure(){
	this.getText=function(data){
		if (data.supplier && data.supplier.name){
			return "付给"+data.supplier+":"+data.money+"元";
		}else{
			return "支出："+data.money+"元";
		}
	};
	this.onDataChanged=function(oldData,newData){
		
	};
}
function ui_Invoice(){
	this.getText=function(data){
		if (data.customer && data.customer.name){
			return "发货给"+data.customer+":"+data.money+"元";
		}else{
			return "销售收入："+data.money+"元";
		}
	};
	this.onDataChanged=function(oldData,newData){
		
	};
}
function ui_Purchase(){
	this.getText=function(data){
		if(data.supplier && data.supplier.name){
			return "从"+data.supplier+"进货:"+data.money+"元";
		}else{
			return "采购支出："+data.money;
		}
	};
	this.onDataChanged=function(oldData,newData){
		
	};
}
function ui_Customer(){
	this.getText=function(data){
		return data.name;
	};
	this.getListItem=function(data){
	
		var controls=[];
		var imgPhoto=getImage(data.id+"_photo",3,3,48,48,5,1);
		var divName=getDiv(data.id+"_name",58,8,48,48,5,1);
		var divPhone=getDiv(data.id+"_phone",58,33,48,48,5,1);
		var divMoney=getDiv(data.id+"_money",243,8,48,48,5,1);
		var divLevel=getDiv(data.id+"_level",243,33,48,48,5,1);
		
		
		if (!data.photo)
			imgPhoto.src="../image/photo.png";
		else
			imgPhoto.src=urlServer+"/"+data.photo;
		
		if (!data.money) data.money=0;
		divName.textContent=data.name;
		divPhone.textContent=data.phone;
		divMoney.textContent=data.money;
		divLevel.textContent=data.level;
		
		imgPhoto.dataid="photo";
		imgPhoto.style.opacity=0.6;
		imgPhoto.styleTo={opacity:0.6};
		
		divName.dataid="name";
		divPhone.dataid="phone";
		divMoney.dataid="money";
		divLevel.dataid="level";
		
		divMoney.style.right="8px";
		divMoney.style.textAlign="right";
		divLevel.style.right="8px";
		divMoney.style.left="";
		divLevel.style.left="";
		divPhone.style.fontSize="12px";
		divLevel.style.fontSize="12px";
		
		controls.push(imgPhoto);
		controls.push(divName);
		controls.push(divPhone);
		controls.push(divMoney);
		controls.push(divLevel);
		return controls;
		
	};
}
function ui_Supplier(){
	this.getText=function(data){
		return data.name;
	};
	this.getListItem=function(data){
	
		var controls=[];
		var imgPhoto=getImage(data.id+"_photo",3,3,48,48,5,1);
		var divName=getDiv(data.id+"_name",58,8,48,48,5,1);
		var divPhone=getDiv(data.id+"_phone",58,33,48,48,5,1);
		var divMoney=getDiv(data.id+"_money",243,8,48,48,5,1);
		var divLevel=getDiv(data.id+"_level",243,33,48,48,5,1);
		
		if (!data.photo)
			imgPhoto.src="../image/photo.png";
		else
			imgPhoto.src=urlServer+"/"+data.photo;
		
		if (!data.money) data.money=0;
		divName.textContent=data.name;
		divPhone.textContent=data.phone;
		divMoney.textContent=data.money;
		divLevel.textContent=data.level;
		
		divMoney.style.right="8px";
		divMoney.style.textAlign="right";
		divLevel.style.right="8px";
		divMoney.style.left="";
		divLevel.style.left="";
		divPhone.style.fontSize="12px";
		divLevel.style.fontSize="12px";
		
		imgPhoto.styleTo={opacity:0.6};
		
		controls.push(imgPhoto);
		controls.push(divName);
		controls.push(divPhone);
		controls.push(divMoney);
		controls.push(divLevel);
		return controls;
		
	};
}
function ui_PhoneContact(){
	this.getText=function(data){
		return data.fullname;
	};
	this.getListItem=function(data){
	
		var controls=[];

		var divName=getDiv(data.id+"_name",10,8,48,48,5,1);
		var divPhone=getDiv(data.id+"_phone",10,33,48,48,5,1);

		

		divName.textContent=data.name;
		divPhone.textContent=data.phone;


		divName.style.fontSize="14px";
		divPhone.style.fontSize="12px";

		controls.push(divName);
		controls.push(divPhone);
	
		return controls;
		
	};
};
function ui_Message(){
	this.getText=function(data){
		return data.message;
	};
	this.getListItem=function(data){
	
		var controls=[];
		var imgPhoto=getImage(data.id+"_photo",3,3,48,48,5,1);
		var divName=getDiv(data.id+"_name",62,8,100,48,5,1);
		
		var divTime=getDiv(data.id+"_time",243,8,60,48,5,1);
		var divMsg=getDiv(data.id+"_msg",62,33,300,48,5,1);
		
		if (data.fromuser){
			if (!data.fromuser.photo)
				imgPhoto.src="../image/photo.png";
			else
				imgPhoto.src=urlServer+ "/"+data.fromuser.photo;
				
			divName.textContent=data.fromuser.username;
		}
		divTime.textContent= getDateText( data.date);
		divMsg.textContent=data.message;

		
		divTime.style.right="10px";
		divTime.style.left="";
		divMsg.style.fontSize="12px";
		
		
		if (!data.read){
			divMsg.className="ddiv unread";
		}
		
		controls.push(imgPhoto);
		controls.push(divName);
		controls.push(divTime);
		controls.push(divMsg);
	
		return controls;
		
	};
}