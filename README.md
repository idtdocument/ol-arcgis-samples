# ol-arcgis-example

## 範例1. Open Layers 5 起手式 [【來去瞧瞧】](https://idtdocument.github.io/ol-arcgis-samples/01)

## 範例2. 加入國土測繪底圖 [【來去瞧瞧】](https://idtdocument.github.io/ol-arcgis-samples/02)

#### 國土測繪中心圖磚服務

國土測繪中心圖磚服務以 `WMTS` 格式提供資料，透過網頁程式介接時，需要先下載WMTS定義檔[wmts.xml](https://wmts.nlsc.gov.tw/wmts)進行分析後，再對所需的圖磚進行呼叫。

然而國土測繪中心WMTS定義檔沒有包含 [跨來源資源共用(Cross-Origin Resource Sharing, CORS)](https://developer.mozilla.org/zh-TW/docs/Web/HTTP/CORS) 的HTTP標頭，直接透過網頁呼叫會產生CORS的錯誤。

為了讓網頁地圖可以直接呼叫圖磚圖層服務，大部分的網頁地圖程式開發套件都會包含圖磚服務網址解析模組，以便直接取得需求的圖磚，例如 ArcGIS API for Javascript 的[WebTileLayer](https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-WebTileLayer.html)模組、Openlayers API的[XYZ](https://openlayers.org/en/latest/apidoc/module-ol_source_XYZ-XYZ.html)模組、Leaflet的[TileLayer](https://leafletjs.com/reference-1.5.0.html#tilelayer)模組。

### 使用方式

本範例使用Openlayers的XYZ模組來介接國土測繪中心的圖磚服務。為了方便使用，已經將國土測繪中心圖磚圖層製作成單一模組(ol-arcgis-NLSCLayer.js)，使用步驟如下：

1. 在HTML文件中，使用script標籤，載入`ol-arcgis-NLSCLayer.js`，例如：
   ```<script src='./lib/ol-layer-NLSCLayer.js'></script>```

2. 在.js文件中載入NLSCLayer模組，例如： 
   ```var NLSCLayer = ol.layer.NLSCLayer;```

3. 在.js文件中使用`建構式`建立圖層實體，例如：
   ```var nlscLayer = new NLSCLayer('EMAP01');```

4. 呼叫地圖方法addLayer加入圖磚圖層，例如：
   ```map.addLayer(nlscLayer);```

## 範例3. 加入ArcGIS Feature Layer [【來去瞧瞧】](https://idtdocument.github.io/ol-arcgis-samples/03)

## 範例4. 圖層的資訊視窗 [【來去瞧瞧】](https://idtdocument.github.io/ol-arcgis-samples/04)

## 範例5. ArcGIS圖層 屬性查詢 [【來去瞧瞧】](https://idtdocument.github.io/ol-arcgis-samples/05)

## 範例6. ArcGIS圖層 屬性查詢 [【來去瞧瞧】](https://idtdocument.github.io/ol-arcgis-samples/06)