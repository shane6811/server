function WinList(id,title){
	
	DWindow.apply(this, arguments);
	var _this=this;
	var dlist;
	var dform;
	this.init=function(node){
		this.events.init();
		this.curnode=node;
		this.domNode=node;
		this.children=[];
		

	};
	this.initEvents=function(){
		this.events.ontouchmove=ontouch;
		this.events.ontouchend=ontouchend;	
		_this.winTitle.btnRight.onclick=this.newData;
		_this.winTitle.btnLeft.style.display="";
		_this.winTitle.btnLeft.style.opacity=1;
		
		dlist.onDataClick=_this.onItemClick;
		dlist.onButtonClick=_this.addByPhone;
	};
	this.load=function(dataInfo){
		var div=this.domNode;
		this.isDestroy=false;
		
		this.dataInfo=dataInfo;

		dlist=new DataList();
		dlist.init(document.body);
		dlist.width=this.width;
		dlist.load(dataInfo);

		_this.winTitle.textContent=_this.dataInfo.name;

		var btnBack=$("#btnLeft");// getButton("btnLeft",5,22,70,25,5,1);
		var btnMore=$("#btnRight");// getButton("sys_more",this.width-100,22,70,25,5,1);
		var winTitle=$("#winTitle");

		btnMore.text("新增");
		
		btnBack.hide();
		btnMore.hide();

		this.btnBack=btnBack[0];
		this.btnMore=btnMore[0];
		
		var btnAdd1=dui.getDataDom("div",id+"_add1","listbutton",20,75,this.width-40,35,5,0);
		var btnAdd2=dui.getDataDom("div",id+"_add2","listbutton",20,110,this.width-40,35,5,0);
		btnAdd1.textContent="从手机导入"+_this.dataInfo.name;
		btnAdd2.textContent="通过微信添加"+_this.dataInfo.name;

		_this.btnAdd1=btnAdd1;
		btnAdd2.style.display="none";
		dlist.addButton(btnAdd1);

		dataService.getDataList(dataInfo.id,"",0,30,function(rtn){
			var arr=rtn.value;
			dlist.top=70;
			if (this.isDestroy){
				this.hide();
				dlist.destroy();
				return;
			}
			dlist.listCount=rtn.count;
			dlist.loadData(arr);
			if (this.visible){
				_this.winTitle.btnLeft.style.display="";
				_this.winTitle.btnRight.style.display="";
				dlist.onDataClick=_this.onItemClick;
				dlist.show();
			}
		})
		dlist.onLoadMoreData=_this.loadMoreData;
	};
	this.loadMoreData=function(dataid,from,to,callback){
		dataService.getDataList(dataid,"",from,to,function(rtn){
			var arr=rtn.value;
			dlist.loadMoreData(arr);
		});
	};
	this.addDataList=function(list,callback){
		
		dataService.saveDataList(_this.dataInfo.id,list,0,0,function(rtn){
			if (callback){
				callback(rtn);
			}
		});
	};
	this.addByPhone=function(div){
		_this.hide();
		
		var wsel=dui.openWindow(WinSelect,data_PhoneContact,div,"hide");

		wsel.onDataSelect=function(arr){
			var cus=[];
			for(var i=0;i<arr.length;i++){
				var d=arr[i];
				var c={};
				c.id=guid();
				c.name=d.name;
				c.phone=d.phone;
				cus.push(c);
			}
			_this.addDataList(cus,function(){
				dui.goBack();
				_this.load(_this.dataInfo);
				_this.show();
			});

		};

	};
	this.onItemClick=function(div){
		
		for(var i=0;i<_this.children.length;i++){
			var cd=_this.children[i];
			cd.style.top=parseInt(cd.style.top)-_this.height+"px";
		}
		dlist.showNode(div,16);
		div.dataInfo=_this.dataInfo;
		dui.onDataEvent(_this,div,_this.dataInfo.id);
		_this.isDestroy=true;
		//dui.openWindow(WinCusFlow,_this.dataInfo,div,"extend");
		/*
		if (_this.onNewWindow){
			_this.onNewWindow(div);
		}*/
	};
	this.getForm=function(dataInfo,div){
		dform=new DataForm();
		dform.init(div);
		var dataInfo=_this.dataInfo;

		dform.width=dlist.width-20;
		dform.load(dataInfo);
		//if (data) dform.setData(data);
		dform.datatype=dataInfo.id;
		dform.dataInfo=dataInfo;
		return dform;
	};
	this.onDataEdit=function(div){
		//div.innerHTML="";
		var dfrom=_this.getForm(this.dataInfo,div);
		dfrom.divTitle.textContent="编辑"+_this.dataInfo.name;
		dfrom.setData(div.data);
		dfrom.show();
		dlist.show();
		
		dform.onClose=function(){
			dlist.setItemData(div,div.data);
		};
		dform.onSaveClick=function(){
			var data=dform.getData();
			
			dataService.saveData(_this.dataInfo.id,data,function(rtn){
				dlist.setItemData(div,data);
			});
		};
	};
	this.newData=function(){
		
		var div=dlist.insertItem(140);
		div.style.opacity=1;
		div.style.overflow="hidden";
		var dfrom=_this.getForm(_this.dataInfo,div);
		dfrom.divTitle.textContent="新增"+_this.dataInfo.name;
		dform.show();
		dlist.show();
		div.onclick=null;
		dform.onClose=function(){
			dlist.removeItem(div);
		};
		dform.onSaveClick=_this.saveData;
		
	};
	this.saveData=function(){
		var data=dform.getData();
		
		dataService.saveData(_this.dataInfo.id,data,function(rtn){
			dform.setData(null);
			dlist.removeItem(dlist.divNew);
			dlist.insertData(data);
		});
		
	};
	this.setItemData=function(div,data){
		dlist.setItemData(div,data);
	};
	this.move=function(left,top){
		dlist.move(left,top);
	};
	this.show=function(){
		this.visible=true;
		_this.winTitle.textContent=_this.dataInfo.name;
		_this.winTitle.style.display="";
		_this.winTitle.style.opacity=1;
		this.domNode.style.opacity=1;
		for(var i=0;i<this.children.length;i++){
			var cd=this.children[i];
			if (cd.style.display="none") cd.style.display="";
			cd.style.opacity=1;
		}
		this.btnBack.style.opacity=1;
		this.btnMore.style.opacity=1;
		_this.winTitle.textContent=_this.dataInfo.name;
		_this.winTitle.btnRight.textContent="新增";
		_this.winTitle.btnRight.style.display="";
		_this.winTitle.style.opacity=1;
		_this.winTitle.divBack.style.opacity=1;
		dlist.show();
		
		this.initEvents();
	};
	this.hide=function(){
		this.visible=false;
		this.domNode.style.opacity=1;
		for(var i=0;i<this.children.length;i++){
			var cd=this.children[i];
			cd.style.opacity=0;
		}
		dlist.hide();
		window.setTimeout(function(){
			for(var i=0;i<_this.children.length;i++){
				var cd=_this.children[i];
				cd.style.display="none";
			}
		},500);
	};

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
		if (data.d<12) return;
		var obj=ev.srcElement;
		var doc=document.documentElement;
		var dwidth= doc.clientWidth ;//window.screen.width;
		var dheight=doc.clientHeight ;
		if (dlist.top>150){
			_this.close();
		}else if (dlist.top>60){
			dlist.move(0,60-dlist.top);
		}

		return;
	}
	
	this.events.ontouchmove=ontouch;
	this.events.ontouchend=ontouchend;
	
}
WinList.prototype = new DWindow();
WinList.prototype.constructor = WinList;