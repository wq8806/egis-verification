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
