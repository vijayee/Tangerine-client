// Generated by CoffeeScript 1.10.0
var TabletUsers,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

TabletUsers = (function(superClass) {
  extend(TabletUsers, superClass);

  function TabletUsers() {
    return TabletUsers.__super__.constructor.apply(this, arguments);
  }

  TabletUsers.prototype.model = TabletUser;

  TabletUsers.prototype.url = 'user';

  TabletUsers.prototype.pouch = {
    viewOptions: {
      key: 'user'
    }
  };

  return TabletUsers;

})(Backbone.Collection);