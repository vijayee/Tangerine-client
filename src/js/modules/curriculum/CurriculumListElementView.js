// Generated by CoffeeScript 1.10.0
var CurriculumListElementView,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

CurriculumListElementView = (function(superClass) {
  extend(CurriculumListElementView, superClass);

  function CurriculumListElementView() {
    this["delete"] = bind(this["delete"], this);
    return CurriculumListElementView.__super__.constructor.apply(this, arguments);
  }

  CurriculumListElementView.prototype.className = "CurriculumListElementView";

  CurriculumListElementView.prototype.tagName = "li";

  CurriculumListElementView.prototype.events = {
    'click .toggle_menu': 'toggleMenu',
    'click .duplicate': 'duplicate',
    'click .delete': 'deleteToggle',
    'click .delete_cancel': 'deleteToggle',
    'click .delete_confirm': 'delete'
  };

  CurriculumListElementView.prototype.initialize = function(options) {
    this.curriculum = options.curriculum;
    return this.subtests = options.subtests;
  };

  CurriculumListElementView.prototype.duplicate = function() {
    var newName;
    newName = "Copy of " + this.curriculum.get("name");
    return this.curriculum.duplicate({
      name: newName
    }, null, null, (function(_this) {
      return function(curriculum) {
        return _this.curriculum.trigger("new", curriculum);
      };
    })(this));
  };

  CurriculumListElementView.prototype.toggleMenu = function() {
    this.$el.find(".sp_down, .sp_right").toggleClass('sp_down').toggleClass('sp_right');
    return this.$el.find(".menu").fadeToggle(150);
  };

  CurriculumListElementView.prototype.deleteToggle = function() {
    this.$el.find(".delete_confirm").fadeToggle(250);
    return false;
  };

  CurriculumListElementView.prototype["delete"] = function() {
    return this.curriculum.destroy();
  };

  CurriculumListElementView.prototype.render = function() {
    var deleteButton, deleteConfirm, downloadKey, duplicateButton, editButton, menu, name, toggleButton;
    toggleButton = "<div class='toggle_menu sp_right'><div> </div></div>";
    editButton = "<a href='#curriculum/" + this.curriculum.id + "'><img class='link_icon edit' title='Edit' src='images/icon_edit.png'></a>";
    duplicateButton = "<img class='link_icon duplicate' title='Duplicate' src='images/icon_duplicate.png'>";
    deleteButton = "<img class='delete link_icon' title='Delete' src='images/icon_delete.png'>";
    deleteConfirm = "<span class='delete_confirm'><div class='menu_box'>Confirm <button class='delete_yes command_red'>Delete</button> <button class='delete_cancel command'>Cancel</button></div></span>";
    downloadKey = "<span class='download_key small_grey'>Download key <b>" + (this.curriculum.id.substr(-5, 5)) + "</b></span>";
    name = "<span class='toggle_menu'>" + (this.curriculum.escape('name')) + "</span>";
    if (Tangerine.user.isAdmin()) {
      menu = editButton + " " + duplicateButton + " " + deleteButton + " " + downloadKey + " " + deleteConfirm;
    }
    if (!Tangerine.user.isAdmin()) {
      menu = editButton + " " + downloadKey;
    }
    this.$el.html("<div> " + toggleButton + " " + name + " </div> <div> <div class='confirmation menu'> " + menu + " </div> </div>");
    return this.trigger("rendered");
  };

  return CurriculumListElementView;

})(Backbone.View);
