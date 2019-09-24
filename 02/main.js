$(document).ready(function() { 

/*----------------------------- 
 * a. 載入模組
 *----------------------------*/   
/// a1. 載入Openlayers內建模組
var Map = ol.Map; 
var View = ol.View;
var {fromLonLat} = ol.proj;

/// a2. 從 ol-layer-NLSCLayer.js 載入國土測繪中心圖層模組
var NLSCLayer = ol.layer.NLSCLayer;


/*----------------------------- 
 * b. 建立圖框控制器與地圖容器
 *----------------------------*/
/// b1. 建立圖框控制器 MapView
var mapView = new View({
    center: new fromLonLat([121.537056, 25.046219]),
    zoom  : 13
});

/// b2. 建立地圖容器
var map = new Map({
    target: 'map',
    view  : mapView
});


/*----------------------------- 
 * c. 加入圖層
 *----------------------------*/
/// c1. 載入國土測繪中心圖磚作為底圖
/**
 *   EMAP      臺灣通用電子地圖
 *   EMAP01    臺灣通用電子地圖(灰階)
 *   EMAP2     臺灣通用電子地圖透明
 *   EMAP5     臺灣通用電子地圖(套疊等高線)
 *   EMAP8     臺灣通用電子地圖EN
 *   B5000     1/5000基本地形圖
 *   MB5000    1/5000圖幅框
 *   LUIMAP    國土利用調查成果圖
 *   LANDSECT  段籍圖
 */
var nlscLayer = new NLSCLayer('EMAP01');
map.addLayer(nlscLayer);

}); // End