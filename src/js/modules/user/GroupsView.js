// Generated by CoffeeScript 1.10.0
var GroupsView,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

GroupsView = (function(superClass) {
  extend(GroupsView, superClass);

  function GroupsView() {
    return GroupsView.__super__.constructor.apply(this, arguments);
  }

  GroupsView.prototype.className = "GroupsView";

  GroupsView.prototype.events = {
    'click .account': 'gotoAccount',
    'click .goto': 'gotoGroup'
  };

  GroupsView.prototype.gotoAccount = function() {
    return Tangerine.router.navigate("account", true);
  };

  GroupsView.prototype.gotoGroup = function(event) {
    var group;
    group = $(event.target).attr("data-group");
    return window.location = Tangerine.settings.urlIndex(group, "assessments");
  };

  GroupsView.prototype.render = function() {
    var group, groups, html, i, j, len;
    groups = Tangerine.user.get("groups") || [];
    html = "<button class='account navigation'>Account</button> <h1>Groups</h1>";
    if (groups.length === 0) {
      html += "You are not yet a member of a group. Go to Account to join a group.";
    } else {
      for (i = j = 0, len = groups.length; j < len; i = ++j) {
        group = groups[i];
        html += "<button class='command goto' data-group='" + (_.escape(group)) + "'>" + group + "</button>";
      }
    }
    this.$el.html(html);
    return this.trigger("rendered");
  };

  return GroupsView;

})(Backbone.View);