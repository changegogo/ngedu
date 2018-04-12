/**
 * device model.
 *
 * @file    Device.js
 * @author  lengchao
 * @version
 * @date    2016-05-14
 */

"use strict";

var Sequelize = require( "sequelize" );
var db = require( "./db" );
var sequelize = db.sequelize;
var prefix = db.tablePrefix;

var Device = sequelize.define(
     "device"
    ,{
        "name": {
             "type" : Sequelize.STRING(200)
            ,"field": "device_name"
        }
        ,"remark": {
             "type" : Sequelize.STRING(2000)
            ,"field":"remark"
        }
        ,"sort": {
             "type"        : Sequelize.INTEGER
            ,"defaultValue": 50000
            ,"field"       : "sortnumber"
        }
    }
    ,{
        "tableName": prefix + "device"
    }
);

module.exports = Device;

// should include Device
Device.planDevices = function(devices) {
  console.assert(Array.isArray(devices), "输入必须是数组元素");
  return devices.map(function(device) {
    return device.name;
  });

};
