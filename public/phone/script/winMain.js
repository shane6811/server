function WinMain(id,title){
	
	DWindow.apply(this, arguments);
	var _this=this;
	this.firstShow=true;
	var mNode;
	var panel;
	var curnode;
	var mwidth;
	var nwidth;
	
	this.load=function(dataInfo){
	
		this.isDestroy=false;
		this.dataInfo=dataInfo;
		this.width=document.documentElement.clientWidth;
		this.height=document.documentElement.clientHeight;
		this.X0=this.width/2;
		this.Y0=this.height/2;
		mwidth=this.width/3;
		nwidth=this.width/5;

		if (this.children.length==0){
		
			mNode=new DataIcon("dmain","资产总额",0);
			mNode.moveTo(this.X0 - mwidth/2 ,this.Y0- mwidth/2);
			mNode.size(mwidth,mwidth);
			mNode.domNode.style.zIndex=100;
			this.mainNode=mNode;
			var datas=dataInfo.icons;
			panel=new RoutePanel();
			
			for (var i=0;i<datas.length;i++){
				var data=datas[i];
				var node=new DataIcon(data.id,data.name,data.money);
				node.domNode.style.zIndex=102;
				node.domNode.style.opacity=0;
				node.data=data;
				panel.nodes.push(node);
			}
	
			curnode=panel.nodes[1];
			
			this.children.push(mNode);
			for(var i=0;i<panel.nodes.length;i++){
				var node=panel.nodes[i];
				if (node.newDom){
					node.moveTo(this.X0 - nwidth/2,this.Y0 - nwidth/2);
					node.size(nwidth,nwidth);
					node.domNode.style.opacity=0;
					node.angle=i*Math.PI/2;
				}else{
					node.domNode.style.opacity=1;
				}
				
				node.onclick=nodeclick;
				//this.children.push(panel.nodes[i]);
			}
			this.routePanel=panel;
			
			
			var bwidth=this.width/3-10;
			var dx=this.width/4;
			var dy=this.height/3;
			
			var msg=new DataIcon("usermsg","消息",1);
			msg.moveTo(this.width-80,80);
			msg.dataInfo=data_Scheme["Message"];
			msg.size(60,60);
			
			msg.onclick=function(){
				_this.isDestroy=true;
				dui.onDataEvent(_this,msg,msg.dataInfo.id);
				//dui.openWindow(WinMsg,data_Scheme["Message"],msg);
			};
			this.nodeMessage=msg;
			this.children.push(msg);
			
			var btn1=dui.getDataDom("div",this.id+"_btn_c","dnode",this.width/2-30-bwidth,this.height-100,bwidth,35,5,0);
		
			btn1.setText("供应商");
			btn1.datatype="Supplier";
			btn1.dataInfo=data_Scheme["Supplier"];
			var btn2=dui.getDataDom("div",this.id+"_btn_p","dnode",this.width/2+30,this.height-100,bwidth,35,5,0);
			btn2.setText("客户");
			btn2.datatype="Customer";
			btn2.dataInfo=data_Scheme["Customer"];
			this.children.push(btn1);
			this.children.push(btn2);
			
			/*
			var btn3=getButton(this.id+"_btn_s",this.width/2-dx-bwidth-10,this.height/2-dy,bwidth,25,5,0);
			btn3.textContent="商品";
			btn3.datatype="Stock";
			var btn4=getButton(this.id+"_btn_m",this.width/2+dx,this.height/2-dy,bwidth,25,5,0);
			btn4.textContent="资金账号";
			btn4.datatype="CapitalAccount";
			*/
			this.buttons=[];
			this.buttons.push(btn1);
			this.buttons.push(btn2);
			//this.buttons.push(btn3);
			//this.buttons.push(btn4);
			
			this.children.push(panel);
		}
		dataService.getDataList("Message","",0,100,function(rtn){
			var arr=rtn.value;
			var c=0;
			for(var i=0;i<arr.length;i++){
				if (!arr[i].read){
					c++;
				}
			}
			_this.nodeMessage.setValue(c);
		});
		
		dataService.getUserData(function(rtn){
			var obj=rtn.value;
			if (!obj["现金"]) obj["现金"]=0;
			if (!obj["存货"]) obj["存货"]=0;
			if (!obj["应收"]) obj["应收"]=0;
			if (!obj["应付"]) obj["应付"]=0;
			obj["现金"]=parseFloat(obj["现金"]);
			obj["存货"]=parseFloat(obj["存货"]);
			obj["应收"]=parseFloat(obj["应收"]);
			obj["应付"]=parseFloat(obj["应付"]);
			
			obj["资金"]=obj["现金"]+obj["存货"]+obj["应收"]-obj["应付"];
			
			_this.loadData(obj);

		});
		
	};
	this.loadData=function(data){
		this.mainNode.setValue(data["资金"]);
		var panel=this.routePanel;
		for(var i=0;i<panel.nodes.length;i++){
			var node=panel.nodes[i];
			node.setValue(data[node.title]);
			//this.children.push(panel.nodes[i]);
		}
	}
	this.onButtonClick=function(){
		var button=this;
		var datatype=button.datatype;
		var data=data_Scheme[datatype];
		//_this.move(0,-1000);
		
		window.setTimeout(function(){
			_this.isDestroy=true;
			dui.onDataEvent(_this,button,data.id,"onclick");
			//dui.openWindow(WinList,data,button);
		},400);
		
	};
	this.hide=function(){
		for(var i=0;i<_this.children.length;i++){
			var child=_this.children[i];
			child.hide();
		}
		for(var i=0;i<_this.buttons.length;i++){
			var btn=_this.buttons[i];
			btn.style.opacity=0;
		}
		window.setTimeout(function(){
			
			for(var i=0;i<_this.buttons.length;i++){
				var btn=_this.buttons[i];
				btn.style.display="none";
			}
			
		},500);
	};
	this.show=function(option){
		
		var winTitle=_this.winTitle;
		winTitle.style.display="";
		winTitle.btnLeft.style.display="none";
		winTitle.textContent="微数据大视野";
		winTitle.show();
		winTitle.btnRight.textContent=loginUserName;
		winTitle.btnRight.style.display="";
		winTitle.btnRight.style.opacity=1;
		this.nodeMessage.show();
		mNode.show();
		if (option=="flow"){
			for(var i=0;i<this.children.length;i++){
				var child=this.children[i];
				child.show();
				if (child.setMovie) {
					child.setMovie(true);
				}
			}
			this.move(0,-this.hideTop);
			for(var i=0;i<_this.buttons.length;i++){
				_this.buttons[i].move(0,-3000);
			}
			for(var i=0;i<_this.children.length;i++){
				var child=_this.children[i];
				child.show();
			}
		}else if (!option){
			window.setTimeout(function(){
				for(var i=0;i<_this.buttons.length;i++){
					var btn=_this.buttons[i];
					btn.style.top=_this.height-100+"px";
				}
				mNode.moveTo(_this.X0-mNode.width/2,_this.Y0-mNode.height/2);
				
				panel.layer(_this.X0,_this.Y0, _this.X0*2/3);
				panel.show();
			},100);
		}
		
		for(var i=0;i<_this.buttons.length;i++){
			var btn=_this.buttons[i];
			btn.style.display="";
		
			btn.style.opacity=1;
		}
		
		this.active();
	};
	this.initEvents=function(){
		this.events.ontouchmove=ontouch;
		this.events.ontouchend=ontouchend;
		for(var i=0;i<panel.nodes.length;i++){
			var node=panel.nodes[i];
			node.onclick=nodeclick;
		}
		for(var i=0;i<_this.buttons.length;i++){
			var btn=_this.buttons[i];
			btn.onclick=this.onButtonClick;
		}
		this.winTitle.btnRight.onclick=_this.showSetting;
	};
	this.showSetting=function(){
		
		//_this.move(-1000,0);
		
		window.setTimeout(function(){
			dui.openWindow(WinSetting,{id:"setting",title:"个人设置"},_this.winTitle.btnRight,"left");
		},300);

	};
	this.route=function(c){
		var id=0;
		for(var i=0;i<panel.nodes.length;i++){
			var node=panel.nodes[i];
			if (node==curnode) {
				id=i;
				break;
			} 
		}
		var nid=id+c;
		if (nid>3) nid=nid-4;
		if (nid<0) nid=nid+4;
		curnode=panel.nodes[nid];
		this.curnode=curnode;
		this.curnode.show();
		
		panel.route(-c*Math.PI/2);
		return curnode;
	};
	this.routeNow=function(data){
		panel.routeNow(data.angle);
	};
	this.routeEnd=function(data){
	
		var j= Math.round (data.angle * 2 / Math.PI  );
		
		for(var i=0;i<panel.nodes.length;i++){
			var node= panel.nodes[i];
			node.angle+=data.angle;
			if (node.angle>0.8 && node.angle<2.3){
				curnode=node;
			}
		}
		
		var ang= Math.PI/2 - curnode.angle ;
		
		panel.route(ang);
		
		for(var i=0;i<panel.nodes.length;i++){
			var node= panel.nodes[i];
			
			if (node.angleTo>0.8 && node.angleTo<2.3){
				curnode=node;
				
			}
		}
		_this.curnode=curnode;
		return curnode;
	}
	function nodeclick(node){
		
		if (node==curnode){
			showNode();
		}else{
			
			var ang=curnode.angle-node.angle;
			panel.route(ang);
			//curnode.onclick=nodeclick
			curnode=node;
			//curnode.onclick=showNode;
			//console.log("\r\n"+node.title);
			window.setTimeout(showNode,1200);
		}
	};
	function showNode(){
		$("#header").show();
		var title=curnode.title;
		var id="id_"+title;
		var h=$("#header")[0].clientHeight;
		var y=16-curnode.domNode.top;//-curnode.domNode.height/2;
		_this.curnode=curnode;

		_this.move(0,y);
		_this.hideTop=y;
		_this.isDestroy=true;
		dui.onDataEvent(_this,curnode,curnode.data.id,"onclick");
		_this.isDestroy=true;
		//dui.openWindow(WinFlow,curnode.data,curnode,"hide");
		for(var i=0;i<_this.buttons.length;i++){
			_this.buttons[i].move(0,3000);
		}
	};
	function ontouch(ev){
		var data=ev.dataTouch;
		var obj=ev.srcElement;
		var doc=document.documentElement;
		var dwidth= doc.clientWidth ;//window.screen.width;
		var dheight=doc.clientHeight ;//window.screen.height;
		
		if (obj==mNode.domNode || obj.parentNode==mNode.domNode || obj==curnode.domNode || obj.parentNode==curnode.domNode){
			panel.setAnimation(false);
			//panel.move(0,data.y2-data.y21);
			mNode.setAnimation(false);
			//mNode.move(0,data.y2-data.y21);
			_this.move(0,data.y2-data.y21);
			console.log("winmain ontouch y"+ data.d);
			//if (dflow) dflow.move(0,data.y2-data.y21);
		}else{
			panel.routeNow(data.angle);
			
		}
		$("#title").text(obj.tagName);
	}
	function ontouchend(ev){
		
		var data=ev.dataTouch;
		if (data.d<12) return;
		var obj=ev.srcElement;
		if (obj==mNode.domNode || obj.parentNode==mNode.domNode || obj==curnode.domNode || obj.parentNode==curnode.domNode){
			if ((data.y2-data.y1)<-100){
				//showNode();
			}else if ((data.y2-data.y1)>100){
				//backmain();
				//panel.route(0);
			}else{
				_this.move(0,data.y1-data.y2);
			}
		}else{
			_this.routeEnd(data);
		}
		
	}

}
WinMain.prototype = new DWindow();
WinMain.prototype.constructor = WinMain;