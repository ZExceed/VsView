# VsView 赛事系统对阵图单元格定位组件
用于各种赛事系统的自定义设计对阵图（图片文件）的后台定位录入，点击单元格可获取坐标与尺寸，根据具体需求插入队伍等信息，前台可根据坐标和队伍信息层叠到对阵图中。

# DEMO
![image](https://github.com/ZExceed/VsView/raw/master/screenshots/demo.gif)

# Usage
- 只支持canvas高级浏览器，一般用于后台录入
- 对阵图单元格边框和背景需要规定颜色，对阵图背景可随意设计
- 跨域问题解决

```html
nginx conf:
location / {
    add_header Access-Control-Allow-Origin *;
}

<div class="container"></div>
<script>
$(document).ready(function(){
    $('.container').VsView({
        drawRect: true,         // 是否显示选中区域 默认true
        borderColor: '000000',  // 边界颜色 默认 000000 黑色
        image: 'bracket.png'    // 对阵图路径
    }).active(function(position, rect){
        $(rect).html('TeamName'); // 单元格处理 插入队伍信息等
        console.log(position);    // {x, y, w, h} X,Y坐标,宽,高
    });
});
</script>
```
