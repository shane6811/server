var loginService=serviceFactory.getService("login.Login");

apiready = function(){
	//document.body.onload=init;
};
function init(){
	var username=localStorage.getItem("username");
	var password=localStorage.getItem("password");
	$("#username").val(username);
	$("#password").val(password);	
	
	var btnLogin = $('#btnLogin')[0];
	btnLogin.onclick=login;
	//var btnReg = $('#btnReg')[0];
	//btnReg.onclick=registe;
	
	var btn_ToLogin=$('#btn_ToLogin')[0];
	btn_ToLogin.onclick=tologin;
	
	var btn_ToReg=$('#btn_ToReg')[0];
	btn_ToReg.onclick=toreg;
	
	var btn_Reg_Next=$("#btn_Reg_Next")[0];
	btn_Reg_Next.onclick=regNext;

	var btn_For_Next=$("#btn_For_Next")[0];
	btn_For_Next.onclick=forNext;
	
	
	var btnForget=$("#btnForget")[0];
	btnForget.onclick=toForget;
	
	var btn_GoLogin=$("#btn_GoLogin")[0];
	btn_GoLogin.onclick=tologin;
	
	var divLogin=$('#divLogin')[0];
	var divReg=$('#divReg')[0];
	var divForget=$("#divForget")[0];
	
	divLogin.style.left=(document.documentElement.clientWidth /20)+"px";
	divReg.style.left=(-document.documentElement.clientWidth * 1.1)+"px";
	divForget.style.left=(document.documentElement.clientWidth * 1.1)+"px";
	divLogin.style.width=document.documentElement.clientWidth*0.9+"px";
	divReg.style.width=document.documentElement.clientWidth*0.9+"px";
	divForget.style.width=document.documentElement.clientWidth*0.9+"px";
	
	divLogin.style.webkitTransition="all 0.5s ease-in-out";
	divReg.style.webkitTransition="all 0.5s ease-in-out";
	divForget.style.webkitTransition="all 0.5s ease-in-out";
	
	$("input").focus(function(){
	
		$("#title").css("top","2%");
		$(".winframe").css("bottom","45%");
		//$.alert("d");
	})
	$("input").blur(function(){
		//window.setTimeout(function(){
			$("#title").css("top","15%");
			$(".winframe").css("bottom","5%");
		
	})
}
function forNext(){
	var btn_For_Next=$("#btn_For_Next")[0];
	var divReg=$('#divForget')[0];
	var divTip=$("#for_tip")[0];
	if (!divReg.regState)
		divReg.regState=0;
	if (divReg.regState==0){
		
		var phone=$("#for_phone").val();
		if (validatemobile(phone)){
			loginService.checkPhone(phone,function(ret){
				if (ret.value==false){
					$.alert("您输入的手机号还没有注册");
				}else{
					loginService.getVCode(phone,function(rtn){
						if (rtn.error){
							$.alert(rtn.error);
						}else{
							divReg.vCode=rtn.value;
							divTip.textContent="2.请输入短信中收到的4位验证码，点击下一步继续";
							divReg.regState=1;
							$("#for_code").show();
							
						}
						
					})
				}
			});
		}
		
	}else if(divReg.regState==1){
		if ($("#for_code").val()==divReg.vCode){
			$("#for_code").hide();
			$("#for_password").show();
			divReg.regState=2;
			btn_Reg_Next.textContent="更改密码";
			divTip.textContent="3.请设置新的登录密码后，点击更改密码.";
		}else{
			$.alert("验证码不正确");
		}
	}else if(divReg.regState==2){
		var phone=$("#for_phone").val();
		var password=$("#for_password").val();
		var vcode=divReg.vCode;
		if (password.length<4){
			$.alert("请至少输入4位密码");
		}else{
			
			changePassword(phone,vcode,password);
		}
		
	}
	
}
function regNext(){
	var btn_Reg_Next=$("#btn_Reg_Next")[0];
	var divReg=$('#divReg')[0];
	var divTip=$("#reg_tip")[0];
	if (!divReg.regState)
		divReg.regState=0;
	if (divReg.regState==0){
		
		var phone=$("#reg_phone").val();
		if (validatemobile(phone)){
			loginService.checkPhone(phone,function(ret){
				if (ret.value==true){
					$.alert("您输入的手机号已经被注册");
				}else{
					loginService.getVCode(phone,function(rtn){
						if (rtn.error){
							$.alert(rtn.error);
						}else{
							divReg.vCode=rtn.value;
							divTip.textContent="2.请输入短信中收到的4位验证码，点击下一步继续";
							divReg.regState=1;
							$("#reg_code").show();
							
						}
						
					})
				}
			});
		}
		
	}else if(divReg.regState==1){
		if ($("#reg_code").val()==divReg.vCode){
			$("#reg_code").hide();
			$("#reg_password").show();
			divReg.regState=2;
			btn_Reg_Next.textContent="注册";
			divTip.textContent="3.请设置您的登录密码后，点击注册按钮.";
		}else{
			$.alert("验证码不正确");
		}
	}else if(divReg.regState==2){
		var phone=$("#reg_phone").val();
		var password=$("#reg_password").val();
		if (password.length<4){
			$.alert("请至少输入4位密码");
		}else{
			
			registe(phone,password);
		}
		
	}
	
}
function tologin(){
	var divLogin=$('#divLogin')[0];
	var divReg=$('#divReg')[0];
	var divForget=$('#divForget')[0];
	
	divLogin.style.left=(document.documentElement.clientWidth /20)+"px";
	divReg.style.left=(-document.documentElement.clientWidth * 1.1)+"px";
	divForget.style.left=(document.documentElement.clientWidth * 1.1)+"px";
	divLogin.style.opacity=1;
	divLogin.style.display="";
	
}
function toreg(){
	var divLogin=$('#divLogin')[0];
	var divReg=$('#divReg')[0];
	
	divReg.style.left=(document.documentElement.clientWidth /20)+"px";
	divLogin.style.left=(document.documentElement.clientWidth * 1.1)+"px";
	divReg.style.opacity=1;
	divReg.style.display="";
}
function toForget(){
	var divLogin=$('#divLogin')[0];
	var divForget=$('#divForget')[0];
	
	divForget.style.left=(document.documentElement.clientWidth /20)+"px";
	divLogin.style.left=(-document.documentElement.clientWidth * 1.1)+"px";
	divForget.style.opacity=1;
	divForget.style.display="";
}

