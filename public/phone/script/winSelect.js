function WinSelect(id,title){
	
	DWindow.apply(this, arguments);
	var _this=this;
	var dlist;
	var dform;
	this.init=function(div){
		this.events.init();

		this.children=[];
		
		var div2=dui.getDataDom("div","divSelect","",0,0,this.width,this.height,1);
		
		this.domNode=div2;
	}
	this.load=function(dataInfo){
		
		this.dataInfo=dataInfo;
		
		//div.textContent="";
		dlist=new DataSelectList();
		dlist.init(this.domNode);
		dlist.listCount=200;
		dlist.load(dataInfo);

		//div.textContent=data.name;

		_this.winTitle.textContent="选择手机联系人";
		_this.winTitle.btnLeft.textContent="返回";

		_this.winTitle.btnRight.textContent="确定";
		_this.winTitle.btnRight.onclick=_this.onselect;
		
		//var header=getWindowHeader(this.id+"_Header",data.name);
		//div.appendChild(header);
		dlist.top=70;
		dlist.width=this.width-20;
		dlist.page=0;
		this.children.push(this.domNode);
		//this.children.push(dlist);
		/*
		dataService.getDataList(data.id,"",0,0,function(rtn){
			var arr=rtn.value;
		
			//arr.push({id:2,photo:"touxiang.png",name:"李四",phone:"13512341234",money:1000,level:2});
			//arr.push({id:3,photo:"touxiang.png",name:"王五",phone:"13612341234",money:2000,level:4});
			//arr.push({id:4,photo:"touxiang.png",name:"赵六",phone:"13812341234",money:4000,level:2});
			
			dlist.loadData(arr);
			//dlist.onDataEdit=_this.onDataEdit;
			dlist.onDataClick=_this.onItemClick;
			dlist.show();
		})
		*/
		getContacts(0,200,this.loadData);
	}
	this.loadData=function(datalist){
		dlist.loadData(datalist);
		_this.show();
	}
	this.onselect=function(){
		var arr=dlist.getData();
		if (_this.onDataSelect)
			_this.onDataSelect(arr);
	}
	this.show=function(){
		this.domNode.style.opacity=1;
		for(var i=0;i<this.children.length;i++){
			var cd=this.children[i];
			cd.style.opacity=1;
		}
		//this.btnBack.style.opacity=1;
		//this.btnMore.style.opacity=1;
		dlist.show();
	}
	this.hide=function(){
		dlist.hide();
	}
	this.move=function (left,top){
		this.domNode.move(left,top);
		dlist.move(left,top);
	}
	function getPhone(con){
		var phones=con.phones;
		for(var i=0;i<phones.length;i++){
			var ph=phones[i];
			for(var f in ph){ 
				if(typeof(ph[f])=="string"){ 
					// p 为属性名称，obj[p]为对应属性的值
					//props+= p + "=" + obj[p] + "\t";
					var val=ph[f];
					val=val.replace(/-/g, "");
					//val=val.replace(/(/g, "");
					//val=val.replace(/)/g, "");
					if (val.length==11 && val[0]=="1")
						return val;
				};
			} 
		}
		return "";
	}
		
		//loadContacts([{id:1,name:"张三",phone:"1"},{id:2,name:"李四",phone:"12"}]);
	function getContacts(page,size,callback){
		
		
		if (!inPhone){
			callback([{id:1,name:"张三",phone:"1"},{id:2,name:"李四",phone:"12"}]);
			return;
		}
		var contacts = api.require('contacts');
		contacts.queryByPage({
		    count: size,
		    pageIndex: page
		}, function(ret, err) {
		    if (ret) {
		    	var arr=[];
		        if (!ret.contacts){
		        	callback(arr);
		        }
		        var list=ret.contacts;
		        if (list){
			        for(var i=0;i<list.length;i++){
			        	var item=list[i];
			        	var obj={name:item.fullName};
			        	obj.id="contact_"+i;
			        	obj.phone=getPhone(item);
			        	if (obj.phone) arr.push(obj);
			        }
			        callback(arr);
		        }else{

		        }
		    } 
		});
	}
	this.hide=function(){
		this.domNode.style.opacity=1;
		setStyleData(this.domNode,this.domNode.oldStyle);
		for(var i=0;i<this.children.length;i++){
			var cd=this.children[i];
			cd.style.opacity=0;
		}

		dlist.hide();
		
	}
	this.remove=function(){
		dlist.remove();
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
			//dlist.move(0,40-dlist.top);
		}

		return;
	}
	this.events.ontouchmove=ontouch;
	this.events.ontouchend=ontouchend;
}
WinSelect.prototype = new DWindow();
WinSelect.prototype.constructor = WinSelect;