// Generated by CoffeeScript 1.6.2
var exportValue, pair, pairsGrid, utils;

utils = require("views/lib/utils");

pair = utils.pair;

exportValue = utils.exportValue;

pairsGrid = function(subtest) {
  var i, item, row, variableName, _i, _len, _ref;

  log("subtest exists? " + (subtest != null));
  row = [];
  variableName = subtest.data.variable_name;
  row.push(pair("" + variableName + "_auto_stop", subtest.data.auto_stop));
  row.push(pair("" + variableName + "_time_remain", subtest.data.time_remain));
  row.push(pair("" + variableName + "_attempted", subtest.data.attempted));
  row.push(pair("" + variableName + "_item_at_time", subtest.data.item_at_time));
  row.push(pair("" + variableName + "_time_intermediate_captured", subtest.data.time_intermediate_captured));
  _ref = subtest.data.items;
  for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
    item = _ref[i];
    row.push(pair("" + variableName + (i + 1), exportValue(item.itemResult)));
  }
  return row;
};

if (typeof exports === "object") {
  exports.pairsGrid = pairsGrid;
}