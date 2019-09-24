$(document).ready(function() {

/*----------------------------- 
 * a. 載入模組
 *----------------------------*/  
/// a1. 載入Openlayers內建模組
var Map = ol.Map; 
var View = ol.View;
var {fromLonLat} = ol.proj;

var EsriJSON = ol.format.EsriJSON;

var VectorSource = ol.source.Vector;
var VectorLayer = ol.layer.Vector;

/// a2. 從 ol-layer-NLSCLayer.js 載入國土測繪中心圖層模組
var NLSCLayer = ol.layer.NLSCLayer; 

/// a3. 從 ol-arcgis-tasks.js 載入查詢模組
var {Query, QueryTask, Constants} = ol.arcgis.tasks;

/// a4. 從 ol-style-Symbols 載入預先定義的樣式符號
var Symbols = ol.style.Symbols;


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


/*----------------------------- 
 * d. 建立下拉選單內容
 *----------------------------*/
// 欲查詢的圖層網址
var schoolLayerUrl = "https://services6.arcgis.com/UsLrDOKX8FxYPd3f/ArcGIS/rest/services/%e5%8f%b0%e7%81%a3%e5%ad%b8%e6%a0%a1%e5%88%86%e5%b8%83/FeatureServer/0";

// 建立屬性下拉選單內容
funcs.query.field(schoolLayerUrl)
 .then(funcs.create.fieldMenu, funcs.errHandler);

// 建立屬性值下拉選單內容
$('#field').on('change', function (evt){
    var field = $(this).val();

    funcs.query.distinctValues(schoolLayerUrl, field)
        .then(funcs.create.valueMenu, funcs.errHandler);
});

/*----------------------------- 
 * e. 建立查詢結果圖層
 *----------------------------*/
var resultLayer = new VectorLayer({ 
    source: new VectorSource(),
    style: Symbols.point['star']
});

map.addLayer(resultLayer);

/*----------------------------- 
 * f. 執行屬性查詢
 *----------------------------*/
$('#startQuery').on('click', function (evt){
    var url = schoolLayerUrl;
    var field = $('#field').val();
    var value = $('#value').val();

    // 建立查詢參數
    var params = new Query();
        params.where = field + "='" + value + "'" ; // where子句，例如： 類型='小學'
        params.returnGeometry = true; 
        params.outFields = ['*']; // 輸出的欄位名稱，'*'代表輸入所有欄位資料
        /// 輸出的座標系統，WGS84 => 4326  TWD97 => 3826
        params.outSR = map.getView().getProjection().getCode().split(':')[1]; 
        params.f = 'json';

    // 將查詢參數傳送到ArcGIS Server，等待回傳結果
    var queryTask = new QueryTask(url);
        
        queryTask.execute(params).then(
            addQueryResultToMap, 
            funcs.errHandler
        );
});

function addQueryResultToMap(response){
    var arcgisFeatures = JSON.parse(response);

    // 將ArcGIS Features轉成Openlayers Features格式
    var olFeatures = new EsriJSON().readFeatures(arcgisFeatures);

    // 將Openlayers Features結果更新到結果圖層上
    resultLayer.getSource().clear();
    resultLayer.getSource().addFeatures(olFeatures);

    // 將地圖縮放至圖層範圍
    var extent = resultLayer.getSource().getExtent();
    map.getView().fit( extent, map.getSize() );
}



});