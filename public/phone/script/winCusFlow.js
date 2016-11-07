function WinCusFlow(id,title){
	var _this=this;
	this.id=id;
	this.title=title;
	var dform=null;
	var dwin=null;
	var dflow=null;
	this.init=function(div){
		this.domNode=div;
		this.curnode=div;
		this.customer=div.data;
		this.supplier=div.data;
		
	}
	this.load=function(dataInfo){
		this.isDestroy=false;
		this.dataInfo=dataInfo;
		var div=_this.domNode;

		
		div.style.left=this.width*0.2+"px";
		div.style.width=this.width*0.6+"px";
		
		this.winTitle.btnRight.textContent="对账";
		this.winTitle.btnRight.show();
		this.winTitle.style.display="none";
		
		if (!dflow) dflow=new DataFlow();
		this.dataFlow=dflow;
		this.inEdit=false;
		dflow.init(this.domNode);
		dflow.left=0;
		dflow.top=parseInt (this.domNode.style.top)+ parseInt( this.domNode.style.height)+10;
		
		dflow.load(dataInfo);
		
		dflow.onNodeClick=_this.onNodeClick;
		dflow.onButtonClick=_this.onButtonClick;
		
		//dflow.setButtons("新增"+data.data1,"新增"+data.data2);	
		this.children.push(dflow);
		this.domNode.onclick=_this.onCusEdit;
	
		if (!this.customer.dbname) this.customer.dbname=this.customer.phone;
		var whereobj={$or:[{"customer":this.customer.name},{"customer.dbname":this.customer.dbname},{"customer.phone":this.customer.phone}]};
		if (dataInfo.id=="Payable" || dataInfo.id=="Supplier"){
			whereobj={$or:[{"supplier":this.customer.name},{"supplier.dbname":this.customer.dbname},{"supplier.phone":this.customer.phone}]};
		}
		dataInfo.isTotal=false;
		dataService.getDataFlow(dataInfo,whereobj,function(rtn){
			if (_this.isDestroy){
				_this.hide();
				dflow.destroy();
				return;
			}
			if (_this.visible){
				
				dflow.loadData(rtn);
				if (_this.inEdit){
					dflow.hide();
				}else{
					dflow.show();
				}
			}else{
				dflow.hide();
				window.setTimeout(function(){
					if (_this.isDestroy) dflow.destroy();
				},1000);
			}
		})
		this.winTitle.btnRight.onclick=function(){
			if(!_this.customer.dbname)
				_this.customer.dbname=_this.customer.phone;
			if(!_this.customer.dbname){
				$.alert("该用户没有设置手机号，请设置完成后再对账");
				return;
			} 
			shareService.shareDataFlow(dataInfo,_this.customer,function(rtn){
				
				if (rtn.error){
					$.alert(rtn.error);
				}else{
					var url="phone/html/share.html?fromuser="+loginUser;
					url+="&touser="+_this.customer.dbname;
					url+="&dataname="+dataInfo.id;
					weiXin_Share("对账单","总金额："+_this.customer.money,url);
				}
			});
			
		}
	}
	this.getForm=function(dataInfo,div){
		dform=new DataForm();
		dform.init(div);

		dform.width=document.documentElement.clientWidth-40;
		dform.load(dataInfo);
		dform.datatype=dataInfo.id;
		dform.dataInfo=dataInfo;
		return dform;
	}

	this.loadMore=function(){
		//div.innerHTML="";
		dflow.hide();
		dform.showFullScreen();
		dform.onDataDelete=function(){
			var data=dform.data;
			var dataname=this.dataInfo.id;
			dataService.deleteData(dataname,data,function(rtn){
				
				var node=dform.domNode;
				node.hide();
				window.setTimeout(function(){
					_this.close();
					node.destroy();
				},400);
				
			});
		}
	}
	this.onCusEdit=function(){
		//div.innerHTML="";
		_this.inEdit=true;
		var div=_this.domNode;
		var divStyle=getStyleData(div);
		div.style.left="20px";
		div.style.top="60px"
		div.style.width=document.documentElement.clientWidth-40+"px";
		var dfrom=_this.getForm(data_Scheme[_this.dataInfo.id] ,_this.domNode);
		dfrom.divTitle.textContent="编辑"+_this.dataInfo.name;
		dfrom.setData(div.data);
		
		dfrom.show();
		dform.btnShare.hide();
		var moveHeight=parseInt (dfrom.domNode.style.height)
		
		dflow.move(0,moveHeight);

		dform.onSaveClick=function(){
			var data=dform.getData();
			dataService.saveData(_this.dataInfo.id,data,function(rtn){
				//alert(rtn.value);
				_this.cancelEdit();
			});
		}
		dfrom.onClose=function(){
			_this.winTitle.style.display="none";
			div.clear();
			div.loadData();
			setStyleData(div,divStyle);
			dflow.move(0,-moveHeight);
			div.onclick=_this.onCusEdit;
			_this.inEdit=false;
			//_this.close();
		}
		dform.onMoreData=function(){
			_this.winTitle.style.display="";
			_this.winTitle.style.opacity=1;
			_this.winTitle.textContent= dform.dataInfo.name + "信息编辑";
			dflow.hide();
			dform.showFullScreen();
		}
		dform.onDataDelete=function(){
			var data=dform.data;
			var dataname=this.dataInfo.id;
			console.log("delete");
			dataService.deleteData(dataname,data,function(rtn){
				dform.domNode.hide();
				_this.close();
				dflow.destroy();
				window.setTimeout(function(){dform.domNode.destroy();},100);
			});
		}
	}
	this.cancelEdit=function(){
		_this.inEdit=false;
		var div=_this.domNode;
		div.clear();
		div.loadData();
		setStyleData(div,div.oldStyle);
		
		
		_this.domNode.onclick=null;
		window.setTimeout(function(){
			_this.load(_this.dataInfo);
			_this.show();
		},100);
	}
	this.onButtonClick=function(node){
		_this.dataFlow.curnode=node;
		_this.isDestroy=true;
		if (_this.dataInfo.id=="Customer")
			node.defaultData={"customer":_this.customer.name};
		else
			node.defaultData={"supplier":_this.supplier.name};
		dui.onDataEvent(_this,node,node.dataInfo.id);

	}
	this.onNodeClick=function(node){
		
		dflow.curnode=node;
		_this.isDestroy=true;
		
		if (_this.dataInfo.id=="Customer")
			node.defaultData={"customer":_this.customer.name};
		else
			node.defaultData={"supplier":_this.supplier.name};
			
		dui.onDataEvent(_this,node,node.dataInfo.id);

	}
	this.onDataChanged=function(dataname,oldData,newData){
		
		var addmoney=parseFloat(newData.money);
		if (oldData){
			if (oldData.money) addmoney=newData.money-oldData.money;
		}
		
		if (dataname==dflow.dataInfo.data1.id) addmoney=-addmoney;
		if (dflow.dataInfo.id=="Payable" || dflow.dataInfo.id=="Supplier") addmoney=-addmoney;
		
		var oldm = parseFloat(this.customer.money);
		var newm=oldm+addmoney;
		
		var cnode=dflow.curnode.domNode;
		
		var diva=dui.getDataDom("div","addmoney","", parseInt(cnode.style.left)+100,parseInt(cnode.style.top)+45,100,30,1);
		diva.textContent=addmoney;
		if (addmoney>0) diva.textContent="+"+addmoney;
		diva.setMovie(true);
		diva.style.color="rgba(255,100,150,0.9)";
		window.setTimeout(function(){
			diva.style.left= parseInt(dflow.dataNode.domNode.style.left)+parseInt(dflow.dataNode.domNode.style.width)-30+"px";
			diva.style.top= parseInt(dflow.dataNode.domNode.style.top)+10+"px";
		},1);
		
		window.setTimeout(function(){
			diva.style.opacity=0;
			_this.customer.money=newm;
			_this.curnode.data=_this.customer;
			_this.curnode.loadData();
			//dflow.dataNode.setValue(newm);
		},500);
		window.setTimeout(function(){
			
			diva.destroy();
		},1000);
	}
	this.show=function(){
		this.visible=true;
		_this.winTitle.btnLeft.style.opacity=1;
		_this.winTitle.btnLeft.style.display="";
		_this.winTitle.style.opacity=0;
		_this.winTitle.divBack.style.opacity=0;
		_this.domNode.style.opacity=1;
		window.setTimeout(function(){
			dflow.show();
		},400);
	}
	this.destroy=function(){
		if (dflow) dflow.destroy();
		if (dform) dform.destroy();
		this.isDestory=true;
	}
	this.hide=function(){
		this.visible=false;
		dflow.hide();
		_this.domNode.hide();
	}
	function ontouch(ev){
		
		if (_this.inEdit==true) return;
		var data=ev.dataTouch;
		var obj=ev.srcElement;
		var doc=document.documentElement;
		var dwidth= doc.clientWidth ;//window.screen.width;
		var dheight=doc.clientHeight ;//window.screen.height;
		if (data.d>12){
			dflow.scroll(data.y2-data.y21);
		}
	}
	function ontouchend(ev){
		if (_this.inEdit) return;
		
		var data=ev.dataTouch;
		var obj=ev.srcElement;
		var doc=document.documentElement;
		var dwidth= doc.clientWidth ;//window.screen.width;
		var dheight=doc.clientHeight ;
		if (dflow.top>160){
			_this.close();
		}else if (dflow.top>80){
			if (_this.inEdit==true) return;
			dflow.scroll(80-dflow.top);
		}

		return;
	}
	this.events.ontouchmove=ontouch;
	this.events.ontouchend=ontouchend;
}
WinCusFlow.prototype = new DWindow();
WinCusFlow.prototype.constructor = WinCusFlow;