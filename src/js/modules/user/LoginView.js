// Generated by CoffeeScript 1.10.0
var LoginView,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

LoginView = (function(superClass) {
  extend(LoginView, superClass);

  function LoginView() {
    this.onClose = bind(this.onClose, this);
    this.afterRender = bind(this.afterRender, this);
    this.render = bind(this.render, this);
    this.recenter = bind(this.recenter, this);
    return LoginView.__super__.constructor.apply(this, arguments);
  }

  LoginView.prototype.className = 'LoginView';

  LoginView.prototype.events = Modernizr.touch ? {
    'keypress input': 'keyHandler',
    'change input': 'onInputChange',
    'change select#name': 'onSelectChange',
    'click .mode': 'updateMode',
    'click button': 'action',
    'click .recent': 'showRecent',
    'blur .recent': 'blurRecent',
    'keyup #new_name': 'checkNewName'
  } : {
    'keypress input': 'keyHandler',
    'change input': 'onInputChange',
    'change select#name': 'onSelectChange',
    'click .mode': 'updateMode',
    'click button': 'action',
    'click .recent': 'showRecent',
    'blur .recent': 'blurRecent',
    'keyup #new_name': 'checkNewName'
  };

  LoginView.prototype.initialize = function(options) {
    $(window).on('orientationchange scroll resize', this.recenter);
    this.mode = "login";
    this.i18n();
    this.users = options.users;
    this.user = Tangerine.user;
    this.listenTo(this.user, "login", this.goOn);
    this.listenTo(this.user, "pass-error", this.passError);
    this.listenTo(this.user, "name-error", this.nameError);
    this.oldBackground = $("body").css("background");
    $("body").css("background", "white");
    return $("#footer").hide();
  };

  LoginView.prototype.checkNewName = function(event) {
    var $target, name;
    $target = $(event.target);
    name = $target.val().toLowerCase() || '';
    if (name.length > 4 && indexOf.call(this.users.pluck("name"), name) >= 0) {
      return this.nameError(this.text['error_name_taken']);
    } else {
      return this.clearErrors();
    }
  };

  LoginView.prototype.onInputChange = function(event) {
    var $target, type;
    $target = $(event.target);
    type = $target.attr("type");
    if (!(type === 'text' || (type == null))) {
      return;
    }
    return $target.val($target.val().toLowerCase());
  };

  LoginView.prototype.showRecent = function() {
    return this.$el.find("#name").autocomplete({
      source: this.user.recentUsers(),
      minLength: 0
    }).autocomplete("search", "");
  };

  LoginView.prototype.blurRecent = function() {
    this.$el.find("#name").autocomplete("close");
    return this.initAutocomplete();
  };

  LoginView.prototype.initAutocomplete = function() {
    return this.$el.find("#name").autocomplete({
      source: this.users.pluck("name")
    });
  };

  LoginView.prototype.recenter = function() {
    return this.$el.middleCenter();
  };

  LoginView.prototype.i18n = function() {
    return this.text = {
      "login": t('LoginView.button.login'),
      "sign_up": t('LoginView.button.sign_up'),
      "login_tab": t('LoginView.label.login'),
      "sign_up_tab": t('LoginView.label.sign_up'),
      "user": _(t('LoginView.label.user')).escape(),
      "teacher": _(t('LoginView.label.teacher')).escape(),
      "enumerator": _(t('LoginView.label.enumerator')).escape(),
      "password": t('LoginView.label.password'),
      "password_confirm": t('LoginView.label.password_confirm'),
      "error_name": t('LoginView.message.error_name_empty'),
      "error_pass": t('LoginView.message.error_password_empty'),
      "error_name_taken": t('LoginView.message.error_name_taken')
    };
  };

  LoginView.prototype.onSelectChange = function(event) {
    var $target;
    $target = $(event.target);
    if ($target.val() === "*new") {
      return this.updateMode("signup");
    } else {
      return this.$el.find("#pass").focus();
    }
  };

  LoginView.prototype.goOn = function() {
    return Tangerine.router.navigate("", true);
  };

  LoginView.prototype.updateMode = function(event) {
    var $login, $signup, $target;
    $target = $(event.target);
    this.mode = $target.attr('data-mode');
    $target.parent().find(".selected").removeClass("selected");
    $target.addClass("selected");
    $login = this.$el.find(".login");
    $signup = this.$el.find(".signup");
    switch (this.mode) {
      case "login":
        $login.show();
        $signup.hide();
        break;
      case "signup":
        $login.hide();
        $signup.show();
    }
    return this.$el.find("input")[0].focus();
  };

  LoginView.prototype.render = function() {
    var html, nameName;
    nameName = this.text.user;
    nameName = nameName.titleize();
    html = "<img src='images/login_logo.png' id='login_logo'> <div class='tab_container'> <div class='tab mode selected first' data-mode='login'>" + this.text.login_tab + "</div><div class='tab mode last' data-mode='signup'>" + this.text.sign_up_tab + "</div> </div> <div class='login'> <section> <div class='messages name_message'></div> <table><tr> <td><input id='name' class='tablet-name' placeholder='" + nameName + "'></td> <td><img src='images/icon_recent.png' class='recent clickable'></td> </tr></table> <div class='messages pass_message'></div> <input id='pass' type='password' placeholder='" + this.text.password + "'> <button class='login'>" + this.text.login + "</button> </section> </div> <div class='signup' style='display:none;'> <section> <div class='messages name_message'></div> <input id='new_name' class='tablet-name' type='text' placeholder='" + nameName + "'> <div class='messages pass_message'></div> <input id='new_pass_1' type='password' placeholder='" + this.text.password + "'> <input id='new_pass_2' type='password' placeholder='" + this.text.password_confirm + "'> <button class='sign_up'>" + this.text.sign_up + "</button> </section> </div>";
    this.$el.html(html);
    this.initAutocomplete();
    this.nameMsg = this.$el.find(".name_message");
    this.passMsg = this.$el.find(".pass_message");
    return this.trigger("rendered");
  };

  LoginView.prototype.afterRender = function() {
    return this.recenter();
  };

  LoginView.prototype.onClose = function() {
    $("#footer").show();
    $("body").css("background", this.oldBackground);
    return $(window).off('orientationchange scroll resize', this.recenter);
  };

  LoginView.prototype.keyHandler = function(event) {
    var char, isSpecial, key;
    key = {
      ENTER: 13,
      TAB: 9,
      BACKSPACE: 8
    };
    $('.messages').html('');
    char = event.which;
    if (char != null) {
      isSpecial = char === key.ENTER || event.keyCode === key.TAB || event.keyCode === key.BACKSPACE;
      if (!/[a-zA-Z0-9]/.test(String.fromCharCode(char)) && !isSpecial) {
        return false;
      }
      if (char === key.ENTER) {
        return this.action();
      }
    } else {
      return true;
    }
  };

  LoginView.prototype.action = function() {
    if (this.mode === "login") {
      this.login();
    }
    if (this.mode === "signup") {
      this.signup();
    }
    return false;
  };

  LoginView.prototype.signup = function() {
    var $name, $pass1, $pass2, name, pass1, pass2;
    name = ($name = this.$el.find("#new_name")).val().toLowerCase();
    pass1 = ($pass1 = this.$el.find("#new_pass_1")).val();
    pass2 = ($pass2 = this.$el.find("#new_pass_2")).val();
    if (pass1 !== pass2) {
      this.passError(this.text.pass_mismatch);
    }
    return this.user.signup(name, pass1);
  };

  LoginView.prototype.login = function() {
    var $name, $pass, name, pass;
    name = ($name = this.$el.find("#name")).val();
    pass = ($pass = this.$el.find("#pass")).val();
    this.clearErrors();
    if (name === "") {
      this.nameError(this.text.error_name);
    }
    if (pass === "") {
      this.passError(this.text.error_pass);
    }
    if (this.errors === 0) {
      this.user.login(name, pass);
    }
    return false;
  };

  LoginView.prototype.passError = function(error) {
    this.errors++;
    this.passMsg.html(error);
    return this.$el.find("#pass").focus();
  };

  LoginView.prototype.nameError = function(error) {
    this.errors++;
    this.nameMsg.html(error);
    return this.$el.find("#name").focus();
  };

  LoginView.prototype.clearErrors = function() {
    this.nameMsg.html("");
    this.passMsg.html("");
    return this.errors = 0;
  };

  return LoginView;

})(Backbone.View);
