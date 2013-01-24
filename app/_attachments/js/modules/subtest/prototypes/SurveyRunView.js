// Generated by CoffeeScript 1.4.0
var ResultOfMultiple, ResultOfPrevious, ResultOfQuestion, SurveyRunView,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ResultOfQuestion = function(name) {
  return $("#question-" + name).attr("data-result");
};

ResultOfMultiple = function(name) {
  var input, result, _i, _len, _ref;
  result = [];
  _ref = $("#question-" + name + " input:checked");
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    input = _ref[_i];
    result.push($(input).val());
  }
  return result;
};

ResultOfPrevious = function(name) {
  return vm.currentView.result.getVariable(name);
};

SurveyRunView = (function(_super) {

  __extends(SurveyRunView, _super);

  function SurveyRunView() {
    this.onQuestionRendered = __bind(this.onQuestionRendered, this);

    this.getResult = __bind(this.getResult, this);

    this.updateSkipLogic = __bind(this.updateSkipLogic, this);

    this.onQuestionAnswer = __bind(this.onQuestionAnswer, this);
    return SurveyRunView.__super__.constructor.apply(this, arguments);
  }

  SurveyRunView.prototype.events = {
    'change input': 'updateSkipLogic',
    'change textarea': 'updateSkipLogic'
  };

  SurveyRunView.prototype.initialize = function(options) {
    var _this = this;
    this.model = this.options.model;
    this.parent = this.options.parent;
    this.isObservation = this.options.isObservation;
    this.questionViews = [];
    this.answered = [];
    this.renderCount = 0;
    this.questions = new Questions;
    return this.questions.fetch({
      key: this.model.get("assessmentId"),
      success: function(collection) {
        _this.questions = new Questions(_this.questions.where({
          subtestId: _this.model.id
        }));
        _this.questions.sort();
        return _this.render();
      }
    });
  };

  SurveyRunView.prototype.onQuestionAnswer = function(event) {
    var autostopCount, autostopLimit, cid, currentAnswer, i, longestSequence, next, view, _i, _j, _len, _ref, _ref1;
    if (this.isObservation) {
      cid = $(event.target).attr("data-cid");
      _ref = this.questionViews;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        view = _ref[_i];
        if (view.cid === cid && view.type !== "multiple") {
          next = $(view.el).next();
          while (next.length !== 0 && next.hasClass("disabled_skipped")) {
            next = $(next).next();
          }
          if (next.length !== 0) {
            next.scrollTo();
          }
        }
      }
    }
    this.autostopped = false;
    autostopLimit = parseInt(this.model.get("autostopLimit")) || 0;
    longestSequence = 0;
    autostopCount = 0;
    if (autostopLimit > 0) {
      for (i = _j = 1, _ref1 = this.questionViews.length; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 1 <= _ref1 ? ++_j : --_j) {
        currentAnswer = this.questionViews[i - 1].answer;
        if (currentAnswer === "0" || currentAnswer === "9") {
          autostopCount++;
        } else {
          autostopCount = 0;
        }
        longestSequence = Math.max(longestSequence, autostopCount);
        if (autostopLimit !== 0 && longestSequence >= autostopLimit && !this.autostopped) {
          this.autostopped = true;
          this.autostopIndex = i;
        }
      }
    }
    return this.updateAutostop();
  };

  SurveyRunView.prototype.updateAutostop = function() {
    var autostopLimit, i, view, _i, _len, _ref, _results;
    autostopLimit = parseInt(this.model.get("autostopLimit")) || 0;
    _ref = this.questionViews;
    _results = [];
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      view = _ref[i];
      if (i > (this.autostopIndex - 1)) {
        if (this.autostopped) {
          view.$el.addClass("disabled_autostop");
        }
        if (!this.autostopped) {
          _results.push(view.$el.removeClass("disabled_autostop"));
        } else {
          _results.push(void 0);
        }
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  SurveyRunView.prototype.updateSkipLogic = function() {
    this.questions.each(function(question) {
      var result, skipLogic;
      skipLogic = question.get("skipLogic");
      if (!_.isEmpty(skipLogic)) {
        result = CoffeeScript["eval"](skipLogic);
        if (result) {
          return $("#question-" + (question.get('name'))).addClass("disabled_skipped");
        } else {
          return $("#question-" + (question.get('name'))).removeClass("disabled_skipped");
        }
      }
    });
    return _.each(this.questionViews, function(questionView) {
      return questionView.updateValidity();
    });
  };

  SurveyRunView.prototype.isValid = function() {
    var i, qv, _i, _len, _ref;
    _ref = this.questionViews;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      qv = _ref[i];
      qv.updateValidity();
      if (qv.isValid != null) {
        if (!(qv.model.get("skippable") === "true" || qv.model.get("skippable") === true)) {
          if (!qv.isValid) {
            return false;
          }
        }
      }
    }
    return true;
  };

  SurveyRunView.prototype.getSkipped = function() {
    var i, qv, result, _i, _len, _ref;
    result = {};
    _ref = this.questionViews;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      qv = _ref[i];
      result[this.questions.models[i].get("name")] = "skipped";
    }
    return result;
  };

  SurveyRunView.prototype.getResult = function() {
    var i, qv, result, _i, _len, _ref;
    result = {};
    _ref = this.questionViews;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      qv = _ref[i];
      result[this.questions.models[i].get("name")] = qv.notAsked ? qv.notAskedResult : !_.isEmpty(qv.answer) ? qv.answer : qv.skipped ? qv.skippedResult : qv.$el.hasClass("disabled_skipped") ? qv.logicSkippedResult : qv.$el.hasClass("disabled_autostop") ? qv.notAskedAutostopResult : qv.answer;
    }
    return result;
  };

  SurveyRunView.prototype.getSum = function() {
    var counts, i, qv, _i, _len, _ref;
    counts = {
      correct: 0,
      incorrect: 0,
      missing: 0,
      total: 0
    };
    _ref = this.questionViews;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      qv = _ref[i];
      if (_.isString(qv)) {
        counts.missing++;
      } else {
        if (qv.isValid) {
          counts['correct'] += 1;
        }
        if (!qv.isValid) {
          counts['incorrect'] += 1;
        }
        if (!qv.isValid && (qv.model.get("skippable" === 'true' || qv.model.get("skippable" === true)))) {
          counts['missing'] += 1;
        }
        if (true) {
          counts['total'] += 1;
        }
      }
    }
    return {
      correct: counts['correct'],
      incorrect: counts['incorrect'],
      missing: counts['missing'],
      total: counts['total']
    };
  };

  SurveyRunView.prototype.showErrors = function() {
    var customMessage, first, i, message, qv, _i, _len, _ref, _results;
    this.$el.find('.message').remove();
    first = true;
    _ref = this.questionViews;
    _results = [];
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      qv = _ref[i];
      if (!_.isString(qv)) {
        message = "";
        if (!qv.isValid) {
          customMessage = qv.model.get("customValidationMessage");
          if (!_.isEmpty(customMessage)) {
            message = customMessage;
          } else {
            message = t("please answer this question");
          }
          if (first === true) {
            qv.$el.scrollTo();
            Utils.midAlert(t("please correct the errors on this page"));
            first = false;
          }
        }
        _results.push(qv.setMessage(message));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  SurveyRunView.prototype.render = function() {
    var i, isNotAsked, notAskedCount, oneView, question, required, _base, _i, _len, _ref;
    notAskedCount = 0;
    this.questions.sort();
    if (this.questions.models != null) {
      _ref = this.questions.models;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        question = _ref[i];
        required = parseInt(question.get("linkedGridScore")) || 0;
        isNotAsked = ((required !== 0 && this.parent.getGridScore() < required) || this.parent.gridWasAutostopped()) && this.parent.getGridScore() !== false;
        if (isNotAsked) {
          notAskedCount++;
        }
        oneView = new QuestionRunView({
          model: question,
          parent: this,
          notAsked: isNotAsked,
          isObservation: this.isObservation
        });
        oneView.on("rendered", this.onQuestionRendered);
        oneView.on("answer scroll", this.onQuestionAnswer);
        oneView.render();
        this.questionViews[i] = oneView;
        this.$el.append(oneView.el);
      }
    }
    this.updateSkipLogic();
    if (this.questions.length === notAskedCount) {
      if (typeof (_base = this.parent).next === "function") {
        _base.next();
      }
    }
    return this.trigger("rendered");
  };

  SurveyRunView.prototype.onQuestionRendered = function() {
    this.renderCount++;
    if (this.renderCount === (this.questions.length - 1)) {
      this.trigger("ready");
    }
    return this.trigger("subRendered");
  };

  SurveyRunView.prototype.onClose = function() {
    var qv, _i, _len, _ref;
    _ref = this.questionViews;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      qv = _ref[_i];
      if (typeof qv.close === "function") {
        qv.close();
      }
    }
    return this.questionViews = [];
  };

  return SurveyRunView;

})(Backbone.View);
