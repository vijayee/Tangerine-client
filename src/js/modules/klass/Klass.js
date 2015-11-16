// Generated by CoffeeScript 1.10.0
var Klass,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Klass = (function(superClass) {
  extend(Klass, superClass);

  function Klass() {
    return Klass.__super__.constructor.apply(this, arguments);
  }

  Klass.prototype.url = "klass";

  Klass.prototype.initialize = function() {};

  Klass.prototype.destroy = function() {
    var allResults, allStudents, klassId;
    klassId = this.id;
    allStudents = new Students;
    allStudents.fetch({
      success: function(studentCollection) {
        var i, len, results1, student, students;
        students = studentCollection.where({
          "klassId": klassId
        });
        results1 = [];
        for (i = 0, len = students.length; i < len; i++) {
          student = students[i];
          results1.push(student.save({
            "klassId": ""
          }));
        }
        return results1;
      }
    });
    allResults = new Results;
    allResults.fetch({
      success: function(resultCollection) {
        var i, len, result, results, results1;
        results = resultCollection.where({
          "klassId": klassId
        });
        results1 = [];
        for (i = 0, len = results.length; i < len; i++) {
          result = results[i];
          results1.push(result.destroy());
        }
        return results1;
      }
    });
    return Klass.__super__.destroy.call(this);
  };

  Klass.prototype.calcCurrentPart = function() {
    var milliseconds, millisecondsPerDay, millisecondsPerHour, millisecondsPerMinute, millisecondsPerWeek;
    milliseconds = 1000;
    millisecondsPerMinute = 60 * milliseconds;
    millisecondsPerHour = 60 * millisecondsPerMinute;
    millisecondsPerDay = 24 * millisecondsPerHour;
    millisecondsPerWeek = 7 * millisecondsPerDay;
    return Math.round(((new Date()).getTime() - this.get("startDate")) / millisecondsPerWeek);
  };

  return Klass;

})(Backbone.Model);