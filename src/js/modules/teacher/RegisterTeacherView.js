// Generated by CoffeeScript 1.10.0
var RegisterTeacherView,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

RegisterTeacherView = (function(superClass) {
  extend(RegisterTeacherView, superClass);

  function RegisterTeacherView() {
    return RegisterTeacherView.__super__.constructor.apply(this, arguments);
  }

  RegisterTeacherView.prototype.className = "RegisterTeacherView";

  RegisterTeacherView.prototype.events = {
    'click .register': 'register',
    'click .cancel': 'cancel'
  };

  RegisterTeacherView.prototype.initialize = function(options) {
    this.name = options.name;
    this.pass = options.pass;
    return this.fields = ["first", "last", "gender", "school", "contact"];
  };

  RegisterTeacherView.prototype.cancel = function() {
    return Tangerine.router.login();
  };

  RegisterTeacherView.prototype.register = function() {
    return this.validate((function(_this) {
      return function() {
        return _this.saveUser();
      };
    })(this));
  };

  RegisterTeacherView.prototype.validate = function(callback) {
    var element, errors, i, len, ref;
    errors = false;
    ref = this.fields;
    for (i = 0, len = ref.length; i < len; i++) {
      element = ref[i];
      if (_.isEmpty(this[element].val())) {
        this.$el.find("#" + element + "_message").html("Please fill out this field.");
        errors = true;
      } else {
        this.$el.find("#" + element + "_message").html("");
      }
    }
    if (errors) {
      return Utils.midAlert("Please correct the errors on this page.");
    } else {
      return callback();
    }
  };

  RegisterTeacherView.prototype.saveUser = function() {
    var couchUserDoc, element, i, len, ref, teacher, teacherDoc;
    teacherDoc = {
      "name": this.name
    };
    ref = this.fields;
    for (i = 0, len = ref.length; i < len; i++) {
      element = ref[i];
      teacherDoc[element] = this[element].val();
    }
    couchUserDoc = {
      "name": this.name
    };
    teacher = new Teacher(teacherDoc);
    return teacher.save({
      "_id": Utils.humanGUID()
    }, {
      success: (function(_this) {
        return function() {
          return Tangerine.user.save({
            "teacherId": teacher.id
          }, {
            success: function() {
              Utils.midAlert("New teacher registered");
              return Tangerine.user.login(_this.name, _this.pass, {
                success: function() {
                  return Tangerine.router.landing();
                }
              });
            },
            error: function(error) {
              return Utils.midAlert("Registration error<br>" + error, 5000);
            }
          });
        };
      })(this)
    });
  };

  RegisterTeacherView.prototype.render = function() {
    var element, i, len, ref, x;
    this.$el.html("<h1>Register new teacher</h1> <table> <tr> <td class='small_grey'><b>Username</b></td> <td class='small_grey'>" + this.name + "</td> <td class='small_grey'><b>Password</b></td> <td class='small_grey'>" + (((function() {
      var i, len, ref, results;
      ref = this.pass;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        x = ref[i];
        results.push("*");
      }
      return results;
    }).call(this)).join('')) + "</td> </tr> </table> <div class='label_value'> <label for='first'>First name</label> <div id='first_message' class='messages'></div> <input id='first'> </div> <div class='label_value'> <label for='last'>Last Name</label> <div id='last_message' class='messages'></div> <input id='last'> </div> <div class='label_value'> <label for='gender'>Gender</label> <div id='gender_message' class='messages'></div> <input id='gender'> </div> <div class='label_value'> <label for='school'>School name</label> <div id='school_message' class='messages'></div> <input id='school'> </div> <div class='label_value'> <label for='contact'>Email address or mobile phone number</label> <div type='email' id='contact_message' class='messages'></div> <input id='contact'> </div> <button class='register command'>Register</button> <button class='cancel command'>Cancel</button>");
    ref = this.fields;
    for (i = 0, len = ref.length; i < len; i++) {
      element = ref[i];
      this[element] = this.$el.find("#" + element);
    }
    return this.trigger("rendered");
  };

  return RegisterTeacherView;

})(Backbone.View);