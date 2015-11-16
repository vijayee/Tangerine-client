// Generated by CoffeeScript 1.10.0
var QuestionsEditView,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

QuestionsEditView = (function(superClass) {
  extend(QuestionsEditView, superClass);

  function QuestionsEditView() {
    this.render = bind(this.render, this);
    return QuestionsEditView.__super__.constructor.apply(this, arguments);
  }

  QuestionsEditView.prototype.className = "questions_edit_view";

  QuestionsEditView.prototype.tagName = "ul";

  QuestionsEditView.prototype.initialize = function(options) {
    this.views = [];
    return this.questions = options.questions;
  };

  QuestionsEditView.prototype.onClose = function() {
    return this.closeViews();
  };

  QuestionsEditView.prototype.closeViews = function() {
    var j, len, ref, results, view;
    ref = this.views;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      view = ref[j];
      results.push(view.close());
    }
    return results;
  };

  QuestionsEditView.prototype.render = function() {
    var i, j, len, question, ref, view;
    this.closeViews();
    ref = this.questions.models;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      question = ref[i];
      view = new QuestionsEditListElementView({
        "question": question
      });
      this.views.push(view);
      view.on("deleted", this.render);
      view.on("duplicate", (function(_this) {
        return function() {
          return _this.refetchAndRender();
        };
      })(this));
      view.on("question-edit", (function(_this) {
        return function(questionId) {
          return _this.trigger("question-edit", questionId);
        };
      })(this));
      view.render();
      this.$el.append(view.el);
    }
    return this.$el.sortable({
      forceHelperSize: true,
      forcePlaceholderSize: true,
      handle: '.sortable_handle',
      start: function(event, ui) {
        return ui.item.addClass("drag_shadow");
      },
      stop: function(event, ui) {
        return ui.item.removeClass("drag_shadow");
      },
      update: (function(_this) {
        return function(event, ui) {
          var id, idList, index, k, len1, li, newDoc, newDocs, requestData;
          idList = (function() {
            var k, len1, ref1, results;
            ref1 = this.$el.find("li.question_list_element");
            results = [];
            for (k = 0, len1 = ref1.length; k < len1; k++) {
              li = ref1[k];
              results.push($(li).attr("data-id"));
            }
            return results;
          }).call(_this);
          index = 0;
          newDocs = [];
          for (index = k = 0, len1 = idList.length; k < len1; index = ++k) {
            id = idList[index];
            newDoc = _this.questions.get(id).attributes;
            newDoc['order'] = index;
            newDocs.push(newDoc);
          }
          requestData = {
            "docs": newDocs
          };
          return $.ajax({
            type: "POST",
            contentType: "application/json; charset=UTF-8",
            dataType: "json",
            url: Tangerine.settings.urlBulkDocs(),
            data: JSON.stringify(requestData),
            success: function(responses) {
              return _this.refetchAndRender();
            },
            error: function() {
              return Utils.midAlert("Duplication error");
            }
          });
        };
      })(this)
    });
  };

  QuestionsEditView.prototype.refetchAndRender = function() {
    var anyQuestion;
    anyQuestion = this.questions.models[0];
    return this.questions.fetch({
      viewOptions: {
        key: "question-" + (anyQuestion.get("assessmentId"))
      },
      success: (function(_this) {
        return function() {
          _this.questions = new Questions(_this.questions.where({
            subtestId: anyQuestion.get("subtestId")
          }));
          return _this.render(true);
        };
      })(this)
    });
  };

  return QuestionsEditView;

})(Backbone.View);
