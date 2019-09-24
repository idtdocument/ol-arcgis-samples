(function (global, $){

/*----------------------------- 
 * 載入 Openlayers 模組
 *----------------------------*/
var VectorSource = ol.source.Vector;
var VectorLayer = ol.layer.Vector;

var EsriJSON = ol.format.EsriJSON;

var {Icon, Fill, Stroke, Style} = ol.style;
var RegularShape = ol.style.RegularShape;

/*----------------------------- 
 *  樣式符號
 *----------------------------*/
var Symbol = {
    point: function (){
        return new Style({
            image: new RegularShape({
                fill: new Fill({color: 'orange'}),
                stroke: new Stroke({color: 'black', width: 2}),
                points: 5,
                radius: 10,
                radius2: 4,
                angle: 0
            })
        });
    },
    polyline: function (){           
        return new Style({
            stroke: new Stroke({
                color: 'orange',
                width: 1
            })
        });
    },
    polygon: function (){
        return new Style({
            stroke: new Stroke({ 
                color: 'orange', 
                lineDash: [4], 
                width: 3 
            }),
            fill: new Fill({ color: 'rgba(255, 255, 255, 0.1)'})
        });
    }
};


/*----------------------------- 
 *  查詢
 *----------------------------*/
var Query = function (){};

var QueryTask = function (url){
    this.url = url;
};

QueryTask.prototype = {
    endpoint: function (Query){
        return this.url + '/query?' + this._queryUri(Query);
    },        
    execute: function (Query, callback, errback) {
        var endpoint = this.endpoint(Query);

        var result = $.post(endpoint);
            result.done(callback);
            result.fail(errback);

        return result; 
    },
    executeForFields: function(callback, errback) {
        var endpoint = this.url + '?f=json';

        var result = $.post(endpoint);
            result.done(callback);
            result.fail(errback);

        return result;
    },
    _queryUri: function (Query){
        var uri = '';
        for (key in Query) {
            if (key in this._uri){
                uri += ( key + '=' + this._uri[key](Query[key]) + '&' );
            }
            else {
                uri += ( key + '=' + Query[key] + '&' );
            }
        }
        
        return  uri.slice(0, -1);
    },
    _uri: {
        geometry: function (geometry){
            return encodeURIComponent(JSON.stringify(geometry));
        },
        outFields: function (outFields){
            var length = outFields.length;
            if(length === 1) 
                return outFields[0];
            else
                return outFields.join(',');
        },
        outStatistics: function(outStatistics){
            return encodeURIComponent(JSON.stringify(outStatistics));
        },
        groupByFieldsForStatistics: function(groupByFieldsForStatistics){
            var length = groupByFieldsForStatistics.length;
            if(length === 1) 
                return groupByFieldsForStatistics[0];
            else
                return groupByFieldsForStatistics.join(',');
        },
        objectIds: function (objectIds){
            var length = objectIds.length;
            if(length === 1) 
                return objectIds[0];
            else
                return objectIds.join(',');
            
        },
        orderByFields: function (orderByFields){
            var length = orderByFields.length;
            if(length === 1) 
                return orderByFields[0];
            else
                return orderByFields.join(',');
        }
    }//End of _uri
};

var Constants = {        
    GeometryType:{
        'point'      : 'esriGeometryPoint',
        'polyline'   : 'esriGeometryPolyline',
        'polygon'    : 'esriGeometryPolygon',
        'extent'     : 'esriGeometryEnvelope',
        'multipoint' : 'esriGeometryMultipoint'
    },
    SpatialRelation:{
        'intersect': 'esriSpatialRelIntersects', 
        'contain': 'esriSpatialRelContains',
        'crosse': 'esriSpatialRelCrosses',
        'envelopeIntersect': 'esriSpatialRelEnvelopeIntersects', 
        'indexIntersect': 'esriSpatialRelIndexIntersects',
        'overlap': 'esriSpatialRelOverlaps', 
        'touche': 'esriSpatialRelTouches', 
        'within': 'esriSpatialRelWithin'
    }       
};


/*----------------------------- 
 *  ArcGIS Geographic Information
 *----------------------------*/
ol2ArcGIS = {
    extent: function (extent, epsg_code){
        return {
            xmin: extent[0],
            ymin: extent[1],
            xmax: extent[2],
            ymax: extent[3],
            spatialReference: { wkid: epsg_code } 
        };
    },
    map: {
        sr: function (map){
            return map.getView().getProjection().getCode().split(':')[1];
        }
    }
};

/*----------------------------- 
 *  funcs
 *----------------------------*/
var errHandler = function (error){
    throw error;
};

/*----------------------------- 
 * ArcGIS Feature Layer
 *----------------------------*/
var ArcGISFeatureLayer = function (url, map){
    this.url = url;
    this.map = map;

    this.source = null;
    this.fields = null;
    this.geometryType = null;

    this._loadLayerInfo();

    var layer = new VectorLayer({
        source: this._loadSource(this)
    });

    this.layer = layer;
    this.layer.ext = {
        name: null,
        geometryType: null,
        popTemplate: {
            title: null,
            attributes: null
        }
    };
    return layer;
};

ArcGISFeatureLayer.prototype = {
    _extPopAttributes: function (fields){
        var attrs = {};
            fields.forEach(function (field){
                // console.dir(field);
                attrs[field.name] = { title: field.alias };
            });
            return attrs;
    },
    _loadLayerInfo: function (){
        $.post(this.url + '?f=pjson').then(function (layerInfo){
            var layerInfo = JSON.parse(layerInfo);

            var ext = this.layer.ext;
                ext.name = layerInfo.name;
                ext.geometryType = layerInfo.geometryType;
                ext.popTemplate = {
                    title: layerInfo.name,
                    attributes: this._extPopAttributes(layerInfo.fields)
                };
            // set feature layer style
            if(ext.geometryType === Constants.GeometryType['point'])
                this.layer.setStyle(Symbol['point']);
            if(ext.geometryType === Constants.GeometryType['polyline'])
                this.layer.setStyle(Symbol['polyline']);
            if(ext.geometryType === Constants.GeometryType['polygon'])
                this.layer.setStyle(Symbol['polygon']);
            if(ext.geometryType === Constants.GeometryType['extent'])
                this.layer.setStyle(Symbol['polygon']);
        }.bind(this));
    },
    _defaultParams: function (map){
        var extent = map.getView().calculateExtent();
        var SR     = ol2ArcGIS.map.sr(map);

        var query = new Query();
            query.geometry = ol2ArcGIS.extent(extent, SR);
            query.geometryType = Constants.GeometryType['extent'];
            query.inSR = SR;
            query.spatialRel = Constants.SpatialRelation['intersect'];
            query.returnGeometry = true;
            query.outFields = ['*'];
            query.outSR = SR;
            query.f = 'json';

        return query;
    },
    _loadSource: function (layer){
        var vectorsource = new VectorSource({
            loader: function (){
                var query = layer._defaultParams(layer.map);
                var queryTask = new QueryTask(layer.url);
                queryTask.execute(query, layer._addFeatures.bind(layer), errHandler);               
            },
            strategy: function(extent, resolution) {
                if(this.resolution && this.resolution != resolution){
                    this.loadedExtentsRtree_.clear();
                }
                return [extent];
            }
        });
        this.source = vectorsource;
        return vectorsource;
    },
    _addFeatures: function (response){
        if (response.error) {
            errHandler(response.error);
        } 
        else {
            var features = new EsriJSON().readFeatures(response, {
                featureProjection: ol2ArcGIS.map.sr(this.map)
            });
            if (features.length > 0) {
                this.source.addFeatures(features);
            }
        }
    }
};

// 匯出模組
global.ol.layer.ArcGISFeatureLayer = ArcGISFeatureLayer;


}(window, jQuery));