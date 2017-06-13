var mongoose = require('mongoose');  
var Schema = mongoose.Schema;  
var models = require("./model");  
for(var m in models){  
    mongoose.model(m, new Schema(models[m]));  
}  
module.exports = {      //返回一个user model
    getModel:function (type) {  
        return _getModel(type);  
    }  
};  
var _getModel = function (type) {  
    return mongoose.model(type);  
}; 