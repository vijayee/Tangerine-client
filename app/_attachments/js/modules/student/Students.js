var Students,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Students = (function(_super) {

  __extends(Students, _super);

  function Students() {
    Students.__super__.constructor.apply(this, arguments);
  }

  Students.prototype.model = Student;

  Students.prototype.url = "student";

  return Students;

})(Backbone.Collection);
