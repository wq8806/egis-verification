window['EGIS_BASE_URL'] = '../../vendor/static';
var opts = {
    defaultExtent: [
        115.25,
        39.26,
        117.30,
        41.03
    ],//北京范围
    fullExtent: [   115.25,
        39.26,
        117.30,
        41.03],  //北京的范围坐标
    srid:4490  //坐标系
};
// 创建地图
var egismap = new egis.carto.Globe(opts);

// 初始化地图，传入要初始化的DOM对象的id
egismap.init({targetId: 'egismap'});
//创建谷歌影像图层
var googleMap = new egis.carto.TileLayer3D({
    layerType: 1,
    tileType: 201,
    url:'http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}'
});
// 创建天地图中文标注(三维)瓦片图层
var tianditucta = new egis.carto.TileLayer3D({
    "id": "tianditulabel",
    "name": "天地图中文标注",
    "layers": "cta",
    "//": "图层名称",
    "matrix": 18,
    "//": "切图级别小于等于切图级别",
    "matrixSet": "c",
    "//": "切图策略",
    "matrixPrefix": "",
    "//": "切图策略加冒号：",
    "levelShift": 0,
    "//": "3857:0,4326:1",
    "format": "tiles",
    "//": "图层格式",
    "projection": "EPSG:4490",
    "//": "投影参考",
    "layerType": 1,
    "matrixIds": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
    "//": "图层类型",
    "tileType": 102,
    "//": "瓦片类型",
    "opacity": 1,
    "//": "透明度",
    "visible": true,
    "//": "是否显示",
    "style": "default",
    "url": "http://{s}.tianditu.gov.cn/cta_c/wmts?tk=4f62e1d82bd46e2ff470b291c2260156",
    "subdomains": ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"]
});
//将谷歌影像图层添加到地图中
egismap.addLayer(googleMap);
//将天地图中文标注(三维)瓦片图层添加到地图中
egismap.addLayer(tianditucta);
