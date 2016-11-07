function WinFlow(id,title){
	
	DWindow.apply(this, arguments);
	var _this=this;
	var dflow;
	this.init=function(node){
		this.events.init();
		this.curnode=node;
		node.onclick=this.editNode;
		
	}
	this.editNode=function(){
		var div=this.domNode;
		div.oldStyle=getStyleData(div);
		var dataname=_this.curnode.title;
		
		var obj={};
		obj.id="edit";
		obj.title=_this.curnode.title;
		obj.dataInfo={name:dataname,datatype:"number",value:_this.curnode.value};
		dflow.move(0,100);
		div.style.top="65px";
		_this.curnode.onclick=null;
		var winput=dui.input(obj,div,function(rtn){
			if (rtn.ok){
				dataService.saveDataValue("资金",rtn.dataname,rtn.value,function(){
					_this.curnode.setValue(rtn.value);
					closeInput();
				});
			}else{
				closeInput();
			}
		})

		function closeInput(){
			document.documentElement.scrollTop=0;
			document.body.scrollTop=0;
			for(var i=0;i<div.children.length;i++){
				div.children[i].style.opacity=1;
			}
			
			dflow.move(0,-100);
			setStyleData(div,div.oldStyle);
			div.className="cnode";
			
			window.setTimeout(function(){
				winput.remove();
				div.show();
				_this.curnode.onclick=_this.editNode;
			},200);
			
		}
	}
	this.changeView=function(){
		var dataInfo=_this.dataInfo;
		dflow.isLoading=true;
		dflow.top=dflow.baseTop;
		
		var dt=new Date();
		dt.setDate(dt.getDate()+10);
		var toDate=dt.Format("yyyy-MM-dd");
		dflow.toDate=toDate;
	
		if (dflow.viewid<2){
			_this.winTitle.btnRight.textContent="明细";
			dflow.viewid=2;
		
			_this.loadTotalData(function(){
				dflow.show();
			});
		}else{
			_this.winTitle.btnRight.textContent="汇总";
			dflow.viewid=0;
			_this.loadDetailData(function(){
				dflow.show();
			});
		}
	}
	this.load=function(dataInfo){
		this.isDestroy=false;
		this.dataInfo=dataInfo;
		
		this.winTitle.hide();
		this.winTitle.btnRight.textContent="汇总";
		this.winTitle.btnRight.show();
		this.winTitle.btnRight.onclick=this.changeView;
		var childs=[];
		var reload=true;
		if (!dflow) {
			dflow=new DataFlow();
			dflow.viewid=0;

		}else{
	
		}
		dflow.left=0;
		dflow.baseTop=parseInt (this.curnode.domNode.style.top)+ parseInt( this.curnode.domNode.style.height);
		dflow.top=dflow.baseTop;
	
		dflow.init(this.curnode);
		
		dflow.load(dataInfo);
		this.curnode.show();
		dflow.onNodeClick=_this.onNodeClick;
		dflow.onButtonClick=_this.onNodeClick;
		dflow.onLoadMore=_this.loadMore;
		dflow.onLoadTotal=function(){
			_this.winTitle.btnRight.textContent="明细";
			_this.loadTotalData(function(){dflow.scroll(0);});
		}
	
		this.dataFlow=dflow;
		this.children.push(dflow);

		dataInfo.isTotal=true;
		dflow.onLoadData= function(){
			_this.loadDetailData(function(){
				_this.winTitle.btnRight.textContent="汇总";
				dflow.show();
			});
		}
		var dt=new Date();
		dt.setDate(dt.getDate()+10);
		var toDate=dt.Format("yyyy-MM-dd");
		dflow.toDate=toDate;
		if (dflow.viewid<2){
			this.loadDetailData(function(){
				if (_this.isDestroy){
					_this.hide();
					dflow.destroy();
					return;
				}
				if (_this.visible){
					window.setTimeout(function(){
						dflow.show();
					},500);
				}
			});
		}else{
			this.loadTotalData(function(){
				dflow.show();
			});
		}
		/*
		dataService.getDataFlow(dataInfo,where,function(rtn){
			
			
			dflow.loadData(rtn,reload);
			if (_this.visible){
				var ts=500;
				if (reload) ts=0;
				window.setTimeout(function(){
					
					if (this.isDestroy){
						this.hide();
						dflow.destroy();
						return;
					}
					_this.winTitle.btnLeft.style.display="";
					
					dflow.show();
					
					for(var k=childs.length-1;k>=0;k--){
						
						if (!childs[k]) continue;
						var parent=childs[k];
						for(var j=parent.children.length-1;j>=0;j--){
							var ocd=parent.children[j];
							if (!ocd) continue;
							
							if ((ocd.domNode && ocd.domNode.panel==parent) || ocd.panel==parent){
								ocd.hide();
								ocd.destroy();
							}
							
						}
						
					}
					
				},ts);
			}
		})
		*/
	}
	this.loadDetailData=function(callback){
		
		
		dflow.isLoading=true;
		var dt=new Date(dflow.toDate);
		dt.setDate(dt.getDate()-20);
		dflow.fromDate=new Date(dt.getFullYear(),dt.getMonth(),1).Format("yyyy-MM-dd");
		
		var where={datetime:{$gte:dflow.fromDate,$lte:dflow.toDate}};
		var dataInfo=_this.dataInfo;
		dataService.getDataFlow(dataInfo,where,function(rtn){
			dflow.loadData(rtn,true);
			dflow.isLoading=false;
			if (callback) callback();
		});
	}
	this.loadTotalData=function(callback){
		var dataInfo=_this.dataInfo;
		dflow.isLoading=true;
		dataService.getDataFlowTotal(dataInfo,{},function(rtn){
			
			dflow.loadData(rtn,true);
			dflow.isLoading=false;
			if (callback) callback();
			
			
		})
	}
	this.loadMore=function(){
		var dataInfo=_this.dataInfo;
		
		if (dflow.loadAllData) return;
		var toDate=dflow.fromDate;
		dflow.isLoading=true;
		var dt=new Date(dflow.fromDate);
		dt.setDate(dt.getDate()-20);
		
		dflow.fromDate=new Date(dt.getFullYear(),dt.getMonth(),1).Format("yyyy-MM-dd");
		var obj={};
		obj["$gte"]=dflow.fromDate;
		obj["$lte"]=toDate;
		var where={datetime:obj};
		dataInfo.isTotal=true;
		dataService.getDataFlow(dataInfo,where,function(rtn){
			
			if (rtn.length>0){
				dflow.appendData(rtn);
			}else{
				dflow.minDate=dflow.fromDate;
				dflow.loadAllData=true;
			}
			dflow.isLoading=false;
		})
	}

	this.onNodeClick=function(node){
		_this.isDestroy=true;
		node.backupData();
		dui.onDataEvent(_this,node,node.dataInfo.id);
		//dui.openWindow(WinData,node.dataInfo,dflow,"size");
	}
	this.show=function(){
		this.visible=true;
		
		_this.winTitle.btnLeft.show();
		_this.winTitle.btnRight.show();
		_this.winTitle.hide();
		
		this.curnode.show();
		
		this.active();
	}
	this.remove=function(){
		dflow.remove();
	}
	this.initEvents=function(){
		this.events.ontouchmove=ontouch;
		this.events.ontouchend=ontouchend;
	}
	this.onRoute=function(data,callback){
		_this.oldnode=_this.curnode;
		var curnode=winMain.routeEnd(data);
		if (_this.oldnode==curnode) {
			callback(false);
			return;
		}else{
			_this.curnode=curnode;
			callback(true);
		}
		window.setTimeout(function(){
			//_this.init(curnode);
			_this.load(curnode.data);
			_this.show();
			
			//dui.onDataEvent(_this,curnode,curnode.data.id,"onclick");
			//dui.openWindow(WinFlow,curnode.data,curnode,"hide");
		},500);
		
	}
	this.onDataChanged=function(dataname,oldData,newData){
		
		var addmoney=parseFloat(newData.money);
		if (oldData){
			if (oldData.money) addmoney=newData.money-oldData.money;
		}
		if (dataname==dflow.dataInfo.data1.id) addmoney=-addmoney;
		if (dflow.dataInfo.id=="Payable") addmoney=-addmoney;
		if (dflow.dataInfo.id=="Stock") addmoney=0;
		if (dflow.dataInfo.id=="Receivable" && !newData.customer ) addmoney=0;
		if (dflow.dataInfo.id=="Payable" && !newData.supplier ) addmoney=0;
		
		if (newData.paid==true) addmoney=0;
		if (addmoney==0) return;
		
		var oldm = parseFloat(dflow.dataNode.value);
		var newm=oldm+addmoney;
		
		var cnode=dflow.curnode.domNode;
		var diva=dui.getDataDom("div","addmoney","", parseInt(cnode.style.left)+100,parseInt(cnode.style.top)+45,100,30,1);
		diva.textContent=addmoney;
		if (addmoney>0) diva.textContent="+"+addmoney;
		diva.setMovie(true);
		diva.style.color="rgba(255,100,150,0.9)";
		window.setTimeout(function(){
			diva.style.left= parseInt(dflow.dataNode.domNode.style.left)+45+"px";
			diva.style.top= parseInt(dflow.dataNode.domNode.style.top)+35+"px";
		},1);
		
		window.setTimeout(function(){
			diva.style.opacity=0;
			dflow.dataNode.setValue(newm);
		},500);
		window.setTimeout(function(){
			
			diva.destroy();
		},1000);
	}
	function ontouch(ev){
		
		var data=ev.dataTouch;
		var obj=ev.srcElement;
		var doc=document.documentElement;
		var dwidth= doc.clientWidth ;//window.screen.width;
		var dheight=doc.clientHeight ;//window.screen.height;
		
		//$("#header").text(parseInt(data.d2)+","+parseInt(data.d1)+","+parseInt(data.ds))
		dflow.setMovie(false);
		if (data.fingers==1){
			if (Math.abs( data.x2-data.x1) > Math.abs(data.y2-data.y1)){
				dflow.move(data.x2-data.x21,0);
				data.angle=((data.x1-data.x2)/dwidth) * 2 ;
				winMain.routeNow(data);
				if (_this.onmove){
				}
			}else{
				dflow.scroll(data.y2-data.y21);
			}
		}else{
			dflow.scale(data.ds);
		}
		//dflow.move(data.x2-data.x21,data.y2-data.y21)
	}
	function ontouchend(ev){
		var data=ev.dataTouch;
		var obj=ev.srcElement;
		var doc=document.documentElement;
		var dwidth= doc.clientWidth ;//window.screen.width;
		var dheight=doc.clientHeight ;
		if (data.fingers==1){
			if (Math.abs( data.x2-data.x1) > Math.abs(data.y2-data.y1)){
				data.angle=((data.x1-data.x2)/dwidth) * 2 ;
				dflow.setMovie(true);
				_this.onRoute(data,function(bchange){
					if (bchange){
						var left=0;
						if (data.x2<data.x1){
							var left=20-document.documentElement.clientWidth/2;
						}else {
							var left=document.documentElement.clientWidth/2-20;
						}
						dflow.move(left-dflow.left);
					}else{
						dflow.move(-dflow.left);
					}
				});

			}else{

				if (dflow.top>0){
					var dt=new Date();
					dt.setDate(dt.getDate()+10);
					var toDate=dt.Format("yyyy-MM-dd");
					if (dflow.toDate<toDate){
						dflow.toDate=toDate;
						dflow.onLoadData();
						dflow.setMovie(true);
						dflow.scroll(dflow.baseTop-dflow.top);
				
					}else{
					
						dflow.setMovie(true);
						dflow.scroll(dflow.baseTop-dflow.top);
					}
					
				}
			}
		}else{
			if (data.ds<=0.7){
				dflow.scaled(data.ds);
			}else if(data.ds>=1.2){
				dflow.scaled(data.ds);
			}else{
				dflow.scale(1);
			}
		}
		return;
	}
	this.destroy=function(){
		dflow.destroy();
	}
	function onscroll(event){
		dflow.scroll(event.value);
		
	}
	this.events.ontouchmove=ontouch;
	this.events.ontouchend=ontouchend;
	this.events.onscroll=onscroll;
}
WinFlow.prototype = new DWindow();
WinFlow.prototype.constructor = WinFlow;