(function (global, $){
    // 載入openlayers 模組
    var EsriJSON = ol.format.EsriJSON;

    // 命名空間
    var namespace = function (ns_string) {
        var parts = ns_string.split('.'), 
            parent = global,
            i;
        if (parts[0] === "global") {
            parts = parts.slice(1);       
        }

        for (i = 0; i < parts.length; i++){
            // 若沒有這物件沒有這個屬性 則視為空物件
            if (typeof parent[parts[i]] === "undefined") {
                parent[parts[i]] = {};
            }
            parent = parent[parts[i]];
        }
        return parent;
    };

    /**
     * Query
     */
    var Query = function (){
         /* 
         * <params> Object
         *  distance                  : <Number> Buffer distance for input geometries.
         *  geometry                  : <ArcGIS Geometry> ArcGIS Geometry實體
         *  geometryPrecision         : <Number> 指定查詢操作返回的幾何參數的小數位數。
         *  geometryType              : <string> 請查閱 Contants.GeometryType
         *  groupByFieldsForStatistics: <String[]>
         *  inSR                      : <string> EPSG Code,  The spatial reference of the input geometry.
         *  where                     : <string>
         *  spatialRel                : <string> esriSpatialRelIntersects | esriSpatialRelContains | esriSpatialRelCrosses | esriSpatialRelEnvelopeIntersects | esriSpatialRelIndexIntersects | esriSpatialRelOverlaps | esriSpatialRelTouches | esriSpatialRelWithin
         *  returnGeometry            : <boolean> 
         *  outSR                     : <string> EPSG Code,  The spatial reference of the output geometry.
         *  outFields                 : <string> '*' or 'field1', 'field2', 'field3'
         *  f                         : <string> return format,  'json' or
         */
    };

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

    /**
     * Export Modules
     */
    var tasks = namespace('global.ol.arcgis.tasks');
        tasks.Query = Query;
        tasks.QueryTask = QueryTask;
        tasks.Constants = Constants;

}(window, jQuery));