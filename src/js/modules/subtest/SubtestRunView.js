// Generated by CoffeeScript 1.10.0
var SubtestRunView,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

SubtestRunView = (function(superClass) {
  extend(SubtestRunView, superClass);

  function SubtestRunView() {
    this.hideNext = bind(this.hideNext, this);
    this.showNext = bind(this.showNext, this);
    this.afterRender = bind(this.afterRender, this);
    this.flagRender = bind(this.flagRender, this);
    return SubtestRunView.__super__.constructor.apply(this, arguments);
  }

  SubtestRunView.prototype.className = "SubtestRunView";

  SubtestRunView.prototype.events = {
    'click .subtest-next': 'next',
    'click .subtest-back': 'back',
    'click .subtest_help': 'toggleHelp',
    'click .skip': 'skip'
  };

  SubtestRunView.prototype.toggleHelp = function() {
    return this.$el.find(".enumerator_help").fadeToggle(250);
  };

  SubtestRunView.prototype.i18n = function() {
    return this.text = {
      "next": t("SubtestRunView.button.next"),
      "back": t("SubtestRunView.button.back"),
      "skip": t("SubtestRunView.button.skip"),
      "help": t("SubtestRunView.button.help")
    };
  };

  SubtestRunView.prototype.initialize = function(options) {
    this.i18n();
    this.model = options.model;
    this.parent = options.parent;
    if (this.model.get("fontFamily") !== "") {
      this.fontStyle = "style=\"font-family: " + (this.model.get('fontFamily')) + " !important;\"";
    }
    return this.prototypeRendered = false;
  };

  SubtestRunView.prototype.render = function() {
    var _render, languageCode;
    _render = (function(_this) {
      return function() {
        var backButton, backable, enumeratorHelp, skipButton, skippable, studentDialog, transitionComment;
        _this.delegateEvents();
        enumeratorHelp = (_this.model.get("enumeratorHelp") || "") !== "" ? "<button class='subtest_help command'>" + _this.text.help + "</button><div class='enumerator_help' " + (_this.fontStyle || "") + ">" + (_this.model.get('enumeratorHelp')) + "</div>" : "";
        studentDialog = (_this.model.get("studentDialog") || "") !== "" ? "<div class='student_dialog' " + (_this.fontStyle || "") + ">" + (_this.model.get('studentDialog')) + "</div>" : "";
        transitionComment = (_this.model.get("transitionComment") || "") !== "" ? "<div class='student_dialog' " + (_this.fontStyle || "") + ">" + (_this.model.get('transitionComment')) + "</div> <br>" : "";
        skippable = _this.model.get("skippable") === true || _this.model.get("skippable") === "true";
        backable = (_this.model.get("backButton") === true || _this.model.get("backButton") === "true") && _this.parent.index !== 0;
        if (skippable) {
          skipButton = "<button class='skip navigation'>" + _this.text.skip + "</button>";
        }
        if (backable) {
          backButton = "<button class='subtest-back navigation'>" + _this.text.back + "</button>";
        }
        _this.$el.html("<h2>" + (_this.model.get('name')) + "</h2> " + enumeratorHelp + " " + studentDialog + " <div id='prototype_wrapper'></div> <div class='controlls clearfix'> " + transitionComment + " " + (backButton || '') + " <button class='subtest-next navigation'>" + _this.text.next + "</button> " + (skipButton || '') + " </div>");
        console.log(_this.model);
        _this.prototypeView = new window[(_this.model.get('prototype').titleize()) + "RunView"]({
          model: _this.model,
          parent: _this
        });
        _this.prototypeView.on("rendered", function() {
          return _this.flagRender("prototype");
        });
        _this.prototypeView.on("subRendered", function() {
          return _this.trigger("subRendered");
        });
        _this.prototypeView.on("showNext", function() {
          return _this.showNext();
        });
        _this.prototypeView.on("hideNext", function() {
          return _this.hideNext();
        });
        _this.prototypeView.on("ready", function() {
          return _this.prototypeRendered = true;
        });
        _this.prototypeView.setElement(_this.$el.find('#prototype_wrapper'));
        _this.prototypeView.render();
        return _this.flagRender("subtest");
      };
    })(this);
    languageCode = this.model.get("language");
    if (languageCode) {
      return i18n.setLng(languageCode, (function(_this) {
        return function(t) {
          window.t = t;
          return _render();
        };
      })(this));
    } else {
      return i18n.setLng(Tangerine.settings.get("language"), (function(_this) {
        return function(t) {
          return _render();
        };
      })(this));
    }
  };

  SubtestRunView.prototype.flagRender = function(flag) {
    if (!this.renderFlags) {
      this.renderFlags = {};
    }
    this.renderFlags[flag] = true;
    if (this.renderFlags['subtest'] && this.renderFlags['prototype']) {
      return this.trigger("rendered");
    }
  };

  SubtestRunView.prototype.afterRender = function() {
    var ref;
    if ((ref = this.prototypeView) != null) {
      if (typeof ref.afterRender === "function") {
        ref.afterRender();
      }
    }
    return this.onShow();
  };

  SubtestRunView.prototype.showNext = function() {
    return this.$el.find(".controlls").show();
  };

  SubtestRunView.prototype.hideNext = function() {
    return this.$el.find(".controlls").hide();
  };

  SubtestRunView.prototype.onShow = function() {
    var displayCode, error, error1, message, name, ref;
    displayCode = this.model.getString("displayCode");
    if (!_.isEmptyString(displayCode)) {
      try {
        CoffeeScript["eval"].apply(this, [displayCode]);
      } catch (error1) {
        error = error1;
        name = (/function (.{1,})\(/.exec(error.constructor.toString())[1]);
        message = error.message;
        alert(name + "\n\n" + message);
        console.log("displayCode Error: " + JSON.stringify(error));
      }
    }
    return (ref = this.prototypeView) != null ? typeof ref.updateExecuteReady === "function" ? ref.updateExecuteReady(true) : void 0 : void 0;
  };

  SubtestRunView.prototype.getGridScore = function() {
    var grid, gridScore, link;
    link = this.model.get("gridLinkId") || "";
    if (link === "") {
      return;
    }
    grid = this.parent.model.subtests.get(this.model.get("gridLinkId"));
    gridScore = this.parent.result.getGridScore(grid.id);
    return gridScore;
  };

  SubtestRunView.prototype.gridWasAutostopped = function() {
    var grid, gridWasAutostopped, link;
    link = this.model.get("gridLinkId") || "";
    if (link === "") {
      return;
    }
    grid = this.parent.model.subtests.get(this.model.get("gridLinkId"));
    return gridWasAutostopped = this.parent.result.gridWasAutostopped(grid.id);
  };

  SubtestRunView.prototype.onClose = function() {
    var ref;
    return (ref = this.prototypeView) != null ? typeof ref.close === "function" ? ref.close() : void 0 : void 0;
  };

  SubtestRunView.prototype.isValid = function() {
    if (!this.prototypeRendered) {
      return false;
    }
    if (this.prototypeView.isValid != null) {
      return this.prototypeView.isValid();
    } else {
      return false;
    }
    return true;
  };

  SubtestRunView.prototype.showErrors = function() {
    return this.prototypeView.showErrors();
  };

  SubtestRunView.prototype.getSum = function() {
    if (this.prototypeView.getSum != null) {
      return this.prototypeView.getSum();
    } else {
      return {
        correct: 0,
        incorrect: 0,
        missing: 0,
        total: 0
      };
    }
  };

  SubtestRunView.prototype.abort = function() {
    return this.parent.abort();
  };

  SubtestRunView.prototype.getResult = function() {
    var hash, result;
    result = this.prototypeView.getResult();
    if (this.model.has("hash")) {
      hash = this.model.get("hash");
    }
    return {
      'body': result,
      'meta': {
        'hash': hash
      }
    };
  };

  SubtestRunView.prototype.getSkipped = function() {
    if (this.prototypeView.getSkipped != null) {
      return this.prototypeView.getSkipped();
    } else {
      throw "Prototype skipping not implemented";
    }
  };

  SubtestRunView.prototype.next = function() {
    return this.trigger("next");
  };

  SubtestRunView.prototype.back = function() {
    return this.trigger("back");
  };

  SubtestRunView.prototype.skip = function() {
    return this.parent.skip();
  };

  return SubtestRunView;

})(Backbone.View);