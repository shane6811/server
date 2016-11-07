function WinData(id,title){
	var _this=this;
	var curnode;
	var dflow;
	var dform;
	this.init=function(flow){
		curnode=flow.curnode;
		dflow=flow;
		dform=new DataForm();
		dform.init(curnode);
		curnode.onclick="";
		this.curnode=curnode;
	}
	this.load=function(dataInfo){
		
		this.dataInfo=dataInfo;
		curnode.textContent="";

		dform.width=this.width-50;
		dform.defaultData=_this.defaultData;
		dform.load(dataInfo);
		
		dform.datatype=dataInfo.id;
		dform.dataInfo=dataInfo;
		dform.onClose=this.cancel;
		
		dform.onSaveClick=function(){_this.ok()}
		dform.onSaveData=function(){_this.saveData()}
		dform.onSignData=function(){_this.signData()}
		dform.onUnSignData=function(){_this.unSignData()}
		dform.onShowImage=_this.showImage;
		
		dform.onMoreData=this.loadMore;
		dform.onDataShare=this.onDataShare;
		dform.onDataDelete=this.onDataDelete;
		if (dflow.curnode.data) 
			dform.setData(dflow.curnode.data);
		dform.onresize=function(){
			dflow.relayer();
		}		

	}
	this.showImage=function(){
		dflow.hide();
		var img=dform.image;
		dflow.dataNode.hide();
		dform.domNode.show();
		dui.openWindow(WinImage,dform.dataInfo,dform,"hide");
		
	}
	this.sendShareData=function(shareInfo){
		var data=shareInfo.data;
		data.shareid=shareInfo.id;
		data.state="share";
		
		shareService.shareData(shareInfo,function(rtn){
			
			weiXin_Share(dform.dataInfo.name,"总金额："+shareInfo.data.money, "phone/html/share.html?sid="+shareInfo.id);
			_this.close();
		});
	}
	this.onDataDelete=function(){
		var data=dform.data;
		var dataname=this.dataInfo.id;
		dataService.deleteData(dataname,data,function(rtn){
			_this.close();
			curnode.destroy();
		});
	}
	this.onDataShare=function(){
		_this.saveData(function(){_this.shareData();});
	}
	this.shareData=function(){
		var data=dform.getData();
		//if (weiXin.inited){
		
		var dataid=this.dataInfo.id;
		var userDataId="";
		if (dataid=="Invoice" || dataid=="Income"){
			userDataId="Customer";
		}else if(dataid=="Expenditure" || dataid=="Purchase"){
			userDataId="Supplier";
		}
		
		var username=data[userDataId.toLowerCase()];
		var shareInfo={};
		
		if(data.state=="sign"){
			$.alert("对方已经签字确认，不能再次发送");
			return;
		}
		shareInfo.id=guid();
		shareInfo.fromuser=loginUser;
		shareInfo.dataname=dform.dataInfo.id;
		shareInfo.dataid=data.id;
		shareInfo.message= loginUserName + "发给您一份总金额为"+data.money+"的"+dform.dataInfo.name+",请确认。";
		shareInfo.data=data;
			
		dataService.getDataList(userDataId,{$or:[{name:username},{phone:username}]},0,0,function(rtn){
			
			var arr=rtn.value;
			if (arr.length>0){
				var touser=arr[0];
				
				if (touser.dbname){
					//说明用户已经是注册用户，直接发送相关消息
					shareInfo.touser=touser;
					_this.sendShareData(shareInfo);
					
				}else if (touser.phone){
					shareInfo.touser=touser;
					loginService.autoCreateUser(loginUser,touser,function(rtn2){
						shareInfo.touser.dbname=rtn2.value.dbname;
						_this.sendShareData(shareInfo);
						dataService.saveData(userDataId,touser,function(rtn3){
							
						});
					})
					//用户有手机号，但是尚未注册，自动注册一个用户
				}else{
					//同样需要输入对方的手机号
					$.alert("您选择的用户没有设置手机号，无法分享！");
				}
				
			}else{
				//在这里应该要求用户输入手机号，而后创建客户档案
				//alert(0);
			}
			
		});
		return;
		
		
		//}
	}
	this.loadMore=function(){
		
		dflow.hide();
		dflow.dataNode.hide();
		dform.showFullScreen();
		dform.domNode.show();
		_this.winTitle.textContent=dform.title;
		_this.winTitle.style.opacity=1;
		_this.winTitle.style.display="";
		
	};
	this.ok=function(){
		_this.saveData(function(oldData,data){
			_this.close();
			dui.onDataChanged(data.type,oldData,data);
		});
	};
	this.signData=function(callback){
		var data=dform.getData();
		if(data.state="beshared"){
			shareService.signData("",_this.dataInfo.id,data,function(rtn){
				alert("签字成功");
			});
		}
	}
	this.unSignData=function(callback){
		var data=dform.getData();
		var dataid=data.id;
		var dataname=data.type;
		shareService.unSignData("",dataname,data,false,"拒绝签字",function(rtn){
			_this.close();
			_this.curnode.destroy();
		});
	}
	this.saveData=function(callback){
		var oldData= jQuery.extend({}, dform.data);
		var data=dform.getData();
		dform.domNode.id="dataNode_"+data.id;
		
		dataService.saveData(data.type,data,function(rtn){
			
			if (callback) callback(oldData,data);
		});
	
		//return false;
	};
	this.cancel=function(){		
		//_this.hide();
		_this.close();
	};
	this.show=function(){
		curnode.style.width=dform.width+"px";
		dflow.showNode(curnode);
		//curnode.onclick=function(){return false};
		dflow.onNodeClick=_this.onNodeClick;
		dflow.onButtonClick=_this.onNodeClick;
		dflow.dataNode.show();
		//dflow.showNode(curnode);
		//curnode.textContent="";
		dform.onShowImage=_this.showImage;
		dform.domNode.className="dataform";
		dform.show();
		this.events.ontouchmove=touchmove;
		this.events.ontouchend=touchend;
	};
	this.onNodeClick=function(node){
		if (node==curnode) return;
		var tempnode=curnode;
		//curnode.clear();
		curnode.setMovie(true);
		curnode.textContent=curnode.oldTextContent;
		curnode.className=curnode.oldClass;
		curnode.style.width=curnode.oldStyle.width
		curnode.style.height=curnode.oldStyle.height;
		
		var cleft= parseInt(curnode.style.left);
		var tleft = parseInt(dflow.timeLine.style.left);
		
		if (cleft<tleft){
			curnode.style.left= (tleft - parseInt(curnode.style.width)-20)+"px";
		}
		
		curnode.onclick=_this.onNodeClick;
		dform.hide();
		
		node.backupData();
		
		dflow.curnode=node;
		_this.init(dflow);
		_this.load(node.dataInfo,node.data);
		_this.show();
		window.setTimeout(function(){
			tempnode.clear();
			tempnode.textContent=tempnode.oldTextContent;
		},500);
	};
	this.hide=function(){
		dform.hide();
		curnode.styleTo={width:"60px",height:"20px"};
	};
	function touchend(ev){
		//console.log("click");
		console.log(event.srcElement.id);
		if (event.srcElement.id=="background"){
			dui.goBack();
		}
	}
	function touchmove(ev){
		//dflow的滚动已经包含了太多概念，不能在支撑编辑窗的滚动
		return;
		var data=ev.dataTouch;
		var obj=ev.srcElement;
		var doc=document.documentElement;
		var dwidth= doc.clientWidth ;//window.screen.width;
		var dheight=doc.clientHeight ;//window.screen.height;
		if (data.d>12){
			dflow.scroll(data.y2-data.y21);
		}
	}
}
WinData.prototype = new DWindow();
WinData.prototype.constructor = WinData;