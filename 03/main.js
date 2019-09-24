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

/// a3. 從 ol-layer-ArcGISFeatureLayer.js 載入ArcGIS Feature Layer模組
var ArcGISFeatureLayer = ol.layer.ArcGISFeatureLayer;


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
var nlscLayer = new NLSCLayer('EMAP01');
map.addLayer(nlscLayer);

/// c2.  加入ArcGIS Feature Layer
var mrtLayerUrl = 'https://services7.arcgis.com/6Ol5XjNkyqW9i58W/ArcGIS/rest/services/%E5%8F%B0%E5%8C%97%E6%8D%B7%E9%81%8B%E7%AB%99%E9%BB%9E/FeatureServer/0';
var mrtLayer = new ArcGISFeatureLayer(mrtLayerUrl, map);

map.addLayer(mrtLayer);


}); // End