// Generated by CoffeeScript 1.7.1
(function(head, req) {
  var columnKeys, columnsBySubtest, key, pair, row, subtest, subtestIndex, undone, value, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref;
  start({
    "headers": {
      "content-type": "application/json"
    }
  });
  unpair = function(pair) { for (var key in pair) {return [key, pair[key]] }} ;
  columnKeys = [];
  columnsBySubtest = [];
  while (row = getRow()) {
    _ref = row.value;
    for (subtestIndex = _i = 0, _len = _ref.length; _i < _len; subtestIndex = ++_i) {
      subtest = _ref[subtestIndex];
      if (columnsBySubtest[subtestIndex] == null) {
        columnsBySubtest[subtestIndex] = [];
      }
      for (_j = 0, _len1 = subtest.length; _j < _len1; _j++) {
        pair = subtest[_j];
        undone = unpair(pair);
        if (undone == null) {
          continue;
        }
        key = undone[0] || "";
        value = undone[1] || "";
        if (!~columnsBySubtest[subtestIndex].indexOf(key)) {
          columnsBySubtest[subtestIndex].push(key);
        }
      }
    }
  }
  for (_k = 0, _len2 = columnsBySubtest.length; _k < _len2; _k++) {
    subtest = columnsBySubtest[_k];
    for (_l = 0, _len3 = subtest.length; _l < _len3; _l++) {
      key = subtest[_l];
      columnKeys.push(key);
    }
  }
  send(JSON.stringify(columnKeys));
});
