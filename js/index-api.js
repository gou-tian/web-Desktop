/**
 * Created by gousky on 2015/7/29.
 *
 * （2015-07-30）
 * 鼠标移入放大元素 22:00
 * （2015-07-31）
 * 拖拽元素并在鼠标抬起时判断是否重叠，重叠则交换位置。 20:45
 * 加入缓冲运动 22:40
 * (2015-08-01)
 * 修复缓冲运动中的Bug及不透明度计算公式Bug 23:15
 * (2015-08-02)
 * 修复拖拽Bug，使其能个复用 22：12
 */

//Public function.
var webDesktopPublic = {
    //计算元素属性值
    css : function (obj,attr){
        //标准浏览器与IE非标准浏览器兼容处理
        if(obj.currentStyle){
            //IE非标准浏览器
            return obj.currentStyle[attr];
        }else{
            //标准浏览器
            return getComputedStyle(obj,false)[attr];   //兼容老版本火狐下getComputedStyle的一个Bug。需要多传入一个参数
        }
    },
    //元素拖拽
    drag : function(obj,arr){
        obj.onmousedown = function(e){
            var _This = this;
            /**
             * 鼠标按下时存储obj的Top、Left值，这里暂时用硬编码写入。
             * 如果需要可以用形参代替。这的更加灵活。方便
             * 最好的方法是用继承的方式实现。
             * */
            obj1Top = _This.offsetTop;
            obj1Left = _This.offsetLeft;
            var ev = e || event;
            var eleX = ev.clientX - obj1Left;
            var eleY = ev.clientY - obj1Top;
            //全局捕获
            if(this.setCapture){
                this.setCapture();
            }
            //元素移动
            document.onmousemove = function(e){
                var ev = e || event;
                _This.style.top = ev.clientY - eleY + 'px';
                _This.style.left = ev.clientX - eleX + 'px';
            };
            //鼠标抬起
            document.onmouseup = function(){
                //重叠检测
                for(var i = 0; i < arr.length; i++){
                    if(_This != arr[i]){
                        webDesktopPublic.overlap(_This,arr[i])
                    }
                }
                //清除事件
                document.onmousemove = document.onmouseup = null;
                //释放全局捕获
                if(_This.releaseCapture){
                    _This.releaseCapture();
                }
            };
            //阻止默认事件
            return false;
        };
    },
    //检测
    overlap : function(obj1,obj2){
        //obj1
        var t1 = obj1.offsetTop;
        var l1 = obj1.offsetLeft;
        var r1 = obj1.offsetWidth + l1;
        var b1 = obj1.offsetHeight + t1;
        //obj2
        var t2 = obj2.offsetTop;
        var l2 = obj2.offsetLeft;
        var r2 = obj2.offsetWidth + l2;
        var b2 = obj2.offsetHeight + t2;
        if( r1 > l2 && b1 > t2 && l1 < r2 && t1 <b2){
            webDesktopPublic.bufferMove(obj1,{top : obj2.offsetTop,left : obj2.offsetLeft});
            webDesktopPublic.bufferMove(obj2,{top : obj1Top,left : obj1Left});
        }
    },
    //缓冲运动
    bufferMove : function(obj,json,fn){
        //清楚定时器
        clearInterval(obj.iTime);
        //速度值计算变量
        var iSpeed = 0;
        var num = 0;
        //开启定时器
        obj.iTime = setInterval(function(){
            //设置多属性判断条件
            var iSwitch = true;
            //循环json获取属性及属性值
            for(var attr in json){
                //获取属性值
                var iTarget = json[attr];
                //判断属性
                if(attr == 'opacity') {
                    num = Math.round(webDesktopPublic.css(obj,'opacity') * 100);
                }else{
                    num = parseInt(webDesktopPublic.css(obj,attr));
                }
                //速度值计算
                iSpeed = (iTarget - num) / 8;
                iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
                //属性赋值
                if(num != iTarget){
                    //每次进来时说明有条件未执行完成iSwitch设置为false
                    iSwitch = false;
                    if(attr == 'opacity'){
                        obj.style.opacity = (iSpeed + num) / 100;
                        obj.style.filter = 'alpha(opacity' + (iSpeed + num) + ')';
                    }else{
                        obj.style[attr] = iSpeed + num + 'px';
                    }
                }
            }
            //全部for循环执行完毕后检查所有条件是否执行完，判断条件为iSwitch,iSwitch为true为所有条件满足
            if(iSwitch){
                //关闭定时器
                clearInterval(obj.iTime);
                //关闭定时器后判断是否有回调函数，如果有则执行同时把this指向调用对象
                fn && fn.call(obj);
            }
        },14);
    }
};
//鼠标移入放大元素
var webDasktop = {
    //鼠标移入
    webDesktopMouse : function (obj){
        for(var i = 0; i < obj.length; i++){
            obj[i].style.top = 10 + i * 70 + 'px';
            obj[i].onmouseover = webDasktop.webDesktopMouseOv;
            obj[i].onmouseout = webDasktop.webDesktopMouseOu;
        }
    },
    //鼠标移入放大元素
    webDesktopMouseOv : function (){
        var zIndexNum = 0;
        oldWidth = parseInt(webDesktopPublic.css(this,'width'));
        oldHeight = parseInt(webDesktopPublic.css(this,'height'));
        var oW = oldWidth;
        var oH = oldHeight;
        webDesktopPublic.bufferMove(this,{'width' : oW + 10 ,'margin' : -5,height : oH + 10});
        zIndexNum++;
        this.style.zIndex = zIndexNum;
    },
    //鼠标移出还原元素
    webDesktopMouseOu : function (){
        webDesktopPublic.bufferMove(this,{'width' : oldWidth,'margin' : 0,height : oldHeight});
    },
    //个人资料
    peopleInfo : function(obj,minObj,objClose){
        var objLen = obj.children.length;
        minObj.ondblclick = function(){
            obj.style.display = 'block';
            objClose.style.display = 'block';
            webDesktopPublic.bufferMove(obj,{'opacity' : 100,'height' : 370},function(){
                for(var i = 0; i < objLen-1; i++){
                    webDesktopPublic.bufferMove(obj.children[i],{'height' : 186},function(){
                        webDesktopPublic.bufferMove(minObj,{'opacity' : 0},function(){
                            this.style.display = 'none';
                        })
                    });
                }
            });
        };
        objClose.onclick = function(){
            for(var i = 0; i < objLen-1; i++){
                webDesktopPublic.bufferMove(obj.children[i],{'height' : 0},function(){
                    webDesktopPublic.bufferMove(obj,{'opacity' : 0,'height' : 0},function(){
                        objClose.style.display = 'none';
                        minObj.style.display = 'block';
                        webDesktopPublic.bufferMove(minObj,{'opacity' : 100});
                    })
                });
            }
        }
    }
};
