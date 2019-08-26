// 为 requirejs（一种 AMD 模块加载器）指定文件别名和文件间的依赖关系
require.config({
    baseUrl: './vendor/', // 文件查找的基目录，这里指的是
    // 与 “index.html” 同级的目录下的 vendor 子目录
    paths: {
        //第三方组件
        ol: 'ol/ol', // 地图显示组件
        proj4: 'proj4/proj4', // 坐标转换库
        echarts: 'echarts/echarts.common.min',//图例库
        turf: "turf/turf.min",//拓扑关系库
        //EGIS组件
        egis: "egis/egis-2d",
        olms: "ol/olms",
        mapboxgl: "mapbox/mapbox-gl"
    }
});

require(['egis', 'olms','ol'], function (egis, olms,ol) {

    //创建地图分辨率相关参数参数
    var topResolution = 360.0 / 512;
    var res1 = [];
    for (var zoom = 0; zoom < 22; zoom++) {
        res1[zoom] = topResolution / Math.pow(2, zoom);
    }

    // 创建地图
    var egismap = new egis.carto.Map({
        "defaultExtent": {
            "center": [
                116.40, 39.90
            ],
            "maxZoom": 22,
            "minZoom": 1,
            "level": 12,
            "projection": "EPSG:4490"
        }
    });

    // 初始化地图，传入要初始化的DOM对象的id
    egismap.init({targetId: 'egismap'});

    //样式集合
    var styles = {
        "standard": {
            spriteUrl: "http://10.18.1.139:8089/egis/base/v1/wvts/sprites/1/sprite.json", // http://10.18.1.185:80/api/v1/sprites/1/sprite.json
            spriteImgUrl: "http://10.18.1.139:8089/egis/base/v1/wvts/sprites/1/sprite.png", //http://10.18.1.185:80/api/v1/sprites/1/sprite.png
            styleUrl: "http://10.18.1.139:8089/egis/base/v1/wvts/styles/1"   // http://10.18.1.185/api/v1/styles/1
        }
    }

    // 创建 天地图瓦片图层
    var tiandituvec = new egis.carto.TileLayer({
        "name": "天地图矢量",
        "layers": "vec", "//": "图层名称",
        "matrix": 21, "//": "切图级别小于等于切图级别",
        "matrixSet": "c", "//": "切图策略",
        "matrixPrefix": "", "//": "切图策略加冒号：",
        "format": "tiles", "//": "图层格式",
        "projection": "EPSG:4490", "//": "投影参考",
        "layerType": 1, "//": "图层类型",
        "tileType": 102, "//": "瓦片类型",
        "opacity": 1.0, "//": "透明度",
        "visible": true, "//": "是否显示",
        "crossOrigin": "anonymous",
        "style": "default",
        "wrapX": true,
        "url": "http://10.18.1.139:8089/egis/base/v1/wmts"
    });

    egismap.addLayer(tiandituvec);

    function createVectorTileLayer(styleUrl,spriteUrl,spriteImgUrl) {
        return new egis.carto.VectorTileLayer({
            url:"http://10.18.1.139:8089/egis/base/v1/wvts/tiles",
            styleUrl:styleUrl,
            spriteUrl:spriteUrl,
            spriteImgUrl:spriteImgUrl,
            resolutions:res1,
            declutter: true,
            renderMode: "image",
            declutterDistance:1,
            projection: "EPSG:4490",
            extent: [-180, -90, 180, 90],
            wrapX:true,
            tileSize: 512,
        })
    }

    //创建矢量瓦片图层
    var compositeLayer = createVectorTileLayer(styles["standard"].styleUrl,styles["standard"].spriteUrl,styles["standard"].spriteImgUrl); ;
    egismap.addLayer(compositeLayer);

    //初始时隐藏所有矢量瓦片图层信息---以标注版样式为例
    hideAllMark();



    function hideAllMark() {
        var allLayersId = [];
        for(var i=0,len = 1022;i<len;i++){ //---以标注版样式为例
            allLayersId.push(i);
        }
        //loadStyle接口：
        //* @param {Array} [showLayers]   要显示的图层序号组成的数组，可选参数，默认全部图层显示
        //* @param {Array} [hideLayers]   要隐藏的图层序号组成的数组，可选参数
        // * @param {Boolean} [hard]   是否强制重新获取图层样式，在更新图层的spriteUrl 或 styleUrl 后必须设为true,默认false
        //* @param {Function} [callback]   回调函数，预留使用
        compositeLayer.loadStyle(null,allLayersId);
    }


    var addVectorMark = document.getElementById("addVectorMark");
    addVectorMark.onclick = function () {
        var layersId = [];
        var layers = compositeLayer.glStyle.layers;
        // 获取要标注的矢量瓦片图层序号（此处选取source 为poi、 全国省市县乡、省市县乡注记）的图层
        for(var i=0,len= layers.length;i<len;i++){
            var source  = layers[i].source;
            if(source==="poi"|| source==="全国省市县乡" || source==="省市县乡注记"){
                layersId.push(i);
            }
        }

        //矢量瓦片图层加载样式
        compositeLayer.loadStyle(layersId);

    }



    function setZoomLevel() {
        var zoomLevel = document.getElementById("zoomLevel");
        zoomLevel.innerHTML="级别:"+egismap.getZoomLevel();
    }
    setZoomLevel();
    //查看zoom层级
    egismap.on("resolutionchanged", function () {
        setZoomLevel();
    })


});