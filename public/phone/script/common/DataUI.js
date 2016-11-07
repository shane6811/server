//DUI

function DWindow(id,title){
	var _this=this;
	this.id=id;
	this.title=title;
	this.children=[];
	
	this.winTitle=$("#winTitle")[0];
	winTitle.btnLeft=$("#btnLeft")[0];
	winTitle.btnRight=$("#btnRight")[0];
	winTitle.divBack=$("#header")[0];
	
	this.events=eventTouch;
	
	this.init=function(){
		this.events.init();
		var doc=document.documentElement;
		this.width= doc.clientWidth ;
		this.height=doc.clientHeight ;
		
	};
	this.init();
	this.load=function(){
		
	};
	this.show=function(){
		for(var i=0;i<this.children.length;i++){
			var child=this.children[i];
			child.show();
		}
	};
	this.hide=function(){
		for(var i=0;i<this.children.length;i++){
			var child=this.children[i];
			child.hide();
		}
	};
	this.move=function(x,y){
		
		var count=_this.children.length;
		//if (x) _this.x0+=x;
		//if (y) _this.y0+=y;
		for(var i=0;i<count;i++){
			var node=_this.children[i];
			node.move(x,y);
		}
	};
	this.remove=function(){
		
	};
	this.active=function(){
		if (this.initEvents){
			this.initEvents();
		}
	};
	this.initEvents=function(){
	
	};
	this.close=function(){
		if (dui.curWindow==this){
			dui.goBack();
		}
	};
	this.destroy=function(){
		this.isDestroy=true;
		var count=this.children.length;
		for(var i=0;i<count;i++){
			var node=this.children[i];
			if (node.destroy)
				node.destroy();
		}
	}
}
function DataIcon(id,title,content){
	var _this=this;
	this.id=id;
	this.title=title;
	this.content=content;
	this.value=content;

	this.setValue=function(value){
		this.value=value;
		this.divContent.textContent=value;
	};
	this.getDomNode=function(){
		var dnode=dui.getDataDom("div",_this.id,"cnode",0,0,1,1,0);
		var dnodeTitle=dui.getDataDom("div",_this.id+"_title","title",0,0,"100%","50%",1);
		var dnodeTitleBottom=dui.getDataDom("div",_this.id+"_title_bottom","titlebottom",0,null,"100%","auto",1);
		var dnodeContent=dui.getDataDom("div",_this.id+"_content","content",0,null,"100%","50%",1);
		
		dnode.id=_this.id;
		dnode.appendChild(dnodeTitle);
		dnode.appendChild(dnodeContent);

		dnodeContent.textContent=_this.content;
		dnodeTitleBottom.textContent=_this.title;
		dnodeTitle.appendChild(dnodeTitleBottom);

		this.divContent=dnodeContent;
		this.newDom=dnode.newDom;
		return dnode;
	};
	this.domNode=this.getDomNode();
	this.style=this.domNode.style;
	this.domNode.onclick=function(){
	
		if (_this.onclick){
	
			_this.onclick(_this);
		}
	};
	this.moveTo=function(left,top){
		var dnode=_this.domNode;
		dnode.style.left=left+"px";
		dnode.style.top=top+"px";
		this.left=left;
		this.top=top;
	};
	this.move=function(x,y){
		var dnode=_this.domNode;
		if (x) dnode.style.left= parseInt(dnode.style.left) + x +"px";
		if (y) dnode.style.top= parseInt(dnode.style.top) + y +"px";
		this.left+=x;
		this.top+=y;
	};
	this.size=function(width,height){
		_this.width=width;
		_this.height=height;
		var dnode=_this.domNode;
		dnode.style.width=width+"px";
		dnode.style.height=height+"px";
	};
	this.show=function(){
		_this.domNode.style.opacity=1;
		_this.domNode.style.display="";
	};
	this.hide=function(){
		_this.domNode.style.opacity=0;
		window.setTimeout(function(){
			_this.domNode.style.display="none";
		},500);
	};
	this.setMovie=function(bani,strtrans){
		if (bani){
			if (!strtrans)
				_this.domNode.style.webkitTransition="all 0.5s ease-in-out";
			else
				_this.domNode.style.webkitTransition=strtrans;
		}else{
			_this.domNode.style.webkitTransition="";
		}
	};
}
function RoutePanel(){
	var _this=this;
	this.nodes=[];
	this.addNode=function(dnode){
		this.nodes.push(dnode);
	};
	this.show=function(){
		var count=_this.nodes.length;
		for(var i=0;i<count;i++){
			var node=_this.nodes[i];
			node.domNode.style.opacity=1;
			node.domNode.style.display="";
		}
	};
	this.hide=function(){
		var count=_this.nodes.length;
		for(var i=0;i<count;i++){
			var node=_this.nodes[i];
			node.domNode.style.opacity=0;
		}
		window.setTimeout(function(){
			for(var i=0;i<count;i++){
				var node=_this.nodes[i];
				node.domNode.style.display="none";
			}
		},500);
	};
	this.layer=function (x0,y0,r){
		_this.x0=x0;
		_this.y0=y0;
		_this.radius=r;
		var count=_this.nodes.length;
		for(var i=0;i<count;i++){
			var node=_this.nodes[i];

			var left=x0+r*Math.cos(node.angle)-node.width/2;
			var top=y0+r*Math.sin(node.angle)-node.height/2;
			
			node.domNode.style.left=left+"px";
			node.domNode.style.top=top+"px";
		}
	};
	this.move=function(x,y){
		var count=_this.nodes.length;
		if (x) _this.x0+=x;
		if (y) _this.y0+=y;
		for(var i=0;i<count;i++){
			var node=_this.nodes[i];
			
			if (x){
				var oldleft=parseInt(node.domNode.style.left);
				var left = oldleft+x;
				node.domNode.style.left = left+"px";
				//_this.x0+=x;
			}
			if (y){
				var oldtop = parseInt( node.domNode.style.top);
				var top = oldtop + y;
				node.domNode.style.top = top+"px";
				//_this.y0+=y;
			}
		}
	};
	this.moveTo=function(x0,y0){
		_this.move(x0-_this.x0,y0-_this.y0);
	};
	this.setMovie=function(bani,strtrans){
		for(var i=0;i<_this.nodes.length;i++){
			var node=_this.nodes[i];
			node.setMovie(bani,strtrans);
		}
	};
	this.routeNow=function(angle){
		var x0=_this.x0;
		var y0=_this.y0;
		var r=_this.radius;
		var count=_this.nodes.length;
		_this.setMovie(false);
		for(var i=0;i<count;i++){
			var node=_this.nodes[i];
	
			var a=node.angle+angle;
			var left=x0+r*Math.cos(a)-node.width/2;
			var top=y0+r*Math.sin(a)-node.height/2;
			node.moveTo(left,top);
		}
	};
	this.route=function(angle){
		
	    var x0=_this.x0;
		var y0=_this.y0;
		var r=_this.radius;
		var count=_this.nodes.length;
		var idroute= "id"+parseInt( Math.random()*10000);
		_this.setMovie(false);
		var c=angle/10;
		if (angle<-3) c=-c;
		var css=new CssStyle();
		for(var i=0;i<count;i++){
			var node=_this.nodes[i];
			node.show();
			node.keyFrames=css.addKeyFrames("textmovie"+idroute+i);
			node.angleTo=node.angle+angle;
			if (node.angleTo> Math.PI*1.99) node.angleTo-=Math.PI*2;
			if (node.angleTo< -Math.PI*0.01) node.angleTo+=Math.PI*2;
			node.domNode.domNode.leftTo=x0+_this.radius*Math.cos(node.angleTo)-node.width/2;
			node.domNode.domNode.topTo=y0+_this.radius*Math.sin(node.angleTo)-node.height/2;
		}
		
		var ang=0;
		for(var j=1;j<=10;j++){
			ang+=c;
			for(var i=0;i<count;i++){
				var node=_this.nodes[i];
				var frames=node.keyFrames;
				var a=node.angle+ang;
				var left=x0+r*Math.cos(a)-node.width/2;
				var top=y0+r*Math.sin(a)-node.height/2;
				
				var strStyle="left:"+left+"px;top:"+top+"px";
				
		
				if (node.domNode.styleTo){
					var obj=node.domNode.styleTo;
					for(var p in obj){
						var fromp=parseFloat( node.domNode.style[p]);
						var top=parseFloat(obj[p]);
						//alert(top + "-" + fromp);
						var cur=(top-fromp)*j/10+fromp;
						
						strStyle+=(";" + p+ ":" + cur+"px"); 
						//div.style[p]=obj[p];
					}
					
				}
			
					
				
				frames.addkey( j*10 , strStyle);
			}
		}
		var funAniEnd = function (){ //动画结束时事件
			//这里是单个node的运动结束
			var d=event.srcElement;
			d.style.webkitAnimation="";
				d.style.left=d.leftTo+"px";
				d.style.top=d.topTo+"px";
			d.removeEventListener("webkitAnimationEnd",funAniEnd);
			//通过循环判断是否所有节点结束了运动
			for(var i=0;i<_this.nodes.length;i++){
				var node=_this.nodes[i];
				if (node.domNode.style.webkitAnimation!=""){	
					return;
				}else{
					node.angle=node.angleTo;
				}
			}
			//所有运动终止后移除keyframes的样式
			css.remove();
			window.setTimeout(function(){
				_this.setMovie(true);

			},10);
		};
		for(var i=0;i<count;i++){
			var node=_this.nodes[i];
			if (Math.abs(angle)>2)
				node.domNode.style.webkitAnimation= node.keyFrames.name + " 0.9s ease-out";
			else if(Math.abs(angle)>0.8)
				node.domNode.style.webkitAnimation= node.keyFrames.name + " 0.6s ease-in-out";
			else
				node.domNode.style.webkitAnimation= node.keyFrames.name + " 0.3s ease-in-out";
			
			node.domNode.style["-webkit-animation-fill-mode"]="forwards";
			node.domNode.domNode.addEventListener("webkitAnimationEnd",funAniEnd , false);
		}
	};
	this.zoom=function(x0,y0,zm){
		
	};
}

