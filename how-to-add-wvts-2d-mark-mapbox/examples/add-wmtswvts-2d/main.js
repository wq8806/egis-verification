// 创建地图
var egisMap = new egis.carto.Map({
    "defaultExtent": {
        "center": [
            116.40, 39.90
        ],
        "maxZoom": 18,
        "minZoom": 1,
        "level": 11,
        "projection": "EPSG:4490"
    }
});

// 初始化地图，传入要初始化的DOM对象的id
egisMap.init({targetId: 'egismap'});

/** 创建矢量瓦片图层并添加到地图中 */
function createVectorTileLayer(url,map) {
    var transformRequest = function (url, resourceType) {
        if (resourceType === 'Tile' && url.indexOf('wmts') > -1) {
            let regNum = /(?<=TileMatrix\=)\d+/gi;  //匹配出级别数字, 全局匹配g不区分大小写i
            let reg = /TileMatrix=(\d+)/gi;
            var tileMatrix = url.match(reg)[0];
            var level = parseInt(tileMatrix.match(regNum)[0]);
            var tileMatrix1 = tileMatrix.replace(level,++level);
            return {
                url:url.replace(tileMatrix,tileMatrix1)
            }
        }
    }

    return new egis.carto.MVTVectorTileLayer({
        glStyle: url,
        map:map,
        transformRequest:transformRequest
    })
}
//创建矢量瓦片图层
var compositeLayer = createVectorTileLayer('http://10.18.1.185/api/v1/styles/8',egisMap);

//添加矢量瓦片图层到地图
egisMap.addLayer(compositeLayer);

var glMap = compositeLayer._glMap;
//添加天地图矢量图层
// egisMap.addLayer(tiandituvec);
// egisMap.addLayer(tianditucta);

glMap.on('load',function () {
    var wmtsLayer = {
        'id': 'guojia-emap',
        'type': 'raster',
        'minzoom': 1,
        // 'maxzoom': 18,
        'layout': {
            'visibility': 'visible'
        },
        'source': {
            'type': 'raster',
            'tiles':['http://10.18.1.139:8089/egis/base/v1/wmts?layer=img&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}'],
            'tileSize': 256
        }
    };
    var bottomlayerId = glMap.getStyle().layers[0].id;
    glMap.addLayer(wmtsLayer,bottomlayerId);
    // glMap.setPaintProperty('guojia-emap', 'raster-opacity', parseInt(50, 10) / 100);
})


/** 显示地图当前缩放级别 */
//显示地图当前缩放级别
function setZoomLevel() {
    var zoomLevel = document.getElementById("zoomLevel");
    // zoomLevel.innerHTML="级别:"+glMap.getZoom();
    zoomLevel.innerHTML="级别:"+egisMap.getZoomLevel();
}
setZoomLevel();
//查看zoom层级
egisMap.on("resolutionchanged", function () {
    setZoomLevel();
})

// 创建一个元素图层，用来保存元素对象
var elementLayer = new egis.carto.ElementLayer({
    id: 'ElementLayer',
    name: '元素图层'
});
// 将元素图层添加到地图上去
egisMap.addLayer(elementLayer);
// 创建一个点几何对象
var point = new egis.sfs.Point({
    x: 116.3466,
    y: 39.87040,
    spatialReference: 4490
});

//消防员图标对应的base64编码
var source = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAfCAYAAAD5h919AAAEKklEQVRIS7WXX0xbdRTHv/f2D/03CqVsE5KBkWJiUGN8cFFj+rA9qGFbookPxpAsYRQKTysv/hvOJ0OfhLaUPsG7BgaLGh6cxqnRPS5RRwJdJpQoLaXN2nLv7b3m/Oit9/Z/su0kTfu7vz+fc87vnHNPOQBYWloa5DhuGMCzNH6M8peiKGsjIyP3uBIkGo1GvZIkMQbHcexbURT2Wx2rzxopoq4VRRGCICAQCNxSFGWMW15evrqwsBA0nz0L8/nz7AxDb+8jG1Xc2YGwsYHkxgamp6cDBFoMhUKjzpmZxwLQakiw9LVrmJycjDFQOBwe7VxcfGQrah1w6PPB5/MdgyKRyGhHNNoU9JLDgRftdoiKgs18Hr9ls033HFy5gomJidZBZp7HTF8fA5H8mcvh43gceVluCEuPjWF8fLy566w8jwGrFc9YLLjkdqPbZGIHF2QZsb09bOZy+EcUkS0WawJbssjIcfjg1Cm863ZDUBTkikV0GI3swEyxiIQgYNBqxS+ZDL7c2akJ04HqBcM7bjcunz5d1zWSooCUIfk9m8Vn9+9DqVjdFOQ2mbDg8YBcp0pKkrCeTCIny3ivuxudJevU+cVEAqvJpA7V9I78PT14y+XSbQrv7uJmKsWevWC34/P+/rJFaoB8Eo8zRVRpaJHDYEDE44GrQuNYIoGVksavnDiBT/v6dIpQUHy4vc3uriWQ3WBAeGAA5D6txAsFfPHgAcujj86cwdMWi27+X1HE9NYW6LsmSE1YC8+DkvJQkvCa04lLXV1VgUD3dCTLeMpsrpr77uAA36ZSIEW3CwWkJQk1XTfZ04M3XS7sCQIiiQS8Tie8HR04jqv6QpH2ayaD79NplmvP2Wz48fCQWV8TdHNoqHzaH7kcW/x6ezsGbTaYSmGsxRGgqCjYKhTwcyaDlx0OPF+qHLTu7bt3oYs61XXrQ0M67am87IsiyKV0X5WWUXWgikCwNp6vCvcqkJqwbzidLD/6Ky65ieeqpncFAV/v7+ObVErvOnofuWIxtoFCmgKB7sdpNEJWFPS2tTVk0Z2SVQ9lGT+k0/gpk2GeING5TgtST6Ssp7TrMhrx/smToNyieqcVG8+DovCr/X38fXQEA8exiNVKS0WVNhDw1fZ28BzH8kcrFCBU7+5ks7rc0a7RWTQ3Nzfaef36E3+VXw0Gg0HXuXNPpDnJ374Nv98fKLdbs7Oz3rbSpZtKpYfaLcvwMKzD1PLVl/zaGvI3bpRbM9pHHxK/33/cbtGgQQPpCYfD3kYwghytr9Pr+haAzQp1/m8gG2mqNpehUMhrvXChyjLVElVr6kjrndesjKnWRufn5722ixfLMII8XFnB1NQUc00jCMGbgjSuLcPoWW51lRrDliAtg7SwYDDopbHaUzezRHVlSxapizVBQ1HF/iU0DEfN5H/+nH8CttJflQAAAABJRU5ErkJggg==";
//创建矢量图标符号
var vectormarker = new egis.sfs.PictureMarkerSymbol({
    source: source,//图片源
    width: 26,//宽度
    height: 31,//高度
    offsetX: 13,//水平方向偏移量
    offsetY: 31,//垂直方向偏移量
    opacity: 1,//显示图片的透明度，默认初始化为1
    rotation: 0,//图片旋转角度，默认初始化为0

});
// 根据点几何对象和点符号对象构造一个点元素对象
var pointEle = new egis.sfs.Element({
    geometry: point,
    symbol: vectormarker
});

elementLayer.add(pointEle);
