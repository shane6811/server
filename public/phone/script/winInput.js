function WinInput(id,title){
	var _this=this;
	var curnode;
	this.id=id;
	this.title=title;
	this.children=[];
	this.width=document.documentElement.clientWidth*0.8;
	this.init=function(div){
		this.domNode=div;
	}
	this.load=function(dataInfo){
		this.dataInfo=dataInfo;
		var divTitle=dui.getDataDom("div",this.id+"_title","",0,0,this.width,25,0,1);
		divTitle.textContent=_this.title;
		divTitle.style.backgroundColor="rgba(250,250,250,0.2)";
		divTitle.style.textAlign="center";
		var panel=this.domNode;
		
		panel.className="inputBox";
		panel.style.left=(document.documentElement.clientWidth-this.width)/2+"px";
		panel.style.width=this.width+"px";
		panel.style.height="120px";
		
		divTitle.textContent=dataInfo.name;
		
		for(var i=0;i<panel.children.length;i++){
			var cd=panel.children[i];
			cd.style.opacity=0;
		}
		
		var txt=dui.getDataDom("input",this.id+"_input","text",20,30,this.width-40,25,0);
		txt.setAttribute("placeHolder","请输入"+_this.title);
		
		txt.style.backgroundColor="rgba(250,250,250,0.6)";
		txt.style.border="1px solid rgba(50,50,50,0.3)";
		txt.style.margin="5px";
		txt.style.padding="2px 2px 2px 8px";
		txt.style.fontSize="14px";
		if (dataInfo.datatype=="number"){
			txt.style.imeMode='disabled';
			txt.setAttribute("type","number");
		}
		txt.style.webkitTransition="all 1s ease-in-out";
		txt.value=dataInfo.value;
		this.input=txt;
		
		var btn1=getButton(this.id+"_ok",this.width/12,60,this.width/3,25,5,0);
		btn1.style.webkitTransition="all 1s ease-in-out";
		btn1.textContent="确定";
		btn1.style.fontSize="14px";
		var btn2=getButton(this.id+"_cancel",this.width/2+5,60,this.width/3,26,5,0);
		btn2.textContent="取消";
		btn2.style.fontSize="14px";
		btn2.style.webkitTransition="all 1s ease-in-out";

		btn1.style.width=this.width/3+"px";
		btn2.style.width=this.width/3+"px";
		btn1.style.height="25px";
		btn2.style.height="25px";
		btn1.style.bottom="12px";
		btn2.style.bottom="12px";
		btn1.style.top="";
		btn2.style.top="";
		
		btn2.onclick=function(){
			var rtn={ok:false,cancel:true,value:null}; 
			_this.onClose(rtn);
			_this.hide();
		}
		btn1.onclick=function(){
			 var rtn={ok:true,cancel:false};
			 rtn.dataname=dataInfo.name;
			 rtn.value=txt.value; 
			_this.onClose(rtn);
			_this.hide();
		}
		
		panel.appendChild(divTitle);
		panel.appendChild(txt);
		panel.appendChild(btn1);
		panel.appendChild(btn2);
		this.children=[];
		this.children.push(divTitle);
		this.children.push(txt);
		this.children.push(btn1);
		this.children.push(btn2);
	}

	this.setValue=function(value){
		this.input.value=value;
	}
	this.getValue=function(){
		return this.input.value;
	}
	this.show=function(){
		this.domNode.style.opacity=1;
		for(var i=0;i<this.children.length;i++){
			var cd=this.children[i];
			cd.style.opacity=1;
		}
	}
	this.hide=function(){
		this.domNode.style.opacity=0;
		for(var i=0;i<this.children.length;i++){
			var cd=this.children[i];
			cd.style.opacity=0;
		}
	}
	this.remove=function(){
		for(var i=this.children.length-1;i>=0;i--){
			var cd=this.children[i];
			this.domNode.removeChild(cd);
		}
	}
}
WinInput.prototype = new DWindow();
WinInput.prototype.constructor = WinInput;