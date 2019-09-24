(function (global, $){

/// 從 ol-arcgis-tasks.js 載入查詢模組
var {Query, QueryTask, Constants} = ol.arcgis.tasks;

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

function createFieldsMenu(response){
    $('#field').empty();
    var fields = JSON.parse(response).fields;
    fields.forEach(function (field){
        var fieldName  = field.name;
        var fieldAlias = field.alias;

        var optionHTML = '<option value="' + fieldName + '">' + fieldAlias + '</option>';
        $('#field').append(optionHTML);
    });    
}

function createValuesMenu(response){
    // 清除下拉選單內容
    $('#value').empty();

    var field = $('#field').val();
    var values = JSON.parse(response).features;

    values.forEach(function (value){
        var attr  = value.attributes[field];
        var optionHTML = '<option value="' + attr + '">' + attr + '</option>';
        $('#value').append(optionHTML);
    });        
}

function queryFields(url){
    var queryTask = new QueryTask(url);
    return queryTask.executeForFields();
}

function queryDistinctValues(url, field){
    var query = new Query();
        query.f = 'json';
        query.returnGeometry = false;
        query.outFields = ['*'];
        query.groupByFieldsForStatistics = [field];
        query.outStatistics = [{
            "statisticType":"count",
            "onStatisticField": field,
            "outStatisticFieldName":"countOF" + field
        }];
        query.outSR = 102100

    var queryTask = new QueryTask(url);
    return queryTask.execute(query);
}

function errHandler(error){
    throw error;
}

// 輸出模組
var funcs = namespace('global.funcs');
    funcs.errHandler = errHandler;

var create = namespace('global.funcs.create');
    create.fieldMenu = createFieldsMenu;
    create.valueMenu = createValuesMenu;

var query = namespace('global.funcs.query');
    query.field = queryFields;
    query.distinctValues = queryDistinctValues;

}(window, jQuery));