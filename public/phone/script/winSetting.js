var loginService=serviceFactory.getService("login.Login");

function WinSetting(id,title){
	var _this=this;
	var dwin;
	this.init=function(){
		//var div=dui.getDataDom("div","winsetting",0,0,100,100,0);
		//this.domNode=div;
		this.children=[];
		this.controls=[];
		this.top=0;
	}
	this.load=function(){

		var div=this.domNode;
		_this.winTitle.textContent="个人设置";
		_this.winTitle.btnRight.style.display="none";
		_this.winTitle.btnLeft.style.display="";
		_this.winTitle.btnLeft.style.opacity=1;
		
		var top = this.top;
		
		top+=70;
		

		var divS=dui.getDataDom("div","divSetting","dataitem",10,top,this.width-20,105,1);
		
		var img=getImage("image_photo",10,5,96,96,5,1);
		img.style.boderRadius="5px";
		//img.src= urlServer+"/userphoto/"+data.photo;
		_this.photo=img;
		
		var labName=dui.getDataDom("div","username_label","",120,10,200,25,1);
		labName.textContent="设置头像"
		
		var file=getImageFile("photo",120,65,120,30,5,1);
		file.image=img;
		file.dataid="photo";
		file.onupload=function(f){
			img.src=f.imageUrl;
			_this.onSaveData();
		}
		
		this.controls.push(file);
		
		divS.appendChild(img);
		divS.appendChild(file);
		divS.appendChild(labName);

		
		this.children.push(divS);
		
		top+=115;
		
		this.addDataItem("username","帐号",top);
		var txt_user=$("#txtusername")[0];
		txt_user.setAttribute("readonly","readonly");
		txt_user.style.border="none";
		top+=40;
		

		//$("#txtpassword")[0].setAttribute("type", "password");
		
		
		var divpwd=dui.getDataDom("div","div_Pwd","listbutton",20,top,this.width-40,35,1);
		this.divPwd=divpwd;
		divpwd.textContent="更改密码";
		divpwd.onclick=_this.showPwd;
		this.children.push(divpwd);
		top+=40;
		this.addDataItem("name","姓名",top);
		top+=40;
		this.addDataItem("phone","手机",top);
		top+=40;
		this.addDataItem("email","邮箱",top);
		top+=40;
		this.addDataItem("comp","公司",top);
		
		var pwd=this.addDataItem("password","密码",top);
		pwd.style.display="none";
		//top+=45;
		//this.addDataItem("prmpt","备注",top);

		top+=40;
		
		var btn1=getButton("btn_save",30,top,this.width-60,25,5,0);
		btn1.style.marginTop="20px";
		btn1.textContent="保存设置";
		top+=30;
		
		var btn2=getButton("btn_exit",30,top,this.width-60,25,5,0);
		btn2.style.marginTop="25px";
		btn2.textContent="退出登陆";
		
		top+=40;
		
		var btn3=getButton("btn_clear",30,top,this.width-60,25,5,0);
		btn3.style.marginTop="30px";
		btn3.textContent="清除全部数据";
		
		this.children.push(btn1);
		this.children.push(btn2);
		this.children.push(btn3);
		
		btn1.onclick=function(){
			_this.ok();
		};
		btn2.onclick=function(){
			location.href="login.html";
			//gotologin();
		};
		btn3.onclick=function(){
			$.confirm("该操作会删除你的所有数据，并且不能恢复，是否确定？","提示",function(){
				dataService.clearDB(function(rtn){
					$.alert("您的数据已经成功清除！");
				})
			},null);
			
		}
		var username=localStorage.getItem("username");
		
		loginService.getUserData(username,"",function(rtn){
			_this.setData(rtn.value);
		});
		
	}
	this.relayer=function(){
		var top=this.top+70;
		
		for(var i=0;i<_this.children.length;i++){
			
			var cd=_this.children[i];
			if (cd.style.display!="none"){
				if(cd.style.paddingTop){
					top+=parseInt( cd.style.paddingTop);
				}
				cd.style.top=top+"px";
				top+=parseInt(cd.style.height)+5;
				
			}
		}
	}
	this.showPwd=function(){
		var div=_this.divPwd;
		div.height=180;
		var dwidth=parseInt(div.style.width);
		div.style.backgroundColor="rgba(250,250,250,0.2)";
		var top = 40;
		var oldpwd=getDataItem("oldpassword","原密码",top,_this.width-45);
		top+=45;
		var newpwd=getDataItem("newpassword","新密码",top,_this.width-45);
		oldpwd.style.opacity=1;
		newpwd.style.opacity=1;
		
		div.appendChild(oldpwd);
		div.appendChild(newpwd);
		div.onclick="";
		top+=50;
		
		var btnPwdOk=getButton("btnPwdOk",dwidth/2-dwidth/3-15,top,dwidth/3,25,5,1);
		btnPwdOk.textContent="更改";
		div.appendChild(btnPwdOk);
		btnPwdOk.onclick=function(){
			var oldpwd=$("#txtoldpassword").val();
			var newpwd=$("#txtnewpassword").val();
			var pwd=$("#txtpassword").val();
			
			if (oldpwd!=pwd){
				$.alert("您输入的旧密码不正确，请重新输入");
				return;
			}
			if (newpwd.length<4){
				$.alert("您输入新密码长度不足4位，请重新输入");
				return;
			}
			$("#txtpassword")[0].value=newpwd;
			localStorage.setItem("password", newpwd);
			_this.onSaveData();
		}
		var btnPwdCancel=getButton("btnPwdCancel",dwidth/2+15,top,_this.width/3,25,5,1);
		btnPwdCancel.textContent="取消";
		btnPwdCancel.onclick=_this.hidepwd;
		div.appendChild(btnPwdCancel);
		_this.relayer();
	}
	this.hidepwd=function(){
		var div=_this.divPwd;

		div.height=35;
		
		
		window.setTimeout(function(){
			div.onclick=_this.showPwd;
		},50);
		_this.relayer();
	}
	
	this.getPhoto=function(id,callback){
	
		var txt=$("#txt_"+id)[0];
		var img=$("#image_"+id)[0];
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
		   
		    }
		});
	}
	this.uploadFile=function(filePath,callback){
		api.showProgress({
            style : 'default',
            animationType : 'fade',
            title : '',
            text : '上传中...',
            modal : false
    	});
    	
    	var session=JSON.stringify(getSession());
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
            api.hideProgress();
            if (ret) {
				callback(ret.value)
            } else {
           		$.alert("err:"+err.msg);
                //showToast('错误码：' + err.code + '；错误信息：' + err.msg + '网络状态码：' + err.statusCode);
            };
        });
    
	}
	

	this.addDataItem=function(id,title,top){
		var div=getDataItem(id,title,top,this.width);
		div.dataid=id;
		var txt=$("#txt"+id)[0];
		txt.dataid=id;
		this.controls.push(txt);
		this.children.push(div);
		return div;
	}
	this.getData=function(){
		var data=this.data;
		if (!data) data={id:guid()};
		for(var i=0;i<this.controls.length;i++){
			var ctl=this.controls[i];
			data[ctl.dataid]=ctl.value;
		}
		return data;
	}
	this.setData=function(data){
		this.data=data;
		
		for(var i=0;i<this.controls.length;i++){
			var ctl=this.controls[i];
			if (data[ctl.dataid])
				ctl.value=data[ctl.dataid];
		}
		
		var img=_this.photo;
		if (data.photo){
			img.src=urlServer+"//"+data.photo;
			img.style.display="";
			img.style.opacity=1;
		}else{
			img.src="../image/photo.png";
		}
		img.onclick=function(){ _this.getPhoto("photo",function(filePath){
			_this.uploadFile(filePath,function(url){
				var txt=$("#photo")[0];
				txt.value=url;
				_this.onSaveData();
    		});
		})};
	}
	this.onSaveData=function(){
		var data=_this.getData();
		loginService.saveUserData(data.username,data,function(rtn){
			
		});
	}
	this.ok=function(){

		var data=_this.getData();
		loginService.saveUserData(data.username,data,function(rtn){
			
		});
	}
	this.cancel=function(){
		
	}

	this.move=function(left,top){
		for(var i=0;i<this.children.length;i++){
			var cd=this.children[i];
			//cd.style.opacity=1;
			if (left) cd.style.left=parseInt(cd.style.left)+left+"px";
			if (top) cd.style.top = parseInt(cd.style.top)+top+"px";
		}
	}
	this.show=function(){
		for(var i=0;i<this.children.length;i++){
			var cd=this.children[i];
			cd.style.opacity=1;
		}
		this.relayer();
	}
	this.hide=function(){
		for(var i=0;i<this.children.length;i++){
			var cd=this.children[i];
			cd.style.opacity=0;
		}
	}
}
WinSetting.prototype = new DWindow();
WinSetting.prototype.constructor = WinSetting;