function DataFlow(){	
	var _this=this;
	this.dateNodes=[];
	this.dateLines=[];
	this.dataNodes=[];
	this.baseNodes=[];
	this.baseLines=[];
	this.views=["all","day","month","year"];
	this.view="all";
	this.viewid=0;
	this.timeLine=null;
	this.children=[];
	this.left=0;
	this.top=0;
	
	this.init=function(dataNode){
		this.dataNode=dataNode;
		this.id=dataNode.id+"_Flow";
		this.baseTop=this.top;
	}
	this.load=function(dataInfo){
		this.data=dataInfo;
		this.dataInfo=dataInfo;
		this.timeLine=this.createDom();
	}
	this.scroll=function(y){
		
		var div=_this.timeLine;
		div.style.webkitTransition="";
		var minTop=_this.baseTop;
		var maxTop=document.documentElement.clientHeight-50;
		_this.top+=y;
		var cd=null;
		var itemTop=null;
		var itemBottom=null;
		var reset=false;
		for(var i=0;i<_this.children.length;i++){
			cd=_this.children[i];
			if (_this.viewid>0){
				if (cd.view=="all" || cd.viewid<_this.viewid){
					cd.hide();
					continue;
				}
			}
			
			if (!cd.realtop) cd.realtop=cd.top;
			cd.realtop+=y;
			var data=cd.data;
			//对日视图中的 月统计节点   或者 月视图中的年统计节点起作用，这些节点停靠在页面上部或者下部
			if ((_this.viewid<2 && cd.viewid>1) || (_this.viewid>=2 && cd.viewid>2) ){
				if (cd.realtop<=this.baseTop+35 && cd.viewid<3){
					if (itemTop){
						itemTop.moveTo(0,itemTop.realtop);
					}
					itemTop=cd;
					itemTop.moveTo(0,this.baseTop+35);
				}else if (cd.realtop>=document.documentElement.clientHeight-35 ){
					if (!itemBottom){
						itemBottom=cd;
						if (cd.isDestroy) {
							cd.rebuild();
							reset=true;
						}
						itemBottom.moveTo(0,document.documentElement.clientHeight-35);
					}
				}else if(cd.viewid==3){
					itemBottom=cd;
					itemBottom.moveTo(0,document.documentElement.clientHeight-35);
				}else{
					//cd.top=cd.realtop;
					cd.moveTo(0,cd.realtop);
				}
			}else{
				cd.move(0,y);
			}
			
			if (cd.top<-100 || cd.top> document.documentElement.clientHeight*1.8){
				if (cd.isDestroy==false){
					cd.destroy();
					cd.visible=false;
					reset=true;
			
				}
			}else{
				if (cd.isDestroy) {
					cd.rebuild();
					cd.visible=true;
					reset=true;
				}
			}
			var opacity=0;
			
			if (cd.top>=minTop+50 && cd.top<=maxTop-30)
				opacity=1;
			else if(cd.top<minTop+50 && cd.top>minTop+20)
				opacity= 1- (minTop+50-cd.top) / (30);
			else if (cd.top<=minTop+20 || cd.top>maxTop) 
				opacity=0;
				if (cd==itemBottom || cd==itemTop) opacity=1;
			else if (cd.top>=maxTop-30 && cd.top<=maxTop){
				opacity=1-(cd.top- (maxTop-30))/30;
				if (cd==itemBottom || cd==itemTop) opacity=1;
			}else{
				//opacity=1;
			}
			
			if (opacity>0) cd.setStyle("display","");
			if (opacity==0) cd.setStyle("display","none"); 
			cd.setStyle("opacity",opacity);
			
		}
		if (cd){
			var top=cd.top;
			if (cd.realtop>cd.top) top=cd.realtop;
			if (top<document.documentElement.clientHeight*1.5){
				if (_this.onLoadMore && !_this.isLoading && !_this.loadAllData && _this.viewid<2){
					console.log("loadmore");
					_this.onLoadMore();
				}
			}
		}
		if(reset) _this.resetChilds();
	};
	
	this.scale=function(ds){
	
		var div=_this.timeLine;
		div.style.webkitTransition="";
		var minTop=100;
		var maxTop=document.documentElement.clientHeight-40;

		var cd=null;
		var istart=0;
		var top=this.baseTop+40;

		//var ctop=40*ds;
		for(var i=istart;i<_this.children.length;i++){
			cd=_this.children[i];
			if (ds<1.5 || _this.viewid==0 ){
				if (cd.viewid>=_this.viewid){
					cd.moveTo(0,top);
					var ctop=(_this.nodeMargin+cd.height)*ds;
					top+= ctop;
					if (cd.top>maxTop){
						opacity=0;
					}else{
						if (ctop>35)
							opacity=1;
						else
							opacity=(ctop-20)/15; 
					}
					if (cd.isTotal){
						opacity=1;
					}
					if (cd.top>document.documentElement.clientHeight)
						opacity=0;
					if (opacity>0) 
						cd.show();
					else
						cd.hide();
				}
				
			}else{
				
				if (cd.viewid+1>=_this.viewid){
					cd.moveTo(0,top);
					cd.show();
					var ctop=(_this.nodeMargin+cd.height)*ds/5;
					top+= ctop;
					if (cd.top>maxTop){
						opacity=0;
					}else{
						if (ctop>35)
							opacity=1;
						else
							opacity=(ctop-20)/15; 
					}
					if (cd.isTotal){
						opacity=1;
					}
					cd.setStyle("opacity",opacity);
				}
				
			}
			
		}

	};

	this.scaled=function(ds){

		_this.setMovie(true);
		window.setTimeout(function(){
			_this.setMovie(false);
		},500);
		_this.top=_this.baseTop;
		var reset=false;
		var top = this.baseTop + 40;
		if (ds<1){
			if (_this.viewid==4) return;
			_this.viewid+=1;
			_this.view=_this.views[this.viewid];
			if (_this.viewid==2){
		
				_this.onLoadTotal();
				return;
			}

			for(var i=0;i<_this.children.length;i++){
				var cd=_this.children[i];
				if (top<document.documentElement.clientHeight-30){
					if (cd.isDestroy) {
						cd.rebuild();
						cd.visible=true;
						reset=true;
						//
					}
				}
				if (cd.viewid>=_this.viewid){
					cd.show();
					cd.realtop=top;
					cd.moveTo(0,top);
					top+=40;
				}else{
					//cd.top=top;
					cd.moveTo(0,top);
					cd.realtop=top;
					cd.hide();
				}
				if (top>document.documentElement.clientHeight-30){ 
					if (cd.viewid<=_this.viewid)
						cd.hide();
				}
			}
		}else{
			
			_this.viewid-=1;
			if (_this.viewid<0) _this.viewid=0; 
			_this.view=_this.views[this.viewid];
			if (_this.viewid==1){
			
				_this.onLoadData();
				return;
			}
			
			
			for(var i=0;i<_this.children.length;i++){
				var cd=_this.children[i];
				if (cd.viewid>=_this.viewid){
					cd.show();
					cd.moveTo(0,top);
					if (cd.isTotal){
						cd.realtop=top;
					}
					if (cd==_this.itemTop){
						cd.moveTo(0,_this.baseTop+35);
					}else if (cd==_this.itemBottom){
						cd.moveTo(0,document.documentElement.clientHeight-35);
					}
					top+=40;
				}
				if (top>document.documentElement.clientHeight-40 && cd!=_this.itemBottom) {
					cd.hide();
				}else{	
					cd.show();
				}
			}
		}
		this.maxTop=top;
		if (reset) _this.resetChilds();
		this.scroll(0);	
		
	}
	this.move=function(x,y){

		var div=_this.timeLine;
		var minTop=100;

		if (x) {
			_this.left+=x;
		}
		if (y){
			_this.top+=y;
		}
		this.timeLine.move(x,y);
		this.basePanel.move(x,y);
		for(var i=0;i<_this.children.length;i++){
			cd=_this.children[i];
			cd.move(x,y);
		}
	};
	
	this.createDom=function(){
		this.dateLines=[];
		this.dataNodes=[];
		
		var dpanel=new DataPanel("dataPanel_Add");
		var left=document.documentElement.clientWidth/2-2;
		var top=this.top;
		dpanel.top=top;
		dpanel.height=25;
		var dnode=dui.getDataDom("div","timeline","liney",left,top+30,3,0,1);
		dnode.setMovie(false);
		//if (!dnode.newDom) dnode.style.height="2000px";
		
		var domNode=_this.dataNode.domNode;
		this.domNode=domNode;
		dnode.style.position="absolute";
	
		var div=dui.getDataDom("div","date_addnew","timenode", left-15,top,32,32,1);
		div.textContent="新增";
		div.style.lineHeight="25px";
		div.position="fixed";
		div.onclick=function(){
			//_this.scale(0.5);
			_this.scaled(0.4);
		}
		this.timeLine=dnode;
		this.addNode=div;
		this.baseNodes.push(div);
		
		dpanel.appendChild(div);
		
		var btn1=getButton("buttonAdd_"+_this.dataInfo.data1.name,left-130,top,90,20,10,0);
		btn1.className="dbutton";
		btn1.textContent="新增"+_this.dataInfo.data1.name;
		btn1.type="button";
		btn1.dataInfo=_this.dataInfo.data1;
		btn1.action="new";
		btn1.textAlign="center";
		btn1.fixed="y";
		btn1.pos=1;
		btn1.parent=this;
		this.dataNodes.push(btn1);
		dpanel.appendChild(btn1);
		btn1.onclick=_this.buttonClick;
		var btn2=getButton("buttonAdd_"+_this.dataInfo.data2.name,left+40,top,90,20,10,0);
		btn2.className="dbutton";
		btn2.textContent="新增"+_this.dataInfo.data2.name;
		btn2.type="button";
		btn2.dataInfo=_this.dataInfo.data2;
		btn2.action="new";
		btn2.pos=2;
		btn2.parent=this;
		btn2.textAlign="center";
		//btn2.style.left=left-150+"px";
		
		btn2.fixed="y";
		btn2.onclick=_this.buttonClick;
		this.dataNodes.push(btn2);
		dpanel.appendChild(btn2);
		var line1=dui.getDataDom("div","line_add1","linex",left+15,top+15,25,3,0);

		line1.nodeFrom=btn1;
		line1.nodeTo=dnode;
		line1.nodeData=btn1;
		
		line1.fixed="y";
		this.dateLines.push(line1);
		dpanel.appendChild(line1);
		var line2=dui.getDataDom("div","line_add2","linex",left-40,top+15,45,3,0);
	
		line2.nodeFrom=dnode;
		line2.nodeData=btn2;
		line2.nodeTo=btn2;
		
		line2.fixed="y";
		this.dateLines.push(line2);
		dpanel.appendChild(line2);
		
		btn1.line=line1;
		btn2.line=line2;
		div.button1=btn1;
		div.button2=btn2;
		div.line1=line1;
		div.line2=line2;
		//this.children.push(dpanel);
		dpanel.view="all";
		dpanel.viewid=0;
		this.basePanel=dpanel;
		
		if (!dnode.newDom){
			dpanel.show();
		}
		return dnode;
	};
	
	this.setButtons=function(btn2,btn1){
		//$("#buttonAdd1").text(btn1);
		//$("#buttonAdd2").text(btn2);
	};
	this.nodeClick=function(){
		if (_this.onNodeClick){
			this.backupData();
			_this.curnode=this;
			_this.onNodeClick(this);
		}
	};
	this.buttonClick=function(){
		if (_this.onButtonClick){
			
			this.data=null;
			_this.curnode=this;
			_this.onButtonClick(this);
		}
	};
	this.getItem=function(dpanel,data){
		
		
		var id=dpanel.index;
		
		var strDate=data.datetime.replace(/\-/g, "/");
		var date=new Date(strDate);
		var day=date.getDate(); 
		var month=date.getMonth();
		

		var left= document.documentElement.clientWidth/2-2 ;
		var top=dpanel.top;
		
		function getDataItem(){
			
			var div=dui.getDataDom("div","dateNode_D_"+ id,"timenode", left-10,top,16,16,0);
			dpanel.appendChild(div);
			
			div.textContent=day;
			var showDate=false;
			if (id>1){
				var oldDate=new Date(_this.children[id-1].data.datetime.replace(/\-/g, "/"));
				var oldDay=oldDate.getDate();
				if (oldDay==day) showData=false;
			}
			if (showDate==false){
				div.textContent="";
				div.style.width="12px";
				div.style.height="12px";
				div.style.left=left-5+"px";
				div.style.top=top+3+"px";
			}else{
				div.style.width="16px";
				div.style.height="16px";
				div.style.left=left -10 + "px";
				div.style.top = top + "px";
			}
			dpanel.viewid=0;
			
			var divData=dui.getDataDom("div","dataNode_"+data.id,"datanode " + data.state ,left+40,top-5,0,30,0);
			dpanel.newDom=divData.newDom;
			if (data.type!="total") 
				divData.textContent= data_Scheme[data.type].UIModel.getText(data);
			divData.type=data.type;
			if (!divData.newDom){
				divData.show();
				divData.size(100,30);
			}
			divData.style.width="125px",
			divData.style.height="30px";
		
			divData.parent=_this;
			if (data.pos==1 ){
				//divData.style.left=(left-50)+"px";
				divData.style.left=(left-145)+"px";
				divData.style.textAlign="right";
				divData.dataInfo=_this.dataInfo.data1;
				divData.pos=1;
			}else if (data.pos==2){
				divData.style.textAlign="left";
				divData.style.left=(left+25)+"px";
				divData.dataInfo=_this.dataInfo.data2;
				divData.pos=2;
			}
			divData.data=data;
			divData.onclick=_this.nodeClick;
			divData.dataType=data.type;
			divData.type="data";
			dpanel.appendChild(divData);
			dpanel.dataNode=divData;
			
			var line=dui.getDataDom("div","line_" + id,"linex",left+10,top+parseInt(div.style.height)/2+2,0,3,0);
			divData.line=line;
			div.line=line;
			line.nodeData=divData;
			line.nodeTime=div;
			
			if(data.pos==2){
				line.nodeFrom=div;
				line.nodeTo=divData;
				//line.style.left=parseInt(div.style.left) + parseInt(div.style.width) +10 +"px";
				line.style.left=(parseInt(line.nodeFrom.left)+parseInt(line.nodeFrom.width)) + "px" ;
				
			}else{
				line.nodeFrom=divData;
				line.nodeTo=div;
				//line.style.left=parseInt(div.style.left) +"px";
				line.style.left=(parseInt(line.nodeFrom.left)+parseInt(line.nodeFrom.width))+"px" ;
				
			}
			
			line.style.webkitTransition="";
	
			line.style.width = parseInt(line.nodeTo.style.left) - parseInt (line.style.left) + 2 + "px";
			dpanel.dateLine=line;
			dpanel.dateNode=div;
			dpanel.appendChild(line);
		}
		
		function getTotalItem(){
			
			var div=dui.getDataDom("div","dateNode_T_"+ id,"timenode", left-10,top,16,16,0);
			dpanel.appendChild(div);
			data.title=day+"日";
			if (!data.m1) data.m1=0;
			if (!data.m2) data.m2=0; 
			dpanel.viewid=1;
			div.style.width="40px";
			div.style.height="22px";
			div.style.left=left -20 + "px";
			/*
			if (data.group=="week"){
				data.title=date.getWeek()+"周";
				dpanel.viewid=2;
			}
			*/
			if (data.group=="month"){
				div.style.width="40px";
				div.style.left=left-20+"px";
				data.title=date.getMonth()+1+"月";
				dpanel.viewid=2;
			}
			if (data.group=="year"){
				data.title=date.getFullYear();
				dpanel.viewid=3;
			}
			div.textContent=data.title;
			//if (div.viewid=2){
				
				div.date=data.datetime;
				div.viewid=dpanel.viewid; 
				div.onclick=_this.totalNodeClick;
			//}
			
			div.style.top = top + "px";
			div.style.borderRadius="5px";
			div.style.zIndex=5;
			
			dpanel.newDom=true;
			if (data.m1>0){
				data.id=_this.dataInfo.data1.id + "_" + data.group + "_" + data.datetime;
				var divData1=dui.getDataDom("div","dataNode_"+data.id,"datanode" ,left+40,top-2,0,20,0);
				if (!divData1.newDom) dpanel.newDom=false;
				divData1.textContent="总计："+data.m1;
				divData1.date=data.datetime; 
				divData1.viewid=dpanel.viewid;
				divData1.onclick=_this.totalNodeClick;
				
				divData1.type=data.type;
				divData1.style.width="100px",
				divData1.style.height="30px";
				divData1.parent=_this;
				divData1.style.left=(left-140)+"px";
				divData1.style.textAlign="right";
				divData1.pos=1;
				dpanel.dataNode1=divData1;
				dpanel.appendChild(divData1);
			}
			if (data.m2>0 || data.m1==0){
				data.id=_this.dataInfo.data2.id + "_" + data.group + "_" + data.datetime;
				var divData2=dui.getDataDom("div","dataNode_"+ data.id,"datanode" ,left+40,top-2,0,20,0);
				if (!divData2.newDom) dpanel.newDom=false;
				divData2.date=data.datetime; 
				divData2.viewid=dpanel.viewid;
				divData2.onclick=_this.totalNodeClick;
				
				divData2.textContent="总计："+data.m2;
				divData2.type=data.type;
				divData2.style.width="100px",
				divData2.style.height="30px";
				divData2.parent=_this;
				divData2.style.left=(left+40)+"px";
				divData2.style.textAlign="left";
				divData2.pos=2;
				dpanel.dataNode2=divData2;
				dpanel.appendChild(divData2);
			}
			
			var line=dui.getDataDom("div","line_" + id,"linex",left+10,top+10,0,3,0);
			div.line=line;
			
			line.nodeTime=div;
			line.styleTo={};
			if(dpanel.dataNode2 && !dpanel.dataNode1){
				line.nodeFrom=div;
				line.nodeTo=divData2;
				line.nodeData=divData2;
				line.style.left=parseInt(div.style.left) + parseInt(div.style.width) +10 +"px";
				line.style.left=(parseInt(line.nodeFrom.style.left)+parseInt(line.nodeFrom.style.width)) + "px" ;
				
			}else if(dpanel.dataNode1 && !dpanel.dataNode2){
				line.nodeFrom=divData1;
				line.nodeData=divData1;
				line.nodeTo=div;
				line.style.left=parseInt(div.style.left) +"px";
				line.style.left=(parseInt(line.nodeFrom.style.left)+parseInt(line.nodeFrom.style.width))+"px" ;
				
			}else if(dpanel.dataNode1 && dpanel.dataNode2){
				line.nodeFrom=divData1;
				line.nodeTo=divData2;
				//line.style.left=parseInt(divData1.style.left) + parseInt(divData1.style.width) +"px";
				line.style.left=(parseInt(line.nodeFrom.style.left)+parseInt(line.nodeFrom.style.width) ) + "px" ;
			}

			line.style.width = parseInt(line.nodeTo.style.left) - parseInt (line.style.left) + "px";
			line.style.webkitTransition="";
			dpanel.dateLine=line;
			dpanel.dateNode=div;
			dpanel.appendChild(line);
			
		}

		if (data.pos==0){
			getTotalItem()
		}else{
			getDataItem();
		}
		
		return dpanel;
	
	};
	this.totalNodeClick=function(){
		var node=this;
		var nviewid=node.viewid;
		var strDate=node.date;
		var dt=new Date(strDate);
		dt.setDate(dt.getDate()+32);
		var toDate=new Date(dt.getFullYear(),dt.getMonth(),1).Format("yyyy-MM-dd");
		
		if (_this.viewid==0){
			if (node.viewid==1){
				var top= parseInt(node.style.top);
				if (top>300){
					_this.setMovie(true);
					_this.scroll(300-top);
				}
			}
		}else if (_this.viewid==1){
			if (node.viewid==1){	
				_this.viewid=0;
				_this.scaled(2);
				window.setTimeout(function(){
					var top= parseInt(node.style.top);
					if (top>300){
						_this.setMovie(true);
						_this.scroll(300-top);
					}
					
				},200);
			}else if(node.viewid==2){
				if (_this.fromDate<=strDate) return;
				_this.toDate=toDate;
				_this.onLoadData(function(){
					dflow.scroll(0);
				});
			}
			
		}else if (_this.viewid==2){
			if (node.viewid==2){
				
				//_this.fromDate=strDate;
				_this.toDate=toDate;
				_this.viewid=1;
				_this.onLoadData(function(){
					dflow.scroll(0);
				});
				//alert("月"+strDate);
			}
		}else{
			return;
		}
	}
	
	this.resetChilds=function(){
		_this.dateLines=[];
		_this.dataNodes=[];
		_this.dateNodes=[];
		
		var div=_this.baseNodes[0];
		_this.dateNodes.push(div);
		_this.dateLines.push(div.line1);
		_this.dateLines.push(div.line2);
		_this.dataNodes.push(div.button1);
		_this.dataNodes.push(div.button2);
		
		for(var i=0;i<_this.children.length;i++){
			var cd=_this.children[i];
			if (cd.isDestroy==false){
				
				_this.dateNodes.push(cd.dateNode);
				if (cd.dateLine) _this.dateLines.push(cd.dateLine);
			    
				if (cd.dataNode) _this.dataNodes.push(cd.dataNode);
				if (cd.dataNode1) _this.dataNodes.push(cd.dataNode1);
				if (cd.dataNode2) _this.dataNodes.push(cd.dataNode2);
			}
		}
		
	};
	
	this.setMovie=function(bmovie){
	    this.timeLine.setMovie(bmovie);
	    this.basePanel.setMovie(bmovie);
		for(var i=0;i<this.children.length;i++){
			var cd=this.children[i];
			cd.setMovie(bmovie);
		}
	};
	this.clsOldData=function(){
	
		if (_this.children){
	
			var childs=[];
			if (_this.children.length>0){

				for(var i=0;i<_this.children.length;i++){
					if (_this.children[i].children.length>0){
						childs.push(_this.children[i]);
					}
				}
			}
			
			window.setTimeout(function(){

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
				
			},50);
		}
	}
	
	this.loadData=function(dataarr){
		this.domNode=this.timeLine;
	
		var dnow=new Date();
		
		if (this.children.length>0){
			this.clsOldData();
		}
		
		this.dateNodes=[];
		this.children=[];
		this.dataList=dataarr;
		this.nodeMargin=10;
		var oldDay=0;
		var top = this.top+45;
		this.itemTop=null;
		this.itemBottom=null;
		for(var i=0;i<dataarr.length;i++){
			var data=dataarr[i];
			if (!data.datetime) data.datetime=data.createTime;
			var strDate=data.datetime.replace(/\-/g, "/");;
			var date=new Date(strDate);
			var day=date.getDate(); 
			
			var dpanel=new DataPanel("dataPanel_"+i);
			this.children.push(dpanel);
			dpanel.index=i;

			dpanel.onload=_this.getItem;
			dpanel.top=top;
			dpanel.data=data;
			dpanel.height=35;
			if (data.type=="total"){
				dpanel.viewid=1;
				dpanel.view=data.group;
				if (data.group=="month")
					dpanel.viewid=2
				else if(data.group=="year"){
					dpanel.viewid=3;
				}
				dpanel.isTotal=true;
			}else{
				dpanel.viewid=0;
				dpanel.view="all";
				dpanel.isTotal=true;
			}
			if (dpanel.top<document.documentElement.clientHeight*1.8){
				dpanel.load(data);
			}
				
			if (dpanel.viewid>=_this.viewid){
				dpanel.visible=true;
				top+=dpanel.height+this.nodeMargin;
			}else{
				dpanel.visible=false;
			}
			
			/*
			if (dpanel.newDom){
				dpanel.hide();
			}else{
				if (dpanel.viewid>=this.viewid)
					dpanel.show();
				else
					dpanel.hide();
			}
			*/
			
			oldDay=day;
		}
		this.maxTop=top;
		this.resetChilds();
		
		this.setMovie(true);
	};
	this.appendData=function(dataarr){
		if (!dataarr) return;
		if (dataarr.length<1) return;
		var dnow=new Date();
		var oldDay=0;

		var realtop=this.children[this.children.length-1].realtop;
		var top=this.children[this.children.length-1].top;
		if (top<realtop) top=realtop;
		if (this.viewid>0){
			for(var i=this.children.length-1;i>0;i--){
				var cd=this.children[i];
				if (cd.viewid>=this.viewid){
					if (top<cd.top) top=cd.top;
					if (realtop<cd.realtop) realtop=cd.realtop;
				}
			}
		}
		
		top += 40;
		realtop+=40;
	
		//var top = this.children[this.children.length-1].top+40;
		for(var i=0;i<dataarr.length;i++){
			var data=dataarr[i];
			_this.dataList.push(data);
			var strDate=data.datetime.replace(/\-/g, "/");;
			var date=new Date(strDate);
			var day=date.getDate(); 
			
			var dpanel=new DataPanel("dataPanel_"+this.children.length);
			this.children.push(dpanel);
			dpanel.index=this.children.length-1;
			dpanel.onload=_this.getItem;
			dpanel.top=top;
			dpanel.realtop=top;
			dpanel.viewid=0;
			dpanel.height=35;
			dpanel.data=data;

			//if (dpanel.viewid>_this.viewid)
			//	dpanel.realtop=top;
					
			if (top<document.documentElement.clientHeight*1.8){
				dpanel.load(data);
				dpanel.show();
			}
			
			if (dpanel.viewid>=_this.viewid){
				//dpanel.visible=true;
				
				top+=dpanel.height+_this.nodeMargin;
				
			}else{
				dpanel.hide();
				//dpanel.realtop=realtop;
			}
			
			realtop+=dpanel.height+_this.nodeMargin;
			oldDay=day;
		}
		this.maxTop=top;
		this.resetChilds();
	};
	this.relayer=function(){
		var top = this.top + 30;
		var count=_this.dateNodes.length;
		var h1= parseInt( this.dateLines[0].nodeData.style.height);
		var h2= parseInt( this.dateLines[1].nodeData.style.height);
		if (h2>h1) h1=h2;
		
		top+=h1;
		var l1= this.addNode.line1;
		var l2= this.addNode.line2;
		var baseLines=[l1,l2];
		
		for(var i=0;i<baseLines.length;i++){
			var line=baseLines[i];
			line.style.left=parseInt(line.nodeFrom.style.left)+ parseInt( line.nodeFrom.style.width) + "px";
			line.style.width= parseInt(line.nodeTo.style.left) - parseInt( line.style.left ) + "px";
		}
		
		for(var i=1;i<count;i++){
			var div=_this.dateNodes[i];
			var line=div.line;
			line.style.top = (top-1)+"px";

			if (line.nodeFrom!=div) line.nodeFrom.style.top=top-12+"px";
			if (line.nodeTo!=div) line.nodeTo.style.top=top-12+"px";

			div.style.top=top - parseInt(div.style.height)/2 +"px";

			var h1= parseInt(line.nodeFrom.style.height);
			var h2= parseInt(line.nodeTo.style.height);
			
			line.style.left=parseInt(line.nodeFrom.style.left)+ parseInt( line.nodeFrom.style.width) + "px";
			line.style.width= parseInt(line.nodeTo.style.left) - parseInt( line.style.left ) + "px";
			
			if (h2>h1) h1=h2;
			top+=h1+15;
		}
	};
	this.showNode=function(node){
	
		_this.setMovie(true);
		_this.timeLine.style.display="";
		_this.timeLine.style.opacity=1;
		_this.timeLine.style.height="3000px";
		var width=document.documentElement.clientWidth;
		var tleft= parseInt( _this.timeLine.style.left);
		if (Math.abs(tleft-width/2)<width/3){
			var cleft=0;
			if (node.pos==2){
				cleft=-(width/2-20);
			}else{
				cleft=(width/2-20);
			}
			var count=_this.children.length;
			for(var i=0;i<count;i++){
				var div=_this.children[i];
				div.setStyle("webkitTransition","all 0.5s ease-in-out");
				div.move(cleft);
				div.show();
			}
			_this.basePanel.move(cleft);
			
			_this.domNode.style.left=parseFloat(_this.domNode.style.left)+cleft+"px";
			
		}else{
			var count=_this.children.length;
			for(var i=0;i<count;i++){
				var div=_this.children[i];
				div.setStyle("webkitTransition","all 0.5s ease-in-out");
				
				div.show();
			}
		}
		_this.basePanel.show();
		_this.domNode.show();
		
		tleft= parseInt( _this.timeLine.style.left);
		if (tleft<width/3){
			node.style.left= tleft + 15 + "px";
		}else{
			node.style.left="10px";
		}
		this.relayer();
		if (node.top>200){
			this.scroll(200-node.top);
		}
		window.setTimeout(function(){
			_this.setMovie(false);
		},500);
	};
	this.show=function(){
		if (!this.domNode){
			this.autoShow=true;
			return;
		}
		this.timeLine.style.webkitTransition="all 0.6s ease-in-out";
		this.timeLine.style.height="2000px";
		this.timeLine.style.left=document.documentElement.clientWidth/2-2+"px";
		this.basePanel.show();
		this.scroll(0);
		window.setTimeout(function(){
			_this.setMovie(false);
		},500);
		
	};

	this.hide=function(){
		_this.domNode.style.opacity=0;
		_this.domNode.style.webkitTransition="all 0.5s ease-in-out";
		this.basePanel.hide();
		for(var i=0;i<this.children.length;i++){
			var cd=this.children[i];
			cd.setMovie(true);
			cd.setStyle("opacity",0);
		}
	};
	this.destroy=function(){
		_this.timeLine.destroy();
		_this.basePanel.destroy();
		for (var i=0;i<_this.children.length;i++){
			var cd=_this.children[i];
			cd.destroy();
		}
		
	};
}
function DataPanel(id){
	var _this=this;
	_this.id=id;
	_this.children=[];
	_this.isDestroy=true;
	this.appendChild=function(div){
		if (div.domNode){
			div.domNode.panel=this;
			if (div.domNode.domNode)
				div.domNode.domNode.panel=this;
		}
		this.children.push(div);
		
		this.isDestroy=false;
	};
	this.load=function(data){
		this.isDestroy=false;
		this.data=data;
		if (this.onload){
			this.onload(_this,data);
		}
	};
	this.setMovie=function(bmovie){
		for(var i=0;i<this.children.length;i++){
			var cd=this.children[i];
			if (bmovie)
				cd.style.webkitTransition="all 0.5s ease-in-out";
			else
				cd.style.webkitTransition="";
		}
	}
	this.setStyle=function(style,value){
		
		for(var i=0;i<this.children.length;i++){
			var cd=this.children[i];
			cd.style[style]=value;
		}
	};
	this.moveTo=function(x,y){
		var dx=0;
		var dy=0;
		if(x) {
			dx=x-this.left;
			this.left=x;
		}
		if(y) {
			dy=y-this.top;
			this.top=y;
		}
		
		for(var i=0;i<this.children.length;i++){
			var cd=this.children[i];
			if (x) cd.style.left=parseFloat(cd.style.left)+dx+"px";
			if (y) cd.style.top=parseFloat(cd.style.top)+dy+"px";
		}
		
	};
	this.move=function(x,y){
		if(x) this.left+=x;
		if(y) this.top+=y;
		
		for(var i=0;i<this.children.length;i++){
			var cd=this.children[i];
			if (x) cd.style.left=parseFloat(cd.style.left)+x+"px";
			if (y) cd.style.top=parseFloat(cd.style.top)+y+"px";
		}
		
	};
	this.show=function(){
		this.visible=true;
		for(var i=0;i<this.children.length;i++){
			var cd=this.children[i];
			cd.style.opacity=1;
			if (cd.style.display="none") 
				cd.style.display="";
		}
	};
	this.hide=function(){
		this.visible=false;
		for(var i=0;i<this.children.length;i++){
			var cd=this.children[i];
			cd.style.opacity=0;
			cd.style.display="none";
		}
	};
	this.destroy=function(){
		
		for(var i=0;i<this.children.length;i++){
			var cd=this.children[i];
			cd.destroy();
		}
		_this.children=[];
		_this.isDestroy=true;
	};
	this.rebuild=function(){
		_this.load(_this.data);
		_this.show();
	};
}

