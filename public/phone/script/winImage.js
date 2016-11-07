function WinImage(id,title){
	var _this=this;
	var dform;
	var img;
	var oldStyle;
	var oldImageStyle;
	
	this.init=function(div){
		dform=div;
		img=dform.image;
		dform.onShowImage=null;
		this.domNode=dform.domNode;
		oldStyle=getStyleData(dform.domNode);
		oldImageStyle=getStyleData(dform.image.domNode);
		dform.btnOk.oStyle=getStyleData(dform.btnOk);
		dform.btnShare.oStyle=getStyleData(dform.btnShare);
	} 
	this.load=function(dataInfo){
		this.dataInfo=dataInfo;
		_this.winTitle.textContent=dataInfo.name;
		_this.winTitle.style.display="";
		_this.winTitle.btnLeft.style.display="";
		for(var i=0;i<dform.children.length;i++){
			var cd=dform.children[i];
			if (cd!=dform.image){
				cd.style.display="none";
			}
		}
		dform.domNode.className="dataform fullscreen";
		dform.image.style.zIndex=100;
		dform.image.style.display="";
		dform.image.style.opacity=1;
		
		dform.btnOk.style.left=(this.width/2-parseInt(dform.btnOk.style.width)-10)+"px"; 
		dform.btnOk.style.top = this.height-40+"px";
		dform.btnShare.style.left=(this.width/2+10)+"px";
		dform.btnShare.style.top = this.height-40+"px";
		dform.btnOk.style.zIndex=255;
		dform.btnShare.style.zIndex=255;
		
		if (dform.btnOk.visible!=false) {
			dform.btnOk.style.display="";
			dform.btnOk.show();
		}
		if (dform.btnShare.visible!=false) {
			dform.btnShare.style.display="";
			dform.btnShare.show();
		}
	}
	this.show=function(){
		
		this.winTitle.btnRight.style.display="none";
		img.resize(_this.width,_this.height);
		img.style.left="0px";
		img.style.top="0px";
		img.style.width=_this.width+"px";
		img.style.height=_this.height+"px";
		
		this.domNode.style.left="0px";
		this.domNode.style.top="0px";
		this.domNode.style.width=_this.width+"px";
		this.domNode.style.height=_this.height+"px";
		this.domNode.setMovie(false);
		dform.onShowImage=null;
		
	}
	this.hide=function(){
		this.domNode.setMovie(true);
		setStyleData(dform.domNode,oldStyle);
		setStyleData(dform.image.domNode,oldImageStyle);
		setStyleData(dform.btnOk,dform.btnOk.oStyle);
		setStyleData(dform.btnShare,dform.btnShare.oStyle);
		dform.image.resize(parseInt (oldImageStyle.width),parseInt(oldImageStyle.height));
		dform.image.style.opacity=1;
		_this.winTitle.style.display="none";
	}
	function ontouch(ev){
		var data=ev.dataTouch;
		var obj=ev.srcElement;
		var image=img.image;
		
		if (data.fingers==1){
			image.style.left=(image.oldLeft+data.x2-data.x1)+"px";
			image.style.top=(image.oldTop+data.y2-data.y1)+"px";
			return;
		}
		if (data.fingers==2){
			var w=image.oldWidth*data.ds;
			var h=image.oldHeight*data.ds;
			
			var ix1= (data.x1+data.f2.x1)/2-image.oldLeft;
			var iy1=(data.y1+data.f2.y1)/2-image.oldTop;
			
			var ix2=ix1*data.ds;
			var iy2=iy1*data.ds;
			
			var ix3=(data.x2+data.f2.x2)/2-image.oldLeft;
			var iy3=(data.y2+data.f2.y2)/2-image.oldTop;
			
			
			
			image.style.left=(image.oldLeft+ix3-ix2)+"px";
			image.style.top=(image.oldTop+iy3-iy2)+"px";
			
			
			image.style.width=w+"px";
			image.style.height=h+"px";
			//img.resize(w,h);
		}
	}
	function ontouchstart(ev){
		var image=img.image;
		image.setMovie(false);
		image.oldLeft=parseFloat(image.style.left);
		image.oldTop=parseFloat(image.style.top);
		image.oldWidth=parseFloat(image.style.width);
		image.oldHeight=parseFloat(image.style.height);
	}
	function ontouchend(ev){
		var image=img.image;
		image.setMovie(true);
		var iwidth=parseInt( image.style.width);
		var iheight=parseInt( image.style.height);
		var ileft=parseInt( image.style.left);
		var itop=parseInt( image.style.top);

		
		if ( ileft<0 && ileft+iwidth<_this.width-10){
			image.style.left=(_this.width -iwidth-10) + "px";
		}
		if (ileft>10 && ileft+iwidth >_this.width ) {
			image.style.left="10px";
		}
		if (itop>70 && itop+iheight>_this.height){
			image.style.top="70px";
		}
		if (itop<0 && itop+iheight<_this.height-50){
			image.style.top=(_this.height-50-iheight)+"px";
		}
		if (iwidth<=_this.width ){
			image.style.marginLeft="";
			image.style.left= (_this.width -iwidth)/2 + "px";
			
		}
		if (iheight<_this.height){
			image.style.marginTop="";
			image.style.top=(_this.height-iheight)/2+ "px";
		}
	}
	this.events.ontouchstart=ontouchstart;
	this.events.ontouchmove=ontouch;
	this.events.ontouchend=ontouchend;
}
WinImage.prototype = new DWindow();
WinImage.prototype.constructor = WinImage;