function TouchEvent(){
	
	var dataTouch={};
	var _this=this;
	dataTouch.x0=document.documentElement.clientWidth/2;
	dataTouch.y0=document.documentElement.clientHeight/2;
	dataTouch.points=[];
	_this.init = function (){
		document.body.ontouchstart=funTouch;
		document.body.ontouchmove=funTouch;
		document.body.ontouchend=funTouch;
		document.addEventListener('DOMMouseScroll',funScroll,false);
		window.onmousewheel=document.onmousewheel=funScroll;
		//document.addEventListener('touchstart',funTouch,false);
		//document.addEventListener('touchmove',funTouch,false);
		//document.addEventListener('touchend',funTouch,false);
	}
	_this.remove=function(){
		document.removeEventListener('touchstart',funTouch);
		document.removeEventListener('touchmove',funTouch,false);
		document.removeEventListener('touchend',funTouch,false);
		document.removeEventListener('DOMMouseScroll',funScroll,false);
		window.onmousewheel=document.onmousewheel=null;
	}
	function funScroll(event){
		var event = event || window.event;
	 	var obj=event.srcElement;
	 	if (_this.onscroll){
        	if (event.wheelDelta>0){
        		event.value=5;
        	}else{
        		event.value=-5;
        	}
        	_this.onscroll(event)
        }
	}
	function funTouch (event){
	    var event = event || window.event;
	     
	    //var oInp = document.getElementById("inp");
	 	var obj=event.srcElement;
	 	
	        switch(event.type){
	            case "touchstart":
	            dataTouch.touch=true;
	            dataTouch.sendEvent=false;
	            dataTouch.x1=event.touches[0].clientX;
	            dataTouch.y1=event.touches[0].clientY;
	            dataTouch.x2=event.touches[0].clientX;
	            dataTouch.y2=event.touches[0].clientY;
	            dataTouch.fingers=event.touches.length;
	            if (dataTouch.fingers>1){
	            	dataTouch.f2={};
	            	dataTouch.f2.x1=event.touches[1].clientX;
		            dataTouch.f2.y1=event.touches[1].clientY;
		            dataTouch.f2.x2=event.touches[1].clientX;
		            dataTouch.f2.y2=event.touches[1].clientY;
		            
		            dataTouch.d1=getDistance(dataTouch.x1,dataTouch.y1,dataTouch.f2.x1,dataTouch.f2.y1);
		            dataTouch.d2=dataTouch.d1;
		            dataTouch.ds=1;
	            }else{
	            	dataTouch.f2=null;
	            }
	            
	            dataTouch.d=0;
	            dataTouch.angle=0;
	            dataTouch.ang1=getAngle(dataTouch.x1,dataTouch.y1);
	            dataTouch.points=[];
	           	if (_this.ontouchstart  ){
	            	event.dataTouch=dataTouch;
	            	_this.ontouchstart(event);
	            }
	            //oInp.innerHTML ="Touch started (" + event.touches[0].clientX +"," + event.touches[0].clientY +")";
	            break;
	        case "touchend":
	            //oInp.innerHTML ="<br>Touch end (" + event.changedTouches[0].clientX +"," + event.changedTouches[0].clientY +")";
	            //getTouchData();
	            dataTouch.touch=false;
	            
	           
	            if (_this.ontouchend){
	            	event.dataTouch=dataTouch;
	            	
	            	if (dataTouch.fingers>1){
	            		if (!dataTouch.sendEvent){
	            			_this.ontouchend(event);
	            			dataTouch.sendEvent=true;
	            			
	            		}
	            	}else{
	            		if (!dataTouch.f2){
	            			_this.ontouchend(event);
	            	
	            		}
	            	}
	            }
	            break;
	        case "touchmove":
	            event.preventDefault();
	            
	            if (event.touches.length>1){
	            	dataTouch.fingers=event.touches.length;
	            	if (!dataTouch.f2) dataTouch.f2={};
	            	
		            dataTouch.f2.x2=event.touches[1].clientX;
		            dataTouch.f2.y2=event.touches[1].clientY;
	            }
	            if (event.touches.length<2 && dataTouch.fingers>1){
	            	
	            }else{
					getTouchData();
				}
		
	            if (_this.ontouchmove && dataTouch.d>12 ){
	            	event.dataTouch=dataTouch;
	            	if (event.touches.length<2 && dataTouch.fingers>1){
	            		
	            	}else{
	            		_this.ontouchmove(event);
	            	}
	            }
	            break;
	    }
	     
	}
	function getTouchData(){
		
		if (dataTouch.x2 || dataTouch.y2){
			dataTouch.x21=dataTouch.x2;
			dataTouch.y21=dataTouch.y2;
		}else{
			dataTouch.x21=dataTouch.x1;
			dataTouch.y21=dataTouch.y1;
		}
        dataTouch.x2=event.touches[0].clientX;
        dataTouch.y2=event.touches[0].clientY;
        dataTouch.time=new Date();

        dataTouch.d=getDistance(dataTouch.x1,dataTouch.y1,dataTouch.x2,dataTouch.y2);
        
        dataTouch.ang2=getAngle(dataTouch.x2,dataTouch.y2);
        dataTouch.angle=dataTouch.ang2-dataTouch.ang1;
        var p={x:dataTouch.x2,y:dataTouch.y,time:dataTouch.time};
        
        if (dataTouch.f2){
        	dataTouch.d2=getDistance(dataTouch.x2,dataTouch.y2,dataTouch.f2.x2,dataTouch.f2.y2);
        	dataTouch.ds=dataTouch.d2/dataTouch.d1;
        }
        
        dataTouch.points.push(p);
	}
	function getDistance(x1,y1,x2,y2){
		var dx=x2-x1;
		var dy=y2-y1;
		return Math.sqrt(dx*dx+dy*dy);
	}
	function getAngle(x,y){
		var dx=x-dataTouch.x0;
		var dy=y-dataTouch.y0;
		
		var ang=Math.acos(dx/Math.sqrt(dx*dx+dy*dy));
		if (dy<0) ang=Math.PI*2-ang;
		return ang;
		
	}
}
var eventTouch=new TouchEvent(); 
