// Generated by CoffeeScript 1.10.0
var Teachers,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Teachers = (function(superClass) {
  extend(Teachers, superClass);

  function Teachers() {
    return Teachers.__super__.constructor.apply(this, arguments);
  }

  Teachers.prototype.model = Teacher;

  Teachers.prototype.url = "teacher";

  Teachers.prototype.pouch = {
    viewOptions: {
      key: 'teacher'
    }
  };

  return Teachers;

})(Backbone.Collection);
