/**
 * Created by gousky on 2015/8/1.
 */
//变量声明
var oPrs = document.getElementById('J-progress-bar');
var oWarp = document.getElementById('J-warp');

var oldWidth,
    oldHeight; //鼠标移入元素时保存当前属性值
var obj1Top = null;
var obj1Left = null;    //拖拽元素并在鼠标按下的时候存储当前元素Top和Left值

//桌面内容
var desktop = document.getElementById('J-desktop');
var subDesktop = desktop.children;  //获取拖拽元素和子元素集合
var sdSub = subDesktop[0].children;

//侧边栏
var mouseEle = document.getElementById('J-side');
var eleMouse = mouseEle.children[0].children;

//个人信息
var ppeInfo = document.getElementById('J-people-info');
var ppeInfoMin = document.getElementById('J-people-info-min');
var ppeInfoClose = document.getElementById('J-personal-close');

//桌面切换
var dpWwitch = document.getElementById('J-desktop-switching');
var subdpWwitch = dpWwitch.children;

//右键菜单
var rClickMenu = document.getElementById('J-right-click-menu');

//时钟
var iClock = document.getElementById('J-clock');

webDasktop.progressBar(oPrs,oWarp);

//侧边栏
webDasktop.webDesktopMouse(eleMouse);
//桌面内容
function desktopSwich(obj){
    for(var i = 0; i < obj.length; i++){
        obj[i].style.top = i * 160 + 'px';
        webDesktopPublic.drag(obj[i],obj);
    }

}
//初始化桌面
subDesktop[0].style.display = 'block';
desktopSwich(sdSub);
//个人信息
webDasktop.peopleInfo(ppeInfo,ppeInfoMin,ppeInfoClose);
webDesktopPublic.drag(ppeInfo,'');
webDesktopPublic.drag(ppeInfoMin,'');

for(var i = 0; i <subdpWwitch.length; i++){
    subdpWwitch[i].index = i;
    subdpWwitch[i].onclick = function(){
        for(var i = 0; i <subdpWwitch.length; i++){
            subdpWwitch[i].className = '';
            subDesktop[i].style.display = 'none';
        }
        subdpWwitch[this.index].className = 'desktop-hover';
        subDesktop[this.index].style.display = 'block';
        var sdSub = subDesktop[this.index].children;
        desktopSwich(sdSub);
    }
}
//右键菜单
webDasktop.rightClickMenuShow(rClickMenu);
webDasktop.rightClickMenuHidden(rClickMenu);

//时钟
webDesktopPublic.clock(iClock);
setInterval(function(){
    webDesktopPublic.clock(iClock);
},1000);


//调试

