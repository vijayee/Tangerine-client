// Generated by CoffeeScript 1.10.0
var Klasses,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Klasses = (function(superClass) {
  extend(Klasses, superClass);

  function Klasses() {
    return Klasses.__super__.constructor.apply(this, arguments);
  }

  Klasses.prototype.model = Klass;

  Klasses.prototype.url = 'klass';

  Klasses.prototype.pouch = {
    viewOptions: {
      key: 'klass'
    }
  };

  return Klasses;

})(Backbone.Collection);