function DataForm(){
	var _this=this;
	this.children=[];
	this.controls=[];
	this.buttons=[];
	this.files=[];
	this.title="";
	
	this.init=function(div){
		this.panel=div;
		div.className="dataform";
		this.domNode=div;
		this.id=div.id;
	};
	this.load=function(dataInfo,leval){
		this.dataInfo=dataInfo;
		if (!leval) leval=1;
		var formInfo=this.getFormInfo(leval);
		this.formInfo=formInfo;
		var div=this.panel;
		this.title=formInfo.title;
		this.left=parseInt(div.style.left);
		this.top=parseInt(div.style.top)+3;
		var panel=this.panel;
		for(var i=0;i<panel.children.length;i++){
			var cd=panel.children[i];
			cd.style.opacity=0;
		}
		
		var controls=formInfo.controls;
		var top=0;
		var divTitle=dui.getDataDom("div",this.id+"_title","title",0,0,this.width-5,30,0);
		divTitle.textContent=this.title;
		divTitle.visible=true;
		this.divTitle=divTitle;
		this.children.push(divTitle);
		
		var btnX=dui.getDataDom("img",this.id+"_close","smallicon",this.width-39,1,28,28,0);
		btnX.style.webkitTransition="all 1s ease-in-out";
	
		btnX.textContent="分享";
		btnX.visible=true;
		btnX.domNode.src="../image/close.png";
		btnX.styleTo={opacity:0.6};
		this.children.push(btnX);
		
		var divs=dui.getDataDom("div",this.id+"_state","state",this.width/2+50,0,200,30,0);
		divs.style.webkitTransform= "rotate(-40deg)";
		divs.textContent="";
		divs.style.left="";
		divs.style.right="-50px";
		divs.style.top="";
		divs.style.bottom="30px";
		divs.style.display="none";
		divs.visible=false;
		this.divState=divs;
		this.children.push(divs);
		
		if (leval>=3){
			divTitle.style.height="45px";
			divTitle.style.display="none";
			top+=35;
		}
		
		top+=40;
		for(var i=0;i<controls.length;i++){
			var cinfo=controls[i];
			
			var fd=cinfo.field;
			
			var label=dui.getDataDom("div","label_"+cinfo.id,"label",10,top+5,80,25,1);
			label.textContent=cinfo.title+":";
			label.style.fontSize="14px";
			
			this.children.push(label);
			
			if (fd.datatype=="bool"){
				var txt=dui.getDataDom("input","input_"+cinfo.id,"checkbox",95,top+5,20,20,0);
			}else{
				var txt=dui.getDataDom("input","input_"+cinfo.id,"text",90,top,this.width-122,25,0);
				txt.setAttribute("placeHolder",cinfo.placeHolder);
			}
			txt.dataid=cinfo.id;
			txt.datatype=fd.datatype;
			txt.label=label;
			txt.visible=true;
			if (cinfo.readonly){
				txt.setAttribute("readonly","readonly");
				txt.style.border="none";
				txt.style.backgroundColor="rgba(250,250,250,0)";
			}
			if (fd.datatype=="number"){
				txt.style.imeMode='disabled';
				txt.setAttribute("type","number");
			}
			if (fd.datatype=="datetime"){
				txt.style.imeMode='disabled';
				txt.setAttribute("type","date");
			}
			if (cinfo.defaultValue){
				txt.value=cinfo.defaultValue;
			}
			if (fd.datatype=="image"){
				txt.style.display="none";
				txt.visible=false;
				var img=getImage("image_"+cinfo.id,92,top+3,20,20,5,0);
				//var file=getImgFile(cinfo.id,100,top+3,this.width-130,25,0);
				var file=getImageFile(cinfo.id,100,top+3,this.width-130,25,0);
				file.imageWidth=1920;
				file.imageHeight=1080;
				img.style.display='none';
				img.button=file;
				txt.image=img;
				txt.file=file;
				file.image=img;
				file.txtinput=txt;
				file.visible=true;
				file.onupload=function(f){
					var img=f.image;
					var txt=f.txtinput;
					txt.value=file.value;
					img.style.display="";
					img.style.opacity=0.9;
					_this.onSaveData();
					_this.loadImage(img,f.imageUrl);
				}
				
				this.children.push(img);
				this.children.push(file);
			};
			txt.style.webkitTransition="all 1s ease-in-out";
			this.controls.push(txt);
			this.children.push(txt);
			if (cinfo.visible==false){
				txt.style.display="none";
				txt.visible=false;
				label.style.display="none";
				label.visible=false;
			}else{
				
				top+=40;
			}
		};

		var btnm=dui.getDataDom("div",this.id+"_more","listitem_button",10,top,this.width-30,25,0);
		btnm.style.webkitTransition="all 1s ease-in-out";
		btnm.textContent="更多…";
		btnm.visible=true;
		btnm.style.textAlign="center";
		top+=35;

		var btn1=dui.getDataDom("div",this.id+"_ok","dbutton",this.width/12,top,this.width/3,20,0);
		btn1.style.webkitTransition="all 1s ease-in-out";
		btn1.textContent="保存";
		btn1.visible=true;
		var btn2=dui.getDataDom("div",this.id+"_share","dbutton",this.width/2+this.width/12,top,this.width/3,20,0);
		btn2.textContent="分享";
		btn2.style.webkitTransition="all 1s ease-in-out";
		btn2.visible=true;
		var btn3=dui.getDataDom("div",this.id+"_delete","dbutton",this.width/2+this.width/12,top,this.width/3,20,0);
		btn3.textContent="删除";
		btn3.style.webkitTransition="all 1s ease-in-out";
		btn3.visible=true;
		
		this.children.push(btnm);
		this.children.push(btn1);
		this.children.push(btn2);
		this.btnMore=btnm;
		this.btnOk=btn1;
		this.btnDelete=btn3
		this.btnShare=btn2;
		this.btnClose=btnX;
		this.initEvent();
		if (leval>=3){
			btnX.style.display="none";
			btnX.visible=false;
			btnm.style.display="none";
			btnm.visible=false;
			this.children.push(btn3);
			btn1.style.width=this.width/12 * 10 + "px";
			btn2.style.width=this.width/12 * 10 + "px";
			btn3.style.width=this.width/12 * 10 + "px";
			btn2.style.left=btn1.style.left;
			btn3.style.left=btn1.style.left;
			btn2.style.top = top+ 40+"px";
			btn3.style.top = top+ 80+"px";
		}else{
			btn3.style.display="none";
			btn3.visible=false;
		}
		
		//top+=30;
		
		this.panel.onclick=function(){return true;};
		this.panel.style.overflow="hidden";
		for(var i=0;i<this.children.length;i++){
			var div=this.children[i];
			this.panel.appendChild(div);
		}
		if (leval<3){
			this.height=top+50;
			this.panel.style.height=this.height+"px";
			if (this.panel.onresize) 
				this.panel.onresize();
		}else{
			this.height=document.documentElement.clientHeight;
			this.panel.style.height=this.height+"px";
		}
		
	};
	this.loadImage=function(img,url){
		var btnPhoto=img.button;
		
		img.style.display="";
		img.style.opacity=0.9;
		//延时加载图片
		img.src="../image/loading.gif";
		window.setTimeout(function(){
			img.src=url;
		},600);
		
		if (parseInt(img.style.height)>100) return;
		
		img.style.width="150px";
		img.style.height="110px";

		var top= parseInt (img.style.top) +105;
		var ctop=80;
		for(var i=0;i<_this.children.length;i++){
			var cd=_this.children[i];
			if (parseInt(cd.style.top)>parseInt (img.style.top)){
				if (cd!=btnPhoto){
					cd.style.top=parseInt(cd.style.top)+ctop+"px";
				}
	
			}
		}
		btnPhoto.style.left= this.width-105+"px";
		btnPhoto.style.width="80px";
		btnPhoto.style.height="30px";
		btnPhoto.style.top= parseInt(img.style.top)+ctop+"px";
		_this.panel.style.height= parseInt (_this.panel.style.height)+ctop+ "px";
		
		img.onclick=function(){
			if (_this.onShowImage){
				_this.image=img;
				_this.onShowImage(_this);
			}
			//dui.openWindow(WinImage,)
			/*
			var photoBrowser = api.require('photoBrowser');
			photoBrowser.open({
			    images: [
			        img.src,
			    ],
			    placeholderImg: '../image/icon.png',
			    bgColor: '#000'
				}, function(ret, err) {
				    if (ret) {
				        alert(JSON.stringify(ret));
				    } else {
				        alert(JSON.stringify(err));
				    }
			});
			*/
		}
		
		if (_this.panel.onresize) _this.panel.onresize();
	};
	this.getPhoto=function(cinfo,callback){
		var fd=cinfo.Field;
		var txt=$("#input_"+cinfo.id)[0];
		var img=$("#image_"+cinfo.id)[0];
		//camera,library,album
		api.getPicture({
		    sourceType: 'camera',
		    encodingType: 'jpg',
		    mediaValue: 'pic',
		    destinationType: 'url',
		    allowEdit: true,
		    quality: 50,
		    targetWidth: 1000,
		    targetHeight: 1000,
		    saveToPhotoAlbum: false
		}, function(ret, err) {
		    if (ret) {
		    	var filePath=ret.data;
		    	img.src=filePath;
		    	img.style.width="100px";
		    	img.style.height="100px";
		    	img.style.opacity=1;
		    	if(callback) callback(filePath);
		    } else {
		        alert(JSON.stringify(err));
		    }
		});
	};
	this.uploadFile=function(filePath,callback){
	
		var session=JSON.stringify(getSession());
		/*
		
		return;
		*/
		/*
		api.showProgress({
            style : 'default',
            animationType : 'fade',
            title : '',
            text : '上传中...',
            modal : false
    	});
    	
    	*/
    	api.ajax({
            url : urlServer + '/Data/FileService/upload',
            method : 'post',
            cache : false,
            timeout : 30,
            dataType : 'json',
            returnAll : false,
            data : {
            	auth:session,
                files : {file : filePath}
            }
    	}, function(ret, err) {
            //api.hideProgress();
            if (ret) {
				callback(ret.value);
            } else {
           		alert("err:"+err.msg);
                //showToast('错误码：' + err.code + '；错误信息：' + err.msg + '网络状态码：' + err.statusCode);
            };
        });
    
	};
	this.getData=function(){
		
		var data=this.data;
		var datestr=new Date().Format("yyyy-MM-dd hh:mm:ss");
		if (!data){ 
			data={id:guid()};
			data.createTime=datestr; //系统字段 创建日期
			data.datetime=datestr;   //用户字段 单据日期
			data.updateTime=datestr; //系统字段 更新日期
			this.data=data;
		}
		if (!data.id) data.id=guid();
		data.type=this.dataInfo.id;
		this.dataid=data.id;
		for(var i=0;i<this.controls.length;i++){
			var txt=this.controls[i];
			
			data[txt.dataid]=txt.value;
			//this.panel.appendChild(div);
		}
		return data;
	};
	this.getFormInfo=function(dataleval){
		var formInfo={};
		var dataInfo=this.dataInfo;
		formInfo.title=dataInfo.name;
		formInfo.id=dataInfo.id;
		
		formInfo.controls=[];
		var data=this.panel.data;
		if (!data) data=this.defaultData;
		if (!data) data={};
		for(var i=0;i<dataInfo.Fields.length;i++){
			var fd=dataInfo.Fields[i];
			if (fd.datalevel<=dataleval && fd.visible!=false){
			
				var cinfo={id:fd.id,title:fd.name,placeHolder:"请输入"+fd.name,field:fd};
				if (data.state){
					if (data.state=="share" || data.state=="sign") cinfo.readonly=true;
				}
				if (this.defaultData){
					if (this.defaultData[fd.id]){
						cinfo.defaultValue=this.defaultData[fd.id];
						cinfo.visible=false;
					}
				}
				formInfo.controls.push(cinfo);
			}
		}
		return formInfo;
	}
	this.showFullScreen=function(){
		this.onresize="";
		var div=this.domNode;
		
		div.moveTo(0,0);
		
		div.size(document.documentElement.clientWidth,document.documentElement.clientHeight);
		this.left=0;
		this.top=0;
		this.width=document.documentElement.clientWidth;
		this.height=document.documentElement.clientHeight;
		var data=this.getData();
		this.load(this.dataInfo,3);
		this.setData(data);
		this.show();
		this.btnMore.hide();
		this.divTitle.hide();
		this.btnClose.hide();
		
		div.className="dataform fullscreen";
	}
	this.relayer=function(){
		var top=this.topStart;
		for(var i=0;i<this.controls.length;i++){
			var txt=this.controls[i];
			var field=null;
			txt.style.top=top+"px";
			for(var j=0;j<controls.length;j++){
				var fd=controls[j].field;
				if (fd.id==txt.dataid ){
					field=fd;
					if (fd.datatype=="image" && fd.value!=""){
						top+=65;
					}
				}
			}
			if (field.visible) top+=40;
		}
	};
	this.showNormal=function(){
		
	}
	this.initEvent=function(){
		this.btnClose.onclick=function(){ _this.onClose();event.cancelBubble = true;return false; };
		this.btnMore.onclick=function(){ if(_this.onMoreData) _this.onMoreData(); else _this.showFullScreen();event.cancelBubble = true;return false;};
		this.btnOk.onclick=function(){ _this.onSaveClick();event.cancelBubble = true;};
		this.btnShare.onclick=function(){ _this.onDataShare();event.cancelBubble = true;};
		this.btnDelete.onclick=function(){ _this.onDataDelete();event.cancelBubble = true;};
		var data=this.data;
		if (!data) return;
		var state="";
		
		if (data.state=="share") state="等待对方确认";
		if (data.state=="sign") state="双方已确认";
		if (data.state=="beshared") state="需要您确认";
		if (data.state=="unsign") state="对方拒绝签字";
		if (state){
			this.divState.style.display="";
			this.divState.textContent= state;
			if (data.state=="beshared"){
				this.btnOk.style.display="";
				this.btnOk.textContent="签字确认";
				this.btnOk.onclick=function(){ _this.onSignData();event.cancelBubble = true;};
				this.btnShare.textContent="拒绝签字";
				this.btnShare.style.display="";
				this.btnShare.onclick=function(){ _this.onUnSignData();event.cancelBubble = true;};
			}else if (data.state!="unsign"){
				this.btnOk.style.display="none";
				this.btnShare.style.display="none";
			}
			
		}else{
			this.divState.style.display="none";
			this.btnOk.style.display="";
			this.btnOk.textContent="保存";
		}
		this.domNode.className="dataform " + data.state;
		this.divState.domNode.className="state " + data.state;
		this.btnOk.className="dbutton "+data.state;
		this.btnShare.className="dbutton "+data.state;
	}
	this.setData=function(data){
		if (data==null) data={};
		this.datatype=data.type;
		this.dataid=data.id;
		this.data=data;
		this.initEvent();
		
		controls=_this.formInfo.controls;
		
		
		var top=35;
		var bimage=false;
		for(var i=0;i<this.controls.length;i++){
			
			var txt=this.controls[i];
			var value= data[txt.dataid];
			var field=null;
			
			for(var j=0;j<controls.length;j++){
				var fd=controls[j].field;
				if (fd.id==txt.dataid ){
					field=fd;
					if (fd.datatype=="image"){
						txt.visible=false;
						if (value){
						var img=txt.image;
							bimage=true;
							_this.loadImage(img,urlServer+"/" + value);
							_this.image=img;
						}
					}
				}
			}

			if(value){
				txt.value=value;
			}else{
				txt.value="";
			}
		}
		if (bimage) this.relayer();
		
	};
	this.show=function(){

		for(var i=0;i<this.children.length;i++){
			var div=this.children[i];
			div.style.opacity=1;
			if (!div.visible===false){
				div.style.display="";
			}
		}
		
	};
	this.hide=function(){

		for(var i=0;i<this.children.length;i++){
			var div=this.children[i];
			div.style.opacity=0;
		}
	};
	
	this.destroy=function(){

		for(var i=0;i<this.children.length;i++){
			var div=this.children[i];
			div.destroy();
		}
	};
}
function DataList(){
	var _this=this;
	this.children=[];
	this.buttons=[];
	this.init=function(dom){
		this.domNode=dom;
		this.panel=new DataPanel("datalistPanel");
	};
	this.load=function(data){
		this.children=[];
		this.dataid=data.id;
		this.datatype=data.name;
		this.UIModel=data.UIModel;
		this.baseTop=this.top;
	};
	this.loadData=function(datalist){
		
		var top=this.top;
		this.baseTop=this.top;
		_this.dataList=datalist;
		for(var i=0;i<this.buttons.length;i++){
			var btn=this.buttons[i];
			top+= parseInt(btn.style.height)+13;
		}
		
		for(var i=0;i<datalist.length;i++){
			var data=datalist[i];
			var divitem=_this.getItem(data,top);
			this.children.push(divitem);
			top+=60;
		}
		_this.topMax=top;
	};
	this.loadItemData=function(){
		var divitem=this;
		divitem.clear();
		divitem.className="listitem";
		var controls=_this.UIModel.getListItem(this.data);
		for(var c=0;c<controls.length;c++){
			var ctl=controls[c];
			ctl.style.opacity=1;
			if (ctl.styleTo){
				setStyleData(ctl,ctl.styleTo);
			}
			divitem.appendChild(ctl);
		}
		divitem.style.opacity=1;
		divitem.style.height="54px";
		
		divitem.onclick=function(){_this.onDataClick(this);};
	}
	this.getItem=function(data,top){
		var divitem=dui.getDataDom("div",data.id,"listitem",10,top,this.width-20,54,5,0);
		divitem.data=data;
		divitem.loadData=_this.loadItemData;
		divitem.loadData();
		return divitem;
	};
	this.addButton=function(btn){
		this.buttons.push(btn);
		this.children.push(btn);
	};
	this.showNode=function(div,top){
		
		div.backupData();
		var panel=_this;
		var index=panel.children.length;
		var ctop=div.top;
		var dtop = document.documentElement.clientHeight-(ctop+div.height+2);
		
		for(var i=0;i<panel.children.length;i++){
			var cd=panel.children[i];
			if (cd==div){
				index=i;
			}
			if (cd)
			{
				if (i<index){
					cd.style.top=parseInt(cd.style.top)-ctop+"px";
				}else if(i>index)
				{
					cd.style.top = parseInt(cd.style.top)+dtop+"px";
				}
			}
		}
		
		div.style.top=top+"px";
	};
	this.insertItem=function(){
		var top = this.top;
		var height=60;
		var divitem=dui.getDataDom("div",this.id+"_newitem","listitem",10,top,this.width-20,height,1);
		top+=height;
		
		for(var i=0;i<this.children.length;i++){
			
			var div=this.children[i];
			div.style.top=top+"px";
			div.style.opacity=1;
			top+=60;
		}
		divitem.style.opacity=1;
		this.panel.appendChild(divitem);
		this.children.splice(this.buttons.length,0,divitem);
		this.divNew=divitem;
		return divitem;
	};
	this.removeItem=function(div){
		div.style.height="0px";
		div.style.opacity=0;
		var idel=-1;
		for(var i=0;i<_this.children.length;i++){
			if (_this.children[i]==div){
				idel=i;
				break;
			}
		}
		if (idel>-1)
			_this.children.splice(idel,1);
		_this.show();
					
		window.setTimeout(function(){div.destroy();},500);
		
	};
	this.insertData=function(data){
		var divitem=getDiv(data.id,10,top,this.width-20,54,5,0);
		//divitem.style.backgroundColor="rgba(250,250,250,0.3)";
		var controls=this.UIModel.getListItem(data);
		for(var c=0;c<controls.length;c++){
			divitem.appendChild(controls[c]);
		}
		divitem.style.opacity=0;
		this.children.splice(1,0,divitem);
		this.panel.appendChild(divitem);
		divitem.className="listitem";
		divitem.data=data;
		divitem.loadData=_this.loadItemData;
		
		this.show();
	};

	this.show=function(){
		var top = _this.top+5;
		for(var i=0;i<this.children.length;i++){
			var div=this.children[i];
			if(div){
				if (div.style.display="none") div.style.display="";
				
				div.style.opacity=1;
				if (div.styleTo)
					setStyleData(div,div.styleTo);
				div.style.top = top+"px";
				top += parseInt (div.style.height) +6;
				div.onclick=function(){
					_this.onDataClick(this);
				};
			}
		}
		for(var i=0;i<this.buttons.length;i++){
			var div=this.buttons[i];
			if(div){
				if (div.style.display="none") div.style.display="";
				div.style.opacity=1;
				div.onclick=function(){
					_this.onButtonClick(this);
				};
			}
		}
	};
	this.hide=function(){
		var top = this.top;
		for(var i=0;i<this.children.length;i++){
			var div=this.children[i];
			if(div) div.style.opacity=0;
		}
	};
	this.destroy=function(){
		for(var i=0;i<this.children.length;i++){
			var div=this.children[i];
			if(div) div.destroy();
		}
		for(var i=0;i<this.buttons.length;i++){
			var div=this.buttons[i];
			if(div) div.destroy();
		}
	}
	this.move=function(left,top){
		if (top) this.top+=top;
		if (left) this.left+=left;
		
		var ifrom=parseInt( (this.baseTop-this.top)/56)-5;
		if (ifrom<0) ifrom=0;
		var ito=ifrom+20;
		if (ito>this.children.length) ito=this.children.length;
		var topFrom=this.top+(ifrom)*56+30;
		
		var dtop=topFrom;
		if (ifrom>1){
			//alert(ifrom);
			for(var i=1;i<ifrom;i++){
				var d=this.children[i];
				if (d){
					d.offsetParent.removeChild(d);
					this.children[i]=null;
				}
			}
		}
		if (ito<this.children.length-1){
			for(var i=ito;i<this.children.length;i++){
				var d=this.children[i];
				if (d){
					if (d.offsetParent)
						d.offsetParent.removeChild(d);
					this.children[i]=null;
				}
			}
		}
		for(var i=ifrom;i<ito;i++){
			var div=this.children[i];
			if (!div){
				div=_this.getItem(_this.dataList[i-1],dtop);
				div.style.opacity=1;
				this.children[i]=div;
				//return;
			}
			div.style.webkitTransition="";
			if (top) {
				//maxTop = (parseFloat(div.style.top)+top);
				div.style.top= dtop+"px";
				dtop+=parseInt(div.style.height)+3;
			}
			if (left) {
				//maxTop = (parseFloat(div.style.top)+top);
				div.style.left= parseInt(div.style.left)+left+"px";
			
			}
			div.style.opacity=1;
			if (parseInt(div.style.top)<this.baseTop-30){
				div.style.opacity=0;
			}else if (parseInt(div.style.top)<this.baseTop){
				var opa=1-(this.baseTop-parseInt(div.style.top))/30;
				div.style.opacity=opa;
			}

		}

		if (dtop<document.documentElement.clientHeight+200){
			if (_this.listCount>_this.dataList.length){
				if (_this.onLoadMoreData){
					var count=_this.listCount-_this.dataList.length;
					if (count>10) count=10;
			
					_this.onLoadMoreData(_this.dataid,_this.dataList.length,count,_this.loadMoreData);
				}
			}
		}
	};
	this.loadMoreData=function(datalist){

		for(var i=0;i<datalist.length;i++){
			var data=datalist[i];
			_this.dataList.push(data);
		}
	};
}
function DataSelectList(){
	var _this=this;
	this.children=[];
	this.buttons=[];
	
	this.init=function(dom){
		this.domNode=dom;
		this.panel=dom;
	};
	this.load=function(data){
		this.dataid=data.id;
		this.datatype=data.name;
		this.UIModel=data.UIModel;
	};
	this.loadData=function(datalist){
		
		var panel=this.panel;
		var top=this.top;
		this.baseTop=this.top;
		this.dataList=datalist;
		for(var i=0;i<this.buttons.length;i++){
			var btn=this.buttons[i];
			top+= parseInt(btn.style.height)+13;
		}
		
		for(var i=0;i<datalist.length;i++){
			var data=datalist[i];
			
			if (i<30){
				var divitem=this.getItem(data);
				this.children.push(divitem);
				top+=56;
			}
			
			
		}
	};
	this.getItem=function(data,top){
		var divitem=getDiv(data.id,20,top,this.width-20,54,5,0);
		divitem.style.backgroundColor="rgba(250,250,250,0.3)";
		var controls=this.UIModel.getListItem(data);
		
		//<input type="checkbox" name="category" value="房产" />
		var chk=dui.getDataDom("input","chk_" + data.id,"checkbox",20,15,20,20,1);
		chk.type="checkbox";
		chk.style.left="";
		chk.style.right="20px";
		chk.data=data;
		for(var c=0;c<controls.length;c++){
			divitem.appendChild(controls[c]);
		}
		divitem.appendChild(chk);
		
		divitem.style.width=this.width-20+"px";
		divitem.data=data;
		divitem.chk=chk;

		divitem.onclick=function(){
			this.chk.checked=!this.chk.checked;
			this.data.isSelect=this.chk.checked;
		};
		this.panel.appendChild(divitem);
		return divitem;
	};
	this.getData=function(){
		var datalist=_this.dataList;
		var arr=[];
		for(var i=0;i<datalist.length;i++){
			var data=datalist[i];
			if (data.isSelect)
				arr.push(data);
		}
		return arr;
	};
	this.addButton=function(btn){
		this.buttons.push(btn);
		this.children.push(btn);
		
	};
	
	this.show=function(){
		var top = this.top;
		for(var i=0;i<this.children.length;i++){
			var div=this.children[i];
			div.style.opacity=1;
			div.style.top = top+"px";
			top +=  parseInt(div.style.height) +3;
		}
	};
	this.hide=function(){
		var top = this.top;
		for(var i=0;i<this.children.length;i++){
			var div=this.children[i];
			if (div) 
				div.style.opacity=0;
		}
	};
	this.remove=function(){
		var top = this.top;
		for(var i=0;i<this.children.length;i++){
			var div=this.children[i];
			if (div){
				div.style.opacity=0;
				if(div.offsetParent)
					div.offsetParent.removeChild(div);
			}
		}
	};
	this.move=function(left,top){
		if (top) this.top+=top;
		if (left) this.left+=left;
		if (this.children.length<1) return;
		var ifrom=parseInt( (this.baseTop-this.top)/56)-5;
		if (ifrom<0) ifrom=0;
		var ito=ifrom+20;
		if (ito>this.dataList.length) ito=this.dataList.length;
		var topFrom=this.top+(ifrom)*56;
		
		var dtop=topFrom;
		if (ifrom>0){
			//alert(ifrom);
			for(var i=1;i<ifrom;i++){
				var d=this.children[i];
				if (d){
					if (d.offsetParent)
						d.offsetParent.removeChild(d);
					this.children[i]=null;
				}
			}
		}
		if (ito<this.children.length-1){
			for(var i=ito;i<this.children.length;i++){
				var d=this.children[i];
				if (d){
					if (d.offsetParent)
						d.offsetParent.removeChild(d);
					this.children[i]=null;
				}
			}
		}
		
		for(var i=ifrom;i<ito;i++){
		
			var div=this.children[i];
			if (!div){
				div=_this.getItem(_this.dataList[i],dtop);
				div.style.opacity=1;
				this.children[i]=div;
			}
			div.style.webkitTransition="";
			div.style.top=dtop+"px";
			if (top) {
				dtop+=56;
			}
			
			if (left) div.style.left = (parseFloat(div.style.left)+left)+"px";
		
			if (parseInt(div.style.top)<this.baseTop-30){
				div.style.opacity=0;
			}else if (parseInt(div.style.top)<this.baseTop){
				var opa=1-(this.baseTop-parseInt(div.style.top))/30;
				div.style.opacity=opa;
			}else{
				div.style.opacity=1;
			}
		}

	};
	this.loadMoreData=function(datalist){
		if (datalist.length<1){
			_this.listCount=_this.dataList.length;
			return;
		}
		for(var i=0;i<datalist.length;i++){
			var data=datalist[i];
			_this.dataList.push(data);
		}
		
	};
}
function setStyleData(div,style){
	var obj=style;
	if (!obj) return;
	for(var p in obj){ 
		div.style[p]=obj[p];
	} 
}
function getStyleData(div){
	var obj={};
	obj.left=div.style.left+"";
	obj.top=div.style.top+"";
	obj.width=div.style.width+"";
	obj.height=div.style.height+"";
	obj.opacity=div.style.opacity+"";
	if (div.style.color) obj.color=div.style.color+"";
	if (div.style.backgroundColor) obj.backgroundColor=div.style.backgroundColor;
	if (div.style.border) obj.border=div.style.border+"";
	if (div.style.borderRadius) obj.borderRadius=div.style.borderRadius;
	if (div.style.fontSize) obj.fontSize=div.style.fontSize+"";
	if (div.style.margin) obj.margin=div.style.margin+"";
	if (div.style.padding) obj.padding=div.style.padding+"";
	
	return obj;
}
function getListItem(fields,data,left,top,width,height){
	
	var div=getDiv(data.id,left,top,width,height,5,1);
	for(var i=0;i<fields.length;i++){
		var fd=fields[i];
		var cd=null;
		if (fd.datatype=="image"){
			cd=getImage(data.id+"_"+fd.id,fd.left,fd.top,fd.width,fd.height,0,1);
		}else if(fd.datatype=="date"){
			cd=getDate();
		}else{
			cd=getDiv(data.id+"_"+fd.id,fd.left,fd.top,fd.width,fd.height,0,1);
		}
		div.appendChild(cd);
	}
	return div;
}

