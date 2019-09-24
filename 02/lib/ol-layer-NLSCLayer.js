(function (global, $){
    // 載入openlayes模組
    var TileLayer = ol.layer.Tile;
    var {XYZ} = ol.source;

    // NLSCLayer
    var NLSCLayer = function (layerName){
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
        var layerName = layerName || 'EMAP';

        var NLSCLayerUrl = 'https://wmts.nlsc.gov.tw/wmts/' + layerName + 
                       '/default/GoogleMapsCompatible/{z}/{y}/{x}';
        
        return new TileLayer({
            source: new XYZ({
                url: NLSCLayerUrl,
                attributions: '© 國土測繪中心'
            })
        });
    }

    global.ol.layer.NLSCLayer = NLSCLayer;

}(window, jQuery));