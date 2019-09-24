(function (global){

// 載入 Openlayers 模組  
var {Icon, Fill, Stroke, Style} = ol.style;
var RegularShape = ol.style.RegularShape;

var stroke = new Stroke({color: 'black', width: 2});
var fill = new Fill({color: 'orange'})

var point = {
    'square': new Style({
        image: new RegularShape({
            fill: fill,
            stroke: stroke,
            points: 4,
            radius: 10,
            angle: Math.PI / 4
        })
    }),
    'triangle': new Style({
        image: new RegularShape({
            fill: fill,
            stroke: stroke,
            points: 3,
            radius: 10,
            rotation: Math.PI / 4,
            angle: 0
        })
    }),
    'star': new Style({
        image: new RegularShape({
            fill: fill,
            stroke: stroke,
            points: 5,
            radius: 10,
            radius2: 4,
            angle: 0
        })
    }),
    'cross': new Style({
        image: new RegularShape({
            fill: fill,
            stroke: stroke,
            points: 4,
            radius: 10,
            radius2: 0,
            angle: 0
        })
    }),
    'x': new Style({
        image: new RegularShape({
            fill: fill,
            stroke: stroke,
            points: 4,
            radius: 10,
            radius2: 0,
            angle: Math.PI / 4
        })
    })
};

var polyline = {
    'blue': new Style({
        stroke: new Stroke({
            color: 'blue',
            width: 1
        })
    }),
    'green': new Style({
        stroke: new Stroke({
            color: 'green',
            width: 1
        })
    }),
    'red': new Style({
        stroke: new Stroke({
            color: 'red',
            width: 1
        })
    }),
    'orange': new Style({
        stroke: new Stroke({
            color: 'orange',
            width: 1
        })
    })
};

polygon = {
    'blue': new Style({
        stroke: new Stroke({ 
            color: 'blue', 
            lineDash: [4], 
            width: 3 
        }),
        fill: new Fill({ color: 'rgba(255, 255, 255, 0.1)'})
    }),
    'green': new Style({
        stroke: new Stroke({ 
            color: 'green', 
            lineDash: [4], 
            width: 3 
        }),
        fill: new Fill({ color: 'rgba(255, 255, 255, 0.1)'})
    }),
    'red': new Style({
        stroke: new Stroke({ 
            color: 'red', 
            lineDash: [4], 
            width: 3 
        }),
        fill: new Fill({ color: 'rgba(255, 255, 255, 0.1)'})
    }),
    'orange': new Style({
        stroke: new Stroke({ 
            color: 'orange', 
            lineDash: [4], 
            width: 3 
        }),
        fill: new Fill({ color: 'rgba(255, 255, 255, 0.1)'})
    })
};

// 匯出模組
global.ol.style.Symbols = {
    point   : point,
    polyline: polyline,
    polygon : polygon
}

}(window));