function getImage(id,left,top,width,height,radius,opacity){
	
	var div=dui.getDataDom("div",id,"imagepanel",left,top,width,height,opacity);
	div.style.webkitTransition="all 0.5s ease-in-out";
	var img=dui.getDataDom("img","img_"+id,"",0,0,"100%","100%",1);
	img.style.webkitTransition="all 0.5s ease-in-out";
	img.style.maxHeight="100%";
	img.style.borderRadius=radius+"px";
	//img.style.maxWidth="100%";
	div.style.overflow="hidden";
	div.appendChild(img);
	div.image=img;
	div.resize=function(width,height){
		
		if (width!="auto" && width!="100%"){
			div.style.width=width+"px";
			div.style.height=height+"px";
			var iheight=height;
			var iwidth=height/img.domNode.naturalHeight*img.domNode.naturalWidth;
			if (iwidth>width){
				iwidth=width;
				iheight=width/img.domNode.naturalWidth*img.domNode.naturalHeight;
			}
			img.style.width=iwidth+"px";
			img.style.height=iheight+"px";
	
			img.domNode.style.left=(width-iwidth)/2+"px";
			img.domNode.style.top=(height-iheight)/2+"px";
			img.domNode.style.maxWidth="";
			img.domNode.style.maxHeight="";
		    img.domNode.style.opacity=1;
	    }
	}
	Object.defineProperties(div,{
	    src:{
	        get:function(){
	        	if (this.domNode){
	            	return img.domNode.src;
	            }else{
	            	return this._src;
	            }
	        },
	        set:function(newValue){
	        	this._src=newValue;
	        	if (this.domNode){
	            	img.domNode.src=newValue;
	          
	            	img.style.width="100%";
	            	img.style.height="100%";
	            	img.style.display="block";
	            	img.style.left="0px";
	            	img.style.top="0px";
	            	
	            	div.style.display="";
	            	div.style.opacity=1;
	            	img.setMovie(false);
	            	//img.style.margin="0 auto";
	            	img.domNode.onload=function(){
	            		img.setMovie(false);
	            		div.resize(parseFloat(div.style.width),parseFloat(div.style.height))
	            	}
	            }
	        }
	    }
	});
	
	return div;
}
function getDiv(id,left,top,width,height,radius,opacity){
	var dom=dui.getDataDom("div",id,"",left,top,width,height,opacity);
	return dom;
}
function getFile(id,left,top,width,height,radius,opacity){
	
	var div=null;
	if ($("#"+id).length>0){
		div=$("#"+id)[0];
	}else{
		div=document.createElement("input");
		div.setAttribute("type","file");
		div.id=id;
		//document.body.appendChild(div);
		div.style.width=width + "px";
		div.style.height=height+'px';
	}
	
	div.style.position="absolute";
	div.style.left= left+"px";
	div.style.top= top+"px";
	div.style.borderRadius=radius+"px";
	div.style.opacity=opacity;
	
	div.style.webkitTransition="all 0.5s ease-in-out";
	
	return div;
}
function getDataItem(id,title,top,width){
	var div=dui.getDataDom("div","div"+id,"dataitem",5,top,width-10,36,0);
	var lab=dui.getDataDom("div","lab"+id,"datalabel",10,5,100,20,1);
	lab.style.textAlign="left";
	lab.textContent=title;
	var txt=dui.getDataDom("input","txt"+id,"text",90,5,width-120,20,1);
	txt.dataid=id;
	
	div.appendChild(lab);
	div.appendChild(txt);

	return div;
}