function login(){

	var username=$("#username").val();
	var password=$("#password").val();
	
	loginService.login(username,password,function(ret){
		if (ret){
			if (ret.error){
				$.alert(ret.error)
			}else{
				//$.alert(ret.value);
				if (ret.value){
					loginOk(username,password);
				}else{
					$.alert("登录失败");
				}
			}
		}else{
			
		}
	});

}
function validatemobile(mobile) { 
   	if(mobile.length==0){ 
      	$.alert('请输入手机号码！'); 
      	return false; 
   	}     
   	if(mobile.length!=11){ 
       	$.alert('请输入有效的手机号码！'); 
       	return false; 
   	} 
    
   	var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/; 
   	if(!myreg.test(mobile)) { 
       	$.alert('请输入有效的手机号码！'); 
       	return false; 
   	} 
   	return true;
} 
function loginOk(username,password){
	
	$("#divlogin").hide();
	localStorage.setItem("username", username);
	localStorage.setItem("loginUser", username);
	localStorage.setItem("password", password);
	localStorage.setItem("autoLogin", true);
	if(typeof api=="undefined"){
		location.href="main.html";
		return;
	}
    api.openWin({
        name: 'main',
        url: 'main.html',
        bounces: false,
        rect: {
            x: 0,
            y: 0,
            w: api.winWidth,
            h: api.winHeight
        }
    });
	
}
function registe(username,password){

	loginService.registe(username,password,function(ret){
		if (ret){
			if (ret.error){
				$.alert(ret.error);
			}else{
				if (ret.value){
					$.alert("注册成功");
					loginOk(username,password);
				}else{
					$.alert("登录失败");
				}
			}
		}else{
			$.alert("网络错误");
		}
	});
}
function changePassword(username,vcode,password){

	loginService.changePassword(username,vcode,password,function(ret){
		if (ret){
			if (ret.error){
				$.alert(ret.error)
			}else{
				if (ret.value){
					$.alert("密码修改成功")
					loginOk(username,password);
				}else{
					$.alert("密码修改失败");
				}
			}
		}
	});
}