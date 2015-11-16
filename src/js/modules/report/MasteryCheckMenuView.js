// Generated by CoffeeScript 1.10.0
var MasteryCheckMenuView,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

MasteryCheckMenuView = (function(superClass) {
  extend(MasteryCheckMenuView, superClass);

  function MasteryCheckMenuView() {
    return MasteryCheckMenuView.__super__.constructor.apply(this, arguments);
  }

  MasteryCheckMenuView.prototype.className = "MasteryCheckMenuView";

  MasteryCheckMenuView.prototype.events = {
    'change .student_selector': 'gotoMasteryCheckReport'
  };

  MasteryCheckMenuView.prototype.gotoMasteryCheckReport = function(event) {
    return Tangerine.router.navigate("report/masteryCheck/" + this.$el.find(event.target).find(":selected").attr("data-studentId"), true);
  };

  MasteryCheckMenuView.prototype.initialize = function(options) {
    var allStudents;
    this.parent = options.parent;
    this.klass = this.parent.options.klass;
    this.curricula = this.parent.options.curricula;
    allStudents = new Students;
    return allStudents.fetch({
      success: (function(_this) {
        return function(collection) {
          _this.students = collection.where({
            klassId: _this.klass.id
          });
          _this.ready = true;
          return _this.render();
        };
      })(this)
    });
  };

  MasteryCheckMenuView.prototype.render = function() {
    var html, i, len, ref, student;
    if (this.ready) {
      if (this.students.length === 0) {
        this.$el.html("Please add students to this class.");
        return;
      }
      html = "<select class='student_selector'> <option disabled='disabled' selected='selected'>" + (t('select a student')) + "</option>";
      ref = this.students;
      for (i = 0, len = ref.length; i < len; i++) {
        student = ref[i];
        html += "<option data-studentId='" + student.id + "'>" + (student.get('name')) + "</option>";
      }
      html += "</select>";
      return this.$el.html(html);
    } else {
      return this.$el.html("<img src='images/loading.gif' class='loading'>");
    }
  };

  return MasteryCheckMenuView;

})(Backbone.View);