/*
function getLine(id,left,top,width,height,radius,opacity){
	
	var div=null;
	if ($("#"+id).length>0){
		div=$("#"+id)[0];
	}else{
		div=document.createElement("div");
		div.id=id;
		document.body.appendChild(div);
	}
	
	div.style.position="absolute";
	div.style.left= left+"px";
	div.style.top= top+"px";
	div.style.width=width + "px";
	div.style.height=height+'px';
	div.style.opacity=opacity;
	
	div.style.webkitTransition="all 0.5s ease-in-out";
	div.style.backgroundColor="rgba(250,250,250,0.6)";

	return div;
}
*/
function getButton(id,left,top,width,height,radius,opacity){

	var dom=dui.getDataDom("div",id,"dbutton",left,top,width,height,opacity);
	return dom;
	//_this.dataNodes.push(divData);
}
function getImgFile(id,left,top,width,height,radius,opacity){

	var div=dui.getDataDom("div","div_"+id,"",left,top,width,height,opacity);
	var txt=dui.getDataDom("input",id,"text",-1000,0,0,1,1);
	var lab=dui.getDataDom("label","lab_"+id,"",0,0,width,height,1);
	txt.dataid=id;
	var file=getFile("file_"+id,0,0,1,1,0,0);
	file.setAttribute("accept","image/*");
	file.setAttribute("capture","camera");
	file.style.zIndex=20;
	file.style.opacity=0;
	
	lab.textContent="拍照上传";
	div.appendChild(txt);
	
	div.appendChild(file);
	div.appendChild(lab);
	lab.style.zIndex=200;
	lab.setAttribute("for","file_"+id);
	lab.style.borderRadius="5px";
	lab.style.backgroundColor="rgba(0,0,0,0.4)";
	lab.style.color="rgba(250,250,250,0.8)";
	lab.style.lineHeight=height+"px";
	lab.style.textAlign="center";
	lab.style.width="100%";
	lab.style.height="30px";
	lab.style.lineHeight="30px";
	div.value="";
	file.onchange=function(){
		//this.img.src=this.value;
		var session=JSON.stringify(getSession());
		var formData = new FormData();
		formData.append("auth",session);
		formData.append("file", this.files[0]); 
		$.ajax({ 
			url : urlServer + '/Data/FileService/upload',
			type : 'POST', 
			data : formData,
			processData : false, 
			contentType : false,
			dataType:"json",
			success : function(rtn) { 
				//alert(rtn.value);
				txt.value=rtn.value;
				div.value=rtn.value;
				div.imageUrl=urlServer + "\\" + rtn.value;
				if (div.value){
					if (div.onupload){
						div.onupload(div);
					}
				}
			}, 
			error : function(responseStr) { 
				console.log("error");
			} 
		});
	};
	
	return div;
	
}
//得到一个图片上传组件
function getImageFile(id,left,top,width,height,opacity){

	var div=dui.getDataDom("div","div_"+id,"",left,top,width,height,opacity);
	var txt=dui.getDataDom("input",id,"text",-1000,0,0,1,1);
	var lab=dui.getDataDom("label","lab_"+id,"",0,0,width,height,1);
	txt.dataid=id;

	lab.textContent="拍照上传";
	div.appendChild(txt);
	
	div.appendChild(lab);
	lab.style.zIndex=200;
	lab.setAttribute("for","file_"+id);
	lab.style.borderRadius="5px";
	lab.style.backgroundColor="rgba(0,0,0,0.4)";
	lab.style.color="rgba(250,250,250,0.8)";
	lab.style.lineHeight=height+"px";
	lab.style.textAlign="center";
	lab.style.width="100%";
	lab.style.height="30px";
	lab.style.lineHeight="30px";
	div.value="";
	
	lab.onclick=function(){
		var tWidth=document.documentElement.clientWidth;
		var tHeight=document.documentElement.clientHeight;
		if (div.imageWidth) tWidth=div.imageWidth;
		if (div.imageHeight) tHeight=div.imageHeight;
		
		api.getPicture({
		    sourceType: 'camera',
		    encodingType: 'jpg',
		    mediaValue: 'pic',
		    destinationType: 'url',
		    allowEdit: true,
		    quality: 100,
		    targetWidth: tWidth,
		    targetHeight: tHeight,
		    saveToPhotoAlbum: false
		}, function(ret, err) {
		    if (ret && ret.data) {
		    	
		     	var returnUrl=ret.data;
		     	
		     	if (div.image) 
		     		div.image.src=returnUrl;

		     	uploadFile(returnUrl,function(rtn){
		     		if (rtn.value){
		  				alert(rtn.value);
			     		txt.value=rtn.value;
			     		div.value=rtn.value;
			     		div.imageUrl=urlServer + "\\" + rtn.value;
			     		div.onupload(div);
		     		}
		     	});
		     	
		    }else{
		        alert(JSON.stringify(err));
		    }
		});
	}
	
	/*
	file.onchange=function(){
		//this.img.src=this.value;
		var session=JSON.stringify(getSession());
		var formData = new FormData();
		formData.append("auth",session);
		formData.append("file", this.files[0]); 
		$.ajax({ 
			url : urlServer + '/Data/FileService/upload',
			type : 'POST', 
			data : formData,
			processData : false, 
			contentType : false,
			dataType:"json",
			success : function(rtn) { 
				//alert(rtn.value);
				txt.value=rtn.value;
				div.value=rtn.value;
				div.imageUrl=urlServer + "\\" + rtn.value;
				if (div.value){
					if (div.onupload){
						div.onupload(div);
					}
				}
			}, 
			error : function(responseStr) { 
				console.log("error");
			} 
		});
	};
	*/
	return div;
	
}
function uploadFile(file,callback) {
	var session=JSON.stringify(getSession());
    api.ajax({
        url : urlServer+'/Data/FileService/upload',
        method:'post',
        timeout:30,
        dataType:'json',
        returnAll:false,
        data:{
        	auth:session,
            files:{"file":file}
        }
    }, function(rtn) {
        if (rtn.value) {
            callback(rtn);
        } else if (rtn.error) {
            alert("上传失败");
        }
    });
}
function CssStyle(){
	
	var style=document.createElement("style");
  	document.head.appendChild(style);
  	var sheet=style.sheet;
  	
    this.addKeyFrames=function (name){
    	var obj={};
	  	obj.name=name;

	  	sheet.insertRule("@-webkit-keyframes "+ name +" {}",0);
	  	var keyframes=sheet.rules[0];
	  	obj.keyFrames=keyframes;
		obj.addkey=function(i,key){
			i=parseInt(i);
			
		  	this.keyFrames.appendRule(i+"% {"+key+"}");
		};
		return obj;
	};
	this.remove=function(){
		for(var i=style.sheet.rules.length-1;i>=0;i--){
			style.sheet.deleteRule(i);
		}
		document.head.removeChild(style);
	};
}

