// Generated by CoffeeScript 1.4.0
var KlassSubtestEditView,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

KlassSubtestEditView = (function(_super) {

  __extends(KlassSubtestEditView, _super);

  function KlassSubtestEditView() {
    this.toggleAddQuestion = __bind(this.toggleAddQuestion, this);

    this.renderQuestions = __bind(this.renderQuestions, this);

    this.goBack = __bind(this.goBack, this);
    return KlassSubtestEditView.__super__.constructor.apply(this, arguments);
  }

  KlassSubtestEditView.prototype.className = "subtest_edit";

  KlassSubtestEditView.prototype.events = {
    'click .back_button': 'goBack',
    'click .save_subtest': 'save',
    'blur #subtest_items': 'cleanWhitespace',
    'click .add_question': 'toggleAddQuestion',
    'click .add_question_cancel': 'toggleAddQuestion',
    'click .add_question_add': 'addQuestion',
    'keypress #question_name': 'addQuestion'
  };

  KlassSubtestEditView.prototype.cleanWhitespace = function() {
    return this.$el.find("#subtest_items").val(this.$el.find("#subtest_items").val().replace(/\s+/g, ' '));
  };

  KlassSubtestEditView.prototype.initialize = function(options) {
    var _this = this;
    this.model = options.model;
    this.curriculum = options.curriculum;
    this.prototype = this.model.get("prototype");
    this.prototypeViews = Tangerine.config.get("prototypeViews");
    if (this.prototype === "survey") {
      this.questions = options.questions;
      this.surveyEditor = new window[this.prototypeViews[this.prototype]['edit']]({
        model: this.model,
        parent: this
      });
      this.questions.maintainOrder();
      this.questionsEditView = new QuestionsEditView({
        questions: this.questions
      });
      this.questionsEditView.on("question-edit", function(questionId) {
        return _this.save(null, {
          questionSave: false,
          success: function() {
            return Tangerine.router.navigate("class/question/" + questionId, true);
          }
        });
      });
      this.questions.on("change", function() {
        return _this.renderQuestions();
      });
      return this.renderQuestions();
    }
  };

  KlassSubtestEditView.prototype.goBack = function() {
    return Tangerine.router.navigate("curriculum/" + (this.model.get('curriculumId')), true);
  };

  KlassSubtestEditView.prototype.save = function(event, options) {
    var emptyOptions, i, notSaved, plural, question, requiresGrid, _has, _i, _len, _question, _ref, _ref1, _require,
      _this = this;
    if (options == null) {
      options = {};
    }
    if (this.prototype === "grid") {
      return this.model.save({
        name: this.$el.find("#name").val(),
        part: Math.max(parseInt(this.$el.find("#part").val()), 1),
        reportType: this.$el.find("#report_type").val().toLowerCase(),
        itemType: this.$el.find("#item_type").val().toLowerCase(),
        scoreTarget: parseInt(this.$el.find("#score_target").val()),
        scoreSpread: parseInt(this.$el.find("#score_spread").val()),
        order: parseInt(this.$el.find("#order").val()),
        endOfLine: this.$el.find("#end_of_line input:checked").val() === "true",
        randomize: this.$el.find("#randomize input:checked").val() === "true",
        timer: Math.max(parseInt(this.$el.find("#subtest_timer").val()), 0),
        items: _.compact(this.$el.find("#subtest_items").val().split(" ")),
        columns: Math.max(parseInt(this.$el.find("#subtest_columns").val()), 0)
      }, {
        success: function() {
          return Utils.midAlert("Subtest Saved");
        },
        error: function() {
          return Utils.midAlert("Save error");
        }
      });
    } else if (this.prototype === "survey") {
      options.questionSave = options.questionSave ? options.questionSave : true;
      notSaved = [];
      emptyOptions = [];
      requiresGrid = [];
      _ref = this.questions.models;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        question = _ref[i];
        if (question.get("type") !== "open" && ((_ref1 = question.get("options")) != null ? _ref1.length : void 0) === 0) {
          emptyOptions.push(i + 1);
          if (options.questionSave) {
            if (!question.save()) {
              notSaved.push(i);
            }
            if (question.has("linkedGridScore") && question.get("linkedGridScore") !== "" && question.get("linkedGridScore") !== 0 && this.model.has("gridLinkId") === "" && this.model.get("gridLinkId") === "") {
              requiresGrid.push(i);
            }
          }
        }
      }
      if (notSaved.length !== 0) {
        Utils.midAlert("Error<br><br>Questions: <br>" + (notSaved.join(', ')) + "<br>not saved");
      }
      if (emptyOptions.length !== 0) {
        plural = emptyOptions.length > 1;
        _question = plural ? "Questions" : "Question";
        _has = plural ? "have" : "has";
        alert("Warning\n\n" + _question + " " + (emptyOptions.join(' ,')) + " " + _has + " no options.");
      }
      if (requiresGrid.length !== 0) {
        plural = emptyOptions.length > 1;
        _question = plural ? "Questions" : "Question";
        _require = plural ? "require" : "requires";
        alert("Warning\n\n" + _question + " " + (requiresGrid.join(' ,')) + " " + _require + " a grid to be linked to this test.");
      }
      return this.model.save({
        name: this.$el.find("#name").val(),
        part: Math.max(parseInt(this.$el.find("#part").val()), 1),
        reportType: this.$el.find("#report_type").val().toLowerCase(),
        itemType: this.$el.find("#item_type").val().toLowerCase(),
        scoreTarget: parseInt(this.$el.find("#score_target").val()),
        scoreSpread: parseInt(this.$el.find("#score_spread").val()),
        order: Math.max(parseInt(this.$el.find("#order").val()), 0),
        gridLinkId: this.$el.find("#link_select option:selected").val(),
        autostopLimit: parseInt(this.$el.find("#autostop_limit").val()) || 0
      }, {
        success: function() {
          if (options.success) {
            return options.success();
          }
          Utils.midAlert("Subtest Saved");
          return setTimeout(_this.goBack, 1000);
        },
        error: function() {
          if (options.error != null) {
            return options.error();
          }
          return Utils.midAlert("Save error");
        }
      });
    }
  };

  KlassSubtestEditView.prototype.renderQuestions = function() {
    var _ref, _ref1;
    this.$el.find("#question_list_wrapper").empty();
    if ((_ref = this.questionsEditView) != null) {
      _ref.render();
    }
    return this.$el.find("#question_list_wrapper").append((_ref1 = this.questionsEditView) != null ? _ref1.el : void 0);
  };

  KlassSubtestEditView.prototype.toggleAddQuestion = function() {
    var _this = this;
    this.$el.find("#add_question_form, .add_question").fadeToggle(250, function() {
      if (_this.$el.find("#add_question_form").is(":visible")) {
        return _this.$el.find("#question_prompt").focus();
      }
    });
    return false;
  };

  KlassSubtestEditView.prototype.addQuestion = function(event) {
    var newAttributes, nq;
    if (event.type !== "click" && event.which !== 13) {
      return true;
    }
    newAttributes = $.extend(Tangerine.templates.get("questionTemplate"), {
      subtestId: this.model.id,
      curriculumId: this.curriculum.id,
      id: Utils.guid(),
      order: this.questions.length,
      prompt: this.$el.find('#question_prompt').val(),
      name: this.$el.find('#question_name').val().safetyDance()
    });
    nq = this.questions.create(newAttributes);
    this.$el.find("#add_question_form input").val('');
    this.$el.find("#question_prompt").focus();
    return false;
  };

  KlassSubtestEditView.prototype.render = function() {
    var autostopLimit, columns, curriculumName, endOfLine, gridLinkId, itemType, items, name, order, part, prototypeOptions, randomize, reportType, scoreSpread, scoreTarget, timer,
      _this = this;
    curriculumName = this.curriculum.escape("name");
    name = this.model.escape("name");
    part = this.model.getNumber("part");
    reportType = this.model.escape("reportType");
    itemType = this.model.escape("itemType");
    scoreTarget = this.model.getNumber("scoreTarget");
    scoreSpread = this.model.getNumber("scoreSpread");
    order = this.model.getNumber("order");
    if (this.prototype === "grid") {
      endOfLine = this.model.has("endOfLine") ? this.model.get("endOfLine") : true;
      randomize = this.model.has("randomize") ? this.model.get("randomize") : false;
      items = this.model.get("items").join(" ");
      timer = this.model.get("timer") || 0;
      columns = this.model.get("columns") || 0;
      prototypeOptions = "        <div class='label_value'>          <label for='subtest_items' title='These items are space delimited. Pasting text from other applications may insert tabs and new lines. Whitespace will be automatically corrected.'>Grid Items</label>          <textarea id='subtest_items'>" + items + "</textarea>        </div>        <label>Randomize items</label><br>        <div class='menu_box'>          <div id='randomize' class='buttonset'>            <label for='randomize_true'>Yes</label><input name='randomize' type='radio' value='true' id='randomize_true' " + (randomize ? 'checked' : void 0) + ">            <label for='randomize_false'>No</label><input name='randomize' type='radio' value='false' id='randomize_false' " + (!randomize ? 'checked' : void 0) + ">          </div>        </div><br>        <label>Mark entire line button</label><br>        <div class='menu_box'>          <div id='end_of_line' class='buttonset'>            <label for='end_of_line_true'>Yes</label><input name='end_of_line' type='radio' value='true' id='end_of_line_true' " + (endOfLine ? 'checked' : void 0) + ">            <label for='end_of_line_false'>No</label><input name='end_of_line' type='radio' value='false' id='end_of_line_false' " + (!endOfLine ? 'checked' : void 0) + ">          </div>        </div>        <div class='label_value'>          <label for='subtest_columns' title='Number of columns in which to display the grid items.'>Columns</label><br>          <input id='subtest_columns' value='" + columns + "' type='number'>        </div>        <div class='label_value'>          <label for='subtest_timer' title='Seconds to give the child to complete the test. Setting this value to 0 will make the test untimed.'>Timer</label><br>          <input id='subtest_timer' value='" + timer + "' type='number'>        </div>      ";
    } else if (this.prototype === "survey") {
      gridLinkId = this.model.get("gridLinkId") || "";
      autostopLimit = parseInt(this.model.get("autostopLimit")) || 0;
      this.on("rendered", function() {
        var subtests;
        _this.renderQuestions();
        subtests = new Subtests;
        return subtests.fetch({
          key: _this.curriculum.id,
          success: function(collection) {
            var linkSelect, subtest, _i, _len, _ref;
            collection = new Subtests(collection.where({
              prototype: 'grid'
            }));
            collection.sort();
            linkSelect = "              <div class='label_value'>                <label for='link_select'>Linked to grid</label><br>                <div class='menu_box'>                  <select id='link_select'>                  <option value=''>None</option>";
            _ref = collection.models;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              subtest = _ref[_i];
              linkSelect += "<option value='" + subtest.id + "' " + (gridLinkId === subtest.id ? 'selected' : '') + ">" + (subtest.get('part')) + " " + (subtest.get('name')) + "</option>";
            }
            linkSelect += "</select></div></div>";
            return _this.$el.find('#grid_link').html(linkSelect);
          }
        });
      });
      prototypeOptions = "        <div class='label_value'>          <label for='autostop_limit' title='The survey will discontinue after the first N questions have been answered with a &quot;0&quot; value option.'>Autostop after N incorrect</label><br>          <input id='autostop_limit' type='number' value='" + autostopLimit + "'>        </div>        <div id='grid_link'></div>        <div id='questions'>          <h2>Questions</h2>          <div class='menu_box'>            <div id='question_list_wrapper'><img class='loading' src='images/loading.gif'></div>            <button class='add_question command'>Add Question</button>            <div id='add_question_form' class='confirmation'>              <div class='menu_box'>                <h2>New Question</h2>                <label for='question_prompt'>Prompt</label>                <input id='question_prompt'>                <label for='question_name'>Variable name</label>                <input id='question_name' title='Allowed characters: A-Z, a-z, 0-9, and underscores.'><br>                <button class='add_question_add command'>Add</button><button class='add_question_cancel command'>Cancel</button>              </div>            </div>           </div>        </div>      ";
    }
    this.$el.html("      <button class='back_button navigation'>Back</button><br>      <h1>Subtest Editor</h1>      <table class='basic_info'>        <tr>          <th>Curriculum</th>          <td>" + curriculumName + "</td>        </tr>      </table>      <button class='save_subtest command'>Done</button>      <div class='label_value'>        <label for='name'>Name</label>        <input id='name' value='" + name + "'>      </div>      <div class='label_value'>        <label for='report_type'>Report Type</label>        <input id='report_type' value='" + reportType + "'>      </div>      <div class='label_value'>        <label for='item_type' title='This variable is used for reports. All results from subtests with the same Item Type will show up together. Inconsistent naming will invalidate results.  '>Item Type</label>        <input id='item_type' value='" + itemType + "'>      </div>      <div class='label_value'>        <label for='part'>Assessment Number</label><br>        <input type='number' id='part' value='" + part + "'>      </div>      <div class='label_value'>        <label for='score_target'>Target score</label><br>        <input type='number' id='score_target' value='" + scoreTarget + "'>      </div>      <div class='label_value'>        <label for='score_spread'>Score spread</label><br>        <input type='number' id='score_spread' value='" + scoreSpread + "'>      </div>      <div class='label_value'>        <label for='order'>Order</label><br>        <input type='number' id='order' value='" + order + "'>      </div>      " + prototypeOptions + "      <button class='save_subtest command'>Done</button>      ");
    return this.trigger("rendered");
  };

  return KlassSubtestEditView;

})(Backbone.View);
