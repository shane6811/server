function WinShare(id,title){
	var _this=this;
	var dwin;
	this.init=function(div){
		dwin=new DataForm();
		dwin.width=document.documentElement.clientWidth;
		dwin.init(div);
		this.domNode=div;
	}
	this.load=function(dataInfo){
		
		dwin.top=100;
		this.dataInfo=dataInfo;
		dwin.load(dataInfo);
		dwin.btnOk.textContent="签字确认";
		dwin.btnShare.textContent="拒绝签字";
		dwin.onSignData=_this.sign;
		dwin.onUnSignData=_this.unsign;
		dwin.onClose=_this.cancel;
	}
	this.sign=function(){
		var sid=_this.shareInfo.id;
		var dataname=_this.shareInfo.mydataname;
		var data=_this.data;
		shareService.signData(sid,dataname,data,function(rtn){
			$.alert("签字成功");
		});
	}
	this.unsign=function(){
		var sid=_this.shareInfo.id;
		var dataname=_this.shareInfo.mydataname;
		var data=_this.data;
		shareService.unSignData(sid,dataname,data,function(rtn){
			$.alert("拒签成功");
		});
	}
	this.cancel=function(){
		_this.onclose();
		_this.domNode.destroy();
	}
	this.loadData=function(data){
		data.state="beshared";
		_this.data=data;
		dwin.setData(data);
	}
	this.show=function(){
		dwin.show();
	}
	this.hide=function(){
		dwin.hide();
	}
}
WinShare.prototype = new DWindow();
WinShare.prototype.constructor = WinShare;