function DataDom(tagName,id,cssName){
	var _this=this;
	this.id=id;
	this.tagName=tagName;
	this.cssName=cssName;
	if (!cssName) 
		this.cssName="d"+tagName;
	
	this.domNode=null;
	this.children=[];
	this._left=0;
	this._top=0;
	this._width=0;
	this._height=0;
	Object.defineProperties(_this,{
	    textContent:{
	        get:function(){
	        	if (this.domNode){
	            	return this.domNode.textContent;
	            }else{
	            	return this.text;
	            }
	        },
	        set:function(newValue){
	        	this.text=newValue;
	        	if (this.domNode){
	            	this.domNode.textContent=newValue;
	            }
	        }
	    }
	});
	Object.defineProperties(_this,{
	    value:{
	        get:function(){
	        	if (this.domNode){
	        		if (this.datatype=="bool" || this.domNode.type=="checkbox"){
	        			return this.domNode.checked;
	        		}else if(this.datatype=="datetime"){
	        			var dt=this.domNode.value;
	        			return new Date(dt).Format("yyyy-MM-dd hh:mm:ss");
	        		}else if(this.datatype=="number"){
	        			return parseFloat(this.domNode.value);
	        		}else{
	            		return this.domNode.value;
	            	}
	            }else{
	            	return this._value;
	            }
	        },
	        set:function(newValue){
	        	this._value=newValue;
	        	if (this.domNode){
	            	if (this.datatype=="bool" || this.domNode.type=="checkbox"){
	        			this.domNode.checked=newValue;
	        		}else if(this.datatype=="datetime"){
	        			var v=newValue.substring(0,10);
	        			this.domNode.value=v;
	        		
	        		}else{
	            		this.domNode.value=newValue;
	            	}
	            }
	        }
	    }
	});
	Object.defineProperties(_this,{
	    top:{
	        get:function(){
	        	if (this.domNode){
	            	return parseFloat(this.domNode.style.top);
	            }else{
	            	return this._top;
	            }
	        },
	        set:function(newValue){
	        	this._top=newValue;
	        	if (this.domNode){
	            	this.domNode.style.top=newValue+"px";
	            }
	        }
	    }
	});
	Object.defineProperties(_this,{
	    left:{
	        get:function(){
	        	if (this.domNode){
	            	return parseFloat(this.domNode.style.left);
	            }else{
	            	return this._left;
	            }
	        },
	        set:function(newValue){
	        	this._left=newValue;
	        	if (this.domNode){
	            	this.domNode.style.left=newValue+"px";
	            }
	        }
	    }
	});
	Object.defineProperties(_this,{
	    width:{
	        get:function(){
	        	if (this.domNode){
	            	return parseFloat(this.domNode.style.width);
	            }else{
	            	return this._width;
	            }
	        },
	        set:function(newValue){
	        	this._width=newValue;
	        	if (this.domNode){
	            	this.domNode.style.width=newValue+"px";
	            }
	        }
	    }
	});
	Object.defineProperties(_this,{
	    height:{
	        get:function(){
	        	if (this.domNode){
	            	return parseFloat(this.domNode.style.height);
	            }else{
	            	return this._height;
	            }
	        },
	        set:function(newValue){
	        	this._height=newValue;
	        	if (this.domNode){
	            	this.domNode.style.height=newValue+"px";
	            }
	        }
	    }
	});
	Object.defineProperties(_this,{
	    className:{
	        get:function(){
	        	if (this.domNode){
	            	return this.domNode.getAttribute("class");
	            }else{
	            	return this._cssName;
	            }
	        },
	        set:function(newValue){
	        	this._cssName=newValue;
	        	if (this.domNode){
	            	this.domNode.setAttribute("class",newValue);
	            }
	        }
	    }
	});
	this.createDom=function(){
		var dom=document.getElementById(_this.id);
		this.newDom=false;
		if (!dom){
			var dom=document.createElement(tagName);
			dom.setAttribute("id",this.id);
			dom.style.position="absolute";
			document.body.appendChild(dom);
			this.newDom=true;
		}
		
		dom.style.webkitTransition="all 0.5s ease-in-out";
		dom.setAttribute("class",this.cssName);
		
		if (this.tagName=="input"){
			dom.setAttribute("type",this.cssName);
		}
		dom.style.opacity=0;
		
		this.domNode=dom;
		this.style=dom.style;
	};
	this.setAttribute=function(pro,value){
		if (this.domNode){
			this.domNode.setAttribute(pro,value);
		}
	};
	this.init=function(){
		this.createDom();
		this.active();
	};
	this.setText=function(text){
		this.text=text;
		this.domNode.textContent=text;
	};
	//处理事件
	this.active=function(){
		if (this.domNode){
			this.domNode.onclick=function(){
				if (_this.onclick) 
					_this.onclick(_this);
			};
		}
	};
	this.moveTo=function(left,top){
		_this._left=left;
		_this._top=top;
		if (this.domNode){
			_this.domNode.style.left=left+"px";
			_this.domNode.style.top=top+"px";
		}
	};
	this.move=function(left,top){
		if(left) _this._left+=left;
		if(top) _this._top+=top;
		if (this.domNode){
			if(left) _this.domNode.style.left=parseFloat(_this.domNode.style.left) + left +"px";
			if(top) _this.domNode.style.top=parseFloat(_this.domNode.style.top)+top+"px";
		}
	};
	this.size=function(width,height){
		_this._width=width;
		_this._height=height;
		if (_this.domNode){
			if (typeof width != "string"){
				_this.domNode.style.width=width+"px";
			}else{
				_this.domNode.style.width=width;
			}
			if (typeof height != "string"){
				_this.domNode.style.height=height+"px";
			}else{
				_this.domNode.style.height=height;
			}
		}
	};
	this.show=function(){
		this.visible=true;
		if (this.domNode){
			this.domNode.style.display="";
			this.domNode.style.opacity=1;
		}
	};
	this.hide=function(){
		this.visible=false;
		if (this.domNode)
			this.domNode.style.opacity=0;
	};
	this.backupData=function(){
		if (this.children.length<1)
			this.oldTextContent=this.textContent;
		this.oldClass=this.className;
		this.oldStyle=getStyleData(this.domNode);
	};
	this.restoreData=function(){
		if (this.children.length<1 && this.oldTextContent)
			this.textContent=this.oldTextContent;
		this.className=this.oldClass;
		setStyleData(this.domNode,this.oldStyle);
	};
	this.destroy=function(){
		if (_this.domNode){
			_this.style=getStyleData(_this.domNode);
			_this.text=_this.domNode.textContent;
			if (_this.domNode.parentNode){
				_this.domNode.parentNode.removeChild(_this.domNode);
			}
			_this.domNode=null;
		}
	};
	this.clear=function(){
		if (_this.domNode){
			_this.children=[];
			_this.domNode.innerHTML="";
			
		}
	};
	this.setAttribute=function(att,value){
		if (_this.domNode){
			_this.domNode.setAttribute(att,value);
		}
	};
	this.setMovie=function(bmovie){
		if (_this.domNode){
			if (bmovie)
				_this.domNode.style.webkitTransition="all 0.5s ease-in-out";
			else
				_this.domNode.style.webkitTransition="";
		}
	};
	this.appendChild=function(cd){
		if (this.domNode){
			if (cd instanceof DataDom){
				cd.parent=this;
				this.children.push(cd);
				this.domNode.appendChild(cd.domNode);
			}else{
				cd.parent=this;
				this.children.push(cd);
				this.domNode.appendChild(cd);
			}
			
		}
	};
	this.removeChild=function(cd){
		if (this.domNode){
			if (cd instanceof DataDom){
				this.domNode.removeChild(cd.domNode);
			}else{
				this.domNode.removeChild(cd);
			}
		}
	};
	this.rebuild=function(){
		if (!_this.domNode){
			_this.dui.getDataDom();
			_this.moveTo(_this.left,_this.top);
			_this.size(_this.width,_this.height);
			_this.setText(_this.text);
			setStyleData(_this.domNode,_this.style);
			if (_this.visible){
				_this.show();
			}
			_this.active();
		}
	};
};
var DUI=function(){
	var _this=this;
	this.winList=[];
	
	this.getDataDom=function(tagName,id,cssName,left,top,width,height,visible){
		var dom=new DataDom(tagName,id,cssName);
		dom.init();
		dom.moveTo(left,top);
		dom.size(width,height);
		if (visible){
			dom.show();
		}
		return dom;
	};
	Object.defineProperties(_this,{
	    curWindow:{
	        get:function(){
	        	return _this._curWindow;
	        },
	    }
	});
	this.openChildWindow=function(winClass,dataInfo,dnode,defaultData){
		var cwin=_this.openWindow(winClass,dataInfo,dnode,"extend");
		cwin.defaultData=defaultData;
	};
	this.openWindow=function(winClass,dataInfo,dnode,option,backOption){		
		var dwidth=document.documentElement.clientWidth;
		var dheight=document.documentElement.clientHeight;
		if (dnode){
			if (dnode.backupData){
				dnode.backupData();
			}
		}
		
		if (_this._curWindow){
			
			_this.winList.push(_this._curWindow);
			
			if (!option){
				if (dnode){
					var x= parseInt (dnode.style.left)+parseInt(dnode.style.width)/2;
					var y= parseInt (dnode.style.top)+parseInt(dnode.style.height)/2;
					if ((x-dwidth/2)>dwidth/5){
						option="left";
					}
					if ((x-dwidth/2)<-dwidth/5){
						option="right";
					}
					if ((y-dheight/2)>dheight/4){
						option="top";
					}
				}
			}
			if(option=="hide"){
				_this._curWindow.hide();
			}else if (option=="left"){
				_this._curWindow.move(-dwidth,0);
			}else if (option=="right"){
				_this._curWindow.move(-dwidth,0);
			}else if (option=="top"){
				_this._curWindow.move(0,-dheight);
			}else if (option=="bottom"){
				_this._curWindow.move(0,dheight);
			}
			_this._curWindow.hideOption=option;
		}
		
		
		var win=new winClass(dataInfo.id,dataInfo.title);
		_this._curWindow=win;
		
		win.init(dnode);
		win.backOption=backOption;
		window.setTimeout(function(){
			win.load(dataInfo);
			
			win.show(option);
		},500);
		return win;
	};
	this.onDataEvent=function(win,control,dataName,eventName){
		if (!eventName) eventName="onclick";
		for(var i=0;i<uics.length;i++){
			var cs=uics[i];
			var winClass=getWinClass(cs.window);
			if (winClass){
				var ctlClass=eval(cs.control);
				if (win instanceof winClass && control instanceof ctlClass && eventName==cs.event && $.inArray(dataName, cs.dataNames)>=0){
					var func=eval("_this."+cs.mothod);
					var p0=eval(cs.newWindow);
					
					var p1=eval(cs.params[0]);
					var p2=eval(cs.params[1]);
					var p3=cs.params[2];
					if (p3.indexOf(".")>0)
						p3=eval(p3);
					
					func(p0,p1,p2,p3);
					
				}
			}
		}
	};
	function getWinClass(funcName) {
	    try {
	    	var cls=eval(funcName);
	        if (typeof(cls) == "function") {
	            return cls;
	        }
	    } catch(e) {}
	    return null;
	}
	this.onDataChanged=function(dataname,oldData,data,callback){
		var ds=data_Scheme[dataname];
		if (!ds) return;
		var uimodel=ds.UIModel;
		if (uimodel.onDataChanged){
			uimodel.onDataChanged(oldData,data);
		}
		var win= this._curWindow;
		if (win.onDataChanged){
			win.onDataChanged(dataname,oldData,data);
		}
	}
	this.goBack=function(){
		var dwidth=document.documentElement.clientWidth;
		var dheight=document.documentElement.clientHeight;
		if (_this.winList.length<1) return false;
		var curwin=_this.curWindow;
		var oldwin=_this.winList.pop();
		var posi=oldwin.hideOption;
		
		if (posi=="left"){
			curwin.move(dwidth,0);
			oldwin.move(dwidth,0);
		}else if(posi=="right"){
			curwin.move(-dwidth,0);
			oldwin.move(-dwidth,0);
		}else if(posi=="top"){
			curwin.move(0,dheight);
			oldwin.move(0,dheight);
		}else if(posi=="bottom"){
			curwin.move(0,-dheight);
			oldwin.move(0,-dheight);
		}else{
			curwin.hide();
		}
		if (oldwin.isDestroy && oldwin.dataInfo) 
			oldwin.load(oldwin.dataInfo);
		if (curwin.curnode){
			if (curwin.curnode.loadData){
				curwin.curnode.loadData();
			}
			if (curwin.curnode.oldStyle &&  curwin.curnode.restoreData){
				curwin.curnode.restoreData();
			}
		}

		_this._curWindow=oldwin;
		window.setTimeout(function(){
			oldwin.show(oldwin.hideOption);
			oldwin.hideOption="";
		},500);
		window.setTimeout(function(){
			curwin.destroy();
		},1000);
		return true;
	};
	this.input=function(data,div,callback){
		var winput=new WinInput(data.id,data.title);
		winput.init(div);
		
		winput.load(data.dataInfo);
		winput.show();
		winput.onClose=callback;
		return winput;
	};
};
var dui=new DUI();
HTMLElement.prototype.move=function(x,y){
	var oldLeft=parseFloat( this.style.left);
	var oldTop=parseFloat( this.style.top);
	if (x!=0) this.style.left=oldLeft+x+"px";
	if (y!=0) this.style.top=oldTop+y+"px";
};
HTMLElement.prototype.show=function(){
	this.style.opacity=1;
	if (this.style.display=="none")
		this.style.display="";
};
HTMLElement.prototype.hide=function(){
	this.style.opacity=0;
};
HTMLElement.prototype.setMovie=function(bmovie){
	if (bmovie)
		this.style.webkitTransition="all 0.5s ease-in-out";
	else
		this.style.webkitTransition="";
};
/*
Object.prototype.toText=function(){
	if (this.name) return this.name;
	if (this.text) return this.text;
	if (this.message) return this.message;
	if (this.content) return this.content;
	return "";
}
*/

function guid() {
    function S4() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}