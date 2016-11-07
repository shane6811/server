function WinMsg(id,title){
	
	DWindow.apply(this, arguments);
	var _this=this;
	var dlist;
	var dform;
	this.init=function(node){
		this.events.init();
		this.curnode=node;
		this.domNode=node;
		this.children=[];
		dlist=new DataList();

	}
	this.initEvents=function(){
		this.events.ontouchmove=ontouch;
		this.events.ontouchend=ontouchend;	
		_this.winTitle.btnRight.onclick=this.newData;
	}
	this.load=function(dataInfo){
		var div=this.domNode;
		
		this.dataInfo=dataInfo;

		dlist.init(document.body);
		dlist.load(dataInfo);

		var btnBack=$("#btnLeft");// getButton("btnLeft",5,22,70,25,5,1);
		var btnMore=$("#btnRight");// getButton("sys_more",this.width-100,22,70,25,5,1);
		var winTitle=$("#winTitle");
		btnMore.hide();
		winTitle.text("消息");
		btnBack.show();

		this.btnBack=btnBack[0];
		dlist.width=this.width-20;
		
		dataService.getDataList(dataInfo.id,"",0,30,function(rtn){
			var arr=rtn.value;
			arr.push({id:2,fromuser:{photo:"icon.png",username:"微数据"},message:"欢迎使用【微数据】",date:"09:00"});
			dlist.top=70;
			dlist.listCount=rtn.count;
			dlist.loadData(arr);
			dlist.onDataClick=_this.onItemClick;
			dlist.show();
		})
		dlist.onLoadMoreData=_this.loadMoreData;
	}
	this.loadMoreData=function(dataid,from,to,callback){
		dataService.getDataList(dataid,"",from,to,function(rtn){
			var arr=rtn.value;
			dlist.loadMoreData(arr);
		});
	};
	this.addDataList=function(list,callback){
		
		dataService.saveDataList(_this.dataInfo.id,list,0,0,function(rtn){
			//alert(rtn.count);
			if (callback){
				callback(rtn);
			}
		});
	}


	this.saveMessage=function(message){
		dataService.saveData("Message",message,function(rtn){
		});
	};
	this.getForm=function(div){
		var divPanel=dui.getDataDom("div","div_sharedata","",50,135,this.width-80,0,0);
		_this.winPanel=divPanel;
		divPanel.clear();
		divPanel.style.backgroundColor="rgba(250,250,250,0.3)";
		divPanel.style.overflow="hidden";
		divPanel.setMovie(false);
		dform=new DataForm();
		dform.init(divPanel);
		dform.left=50;
		dform.top=0;
		dform.width=this.width-80;
		dform.height=285;
		_this.children.push(dform);
		return dform;
	}
	this.onItemClick=function(div){
		_this.itemdata=div.data;
		if (!_this.itemdata.read) {
			_this.itemdata.read=1;
			_this.saveMessage(_this.itemdata);
		}
		if (!div.data.data) return;
		dform = _this.getForm(div);
		
		var dataInfo=data_Scheme[div.data.shareDatatype];

		dform.load(dataInfo);
		dform.setData(div.data.data);
		
		dform.onClose=_this.cancel;
		dform.onSaveClick=_this.saveData;
		dform.onSignData=_this.ok;
		dform.onUnSignData=_this.unSignData;
		
		window.setTimeout(function(){
			dform.domNode.setMovie(true);
			dform.domNode.show();
			dform.show();
		},300);
		
		
		var top=parseInt(div.style.top);
		for(var i=0;i<dlist.children.length;i++){
			var cd=dlist.children[i];
			var ctop=parseInt(cd.style.top);
			if (ctop<top+30){
				ctop=ctop-top+70;
				cd.style.top=ctop+"px";
				if (ctop<70){
					cd.style.opacity=0;
				}
			}else{
				ctop=ctop-top+80+dform.height;
				cd.style.top=ctop+"px";
			}
			
		}
		
	};
	this.saveData=function(){
		var dataname=_this.itemdata.shareDatatype;
		var data=this.getData();
		dataService.saveData(dataname,data,function(rtn){
			
		});
	};
	this.ok=function(){
		var data=dform.data;
		var sid=_this.itemdata.shareid;
		var dataname=dform.data.type;
		
		var fromuser=_this.itemdata.fromuser;
		var name=fromuser.name;
		var phone=fromuser.phone;
		var photo=fromuser.photo;
		
		var udname="Customer";
		if (data.customer) udname="Customer";
		if (data.supplier) udname="Supplier";
		dataService.getDataList(udname,{$or:[{name:name},{name:phone},{phone:phone}]},0,0,function(rtn){
			if (rtn.value){
				var arr=rtn.value;
				if (arr.length>0){
					var user=arr[0];
					if (user.name==name && user.phone==phone) return; 
					user.name=name;
					user.phone=phone;
					user.photo=photo;
				}else{
					var user={name:name,phone:phone,photo:photo,money:0};
					user.type=udname;
					user.id=guid();
				}
				dataService.saveData(udname,user,function(rtn2){
				});
			}
		});

		shareService.signData(sid,dataname,data,function(rtn){
			_this.itemdata.sign=1;
			_this.saveMessage(_this.itemdata);
			$.alert("签字成功");
		});
	};
	this.cancel=function(){
		dform.domNode.style.height="0px";
		dform.hide();
		dlist.show();
		dform.domNode.hide();
		window.setTimeout(function(){
			
			dform.domNode.destroy();
		},500);

	};
	this.unSignData=function(){
		var sid=_this.itemdata.shareDataid;
		var dataname=_this.itemdata.shareDatatype;
		shareService.unSignData("",dataname,sid,false,"拒绝签字",function(rtn){
			$.alert("您已成功拒签");
		});
	}
	this.show=function(){
		
		for(var i=0;i<this.children.length;i++){
			var cd=this.children[i];
			if (cd.style.display="none") cd.style.display="";
			cd.style.opacity=1;
		}
		this.btnBack.style.opacity=1;
	
		_this.winTitle.textContent=_this.dataInfo.name;
		_this.winTitle.btnRight.textContent="新增";
		_this.winTitle.style.opacity=1;
		_this.winTitle.divBack.style.opacity=1;
		dlist.show();
		
		this.initEvents();
	};
	this.hide=function(){
		_this.domNode.style.opacity=1;
		for(var i=0;i<this.children.length;i++){
			var cd=this.children[i];
			cd.style.opacity=0;
		}
		if (_this.winPanel)
			_this.winPanel.style.opacity=0;
		dlist.hide();
		window.setTimeout(function(){
			if (_this.winPanel) 
				_this.winPanel.offsetParent.removeChild(_this.winPanel);
			for(var i=0;i<_this.children.length;i++){
				var cd=_this.children[i];
				cd.style.display="none";
			}
		},500);
		if(dform) dform.hide();
	};
	this.destroy=function(){
		this.isDestroy=true;
		if(dlist) dlist.destroy();
		if(dform) {
			dform.domNode.destroy();
		}
	}
	function ontouch(ev){
		
		var data=ev.dataTouch;
		var obj=ev.srcElement;
		var doc=document.documentElement;
		var dwidth= doc.clientWidth ;//window.screen.width;
		var dheight=doc.clientHeight ;//window.screen.height;
		if (data.d>12){
			dlist.move(0,data.y2-data.y21);
		}
		
		//dflow.move(data.x2-data.x21,data.y2-data.y21)
	}
	function ontouchend(ev){
		var data=ev.dataTouch;
		var obj=ev.srcElement;
		var doc=document.documentElement;
		var dwidth= doc.clientWidth ;//window.screen.width;
		var dheight=doc.clientHeight ;
		if (dlist.top>120){
			_this.onback();
		}else if (dlist.top>40){
			dlist.move(0,40-dlist.top);
		}

		return;
	}
	this.move=function(left,top){
		dlist.move(left,top);
		if (dform) 
			dform.domNode.move(left,top);
	};
	this.events.ontouchmove=ontouch;
	this.events.ontouchend=ontouchend;
	
}
WinMsg.prototype = new DWindow();
WinMsg.prototype.constructor = WinMsg;