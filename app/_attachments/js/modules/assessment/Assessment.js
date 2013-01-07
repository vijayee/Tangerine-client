var Assessment,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Assessment = (function(_super) {

  __extends(Assessment, _super);

  function Assessment() {
    this.updateFromTrunk = __bind(this.updateFromTrunk, this);
    this.updateFromServer = __bind(this.updateFromServer, this);
    this.fetch = __bind(this.fetch, this);
    this.getResultCount = __bind(this.getResultCount, this);
    Assessment.__super__.constructor.apply(this, arguments);
  }

  Assessment.prototype.url = 'assessment';

  Assessment.prototype.initialize = function(options) {
    if (options == null) options = {};
    return this.subtests = new Subtests;
  };

  Assessment.prototype.getResultCount = function() {
    var _this = this;
    return $.ajax(Tangerine.settings.urlView("local", "resultCount")({
      type: "GET",
      dataType: "json",
      data: {
        group: true,
        group_level: 1,
        key: JSON.stringify(this.id)
      },
      success: function(data) {
        _this.resultCount = data.rows.length !== 0 ? data.rows[0].value : 0;
        return _this.trigger("resultCount");
      }
    }));
  };

  Assessment.prototype.fetch = function(options) {
    var oldSuccess,
      _this = this;
    oldSuccess = options.success;
    options.success = function(model) {
      var allSubtests;
      allSubtests = new Subtests;
      return allSubtests.fetch({
        key: _this.id,
        success: function(collection) {
          _this.subtests = collection;
          _this.subtests.maintainOrder();
          return typeof oldSuccess === "function" ? oldSuccess(_this) : void 0;
        }
      });
    };
    return Assessment.__super__.fetch.call(this, options);
  };

  Assessment.prototype.updateFromServer = function(dKey) {
    var dKeys,
      _this = this;
    if (dKey == null) dKey = this.id.substr(-5, 5);
    dKeys = JSON.stringify(dKey.replace(/[^a-f0-9]/g, " ").split(/\s+/));
    this.trigger("status", "import lookup");
    $.ajax(Tangerine.settings.urlView("group", "byDKey"), {
      type: "POST",
      dataType: "jsonp",
      data: {
        keys: dKeys
      },
      success: function(data) {
        var datum, docList, _i, _len, _ref;
        docList = [];
        _ref = data.rows;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          datum = _ref[_i];
          docList.push(datum.id);
        }
        return $.couch.replicate(Tangerine.settings.urlDB("group"), Tangerine.settings.urlDB("local"), {
          success: function() {
            return _this.trigger("status", "import success");
          },
          error: function(a, b) {
            console.log(arguments);
            return _this.trigger("status", "import error", "" + a + " " + b);
          }
        }, {
          doc_ids: docList
        });
      }
    });
    return false;
  };

  Assessment.prototype.updateFromTrunk = function(dKey) {
    var dKeys,
      _this = this;
    if (dKey == null) dKey = this.id.substr(-5, 5);
    dKeys = dKey.replace(/[^a-f0-9]/g, " ").split(/\s+/);
    this.trigger("status", "import lookup");
    $.ajax({
      url: Tangerine.settings.urlView("trunk", "byDKey"),
      dataType: "json",
      contentType: "application/json",
      type: "GET",
      data: {
        keys: JSON.stringify(dKeys)
      },
      success: function(data) {
        var datum, docList, _i, _len, _ref;
        docList = [];
        _ref = data.rows;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          datum = _ref[_i];
          docList.push(datum.id);
        }
        return $.couch.replicate(Tangerine.settings.trunkDB, Tangerine.settings.groupDB, {
          success: function() {
            return _this.trigger("status", "import success");
          },
          error: function(a, b) {
            console.log(arguments);
            return _this.trigger("status", "import error", "" + a + " " + b);
          }
        }, {
          doc_ids: docList
        });
      }
    });
    return false;
  };

  Assessment.prototype.duplicate = function(assessmentAttributes, subtestAttributes, questionAttributes, callback) {
    var newId, newModel, originalId;
    originalId = this.id;
    newModel = this.clone();
    newModel.set(assessmentAttributes);
    newId = Utils.guid();
    return newModel.save({
      "_id": newId,
      "assessmentId": newId
    }, {
      success: function() {
        var questions,
          _this = this;
        questions = new Questions;
        return questions.fetch({
          key: this.id,
          success: function(questions) {
            var subtests;
            subtests = new Subtests;
            return subtests.fetch({
              key: originalId,
              success: function(subtests) {
                var filteredSubtests, gridId, i, model, newQuestion, newQuestions, newSubtest, newSubtestId, newSubtests, oldId, question, subtestIdMap, _i, _len, _len2, _len3, _ref;
                filteredSubtests = subtests.models;
                subtestIdMap = {};
                newSubtests = [];
                for (i = 0, _len = filteredSubtests.length; i < _len; i++) {
                  model = filteredSubtests[i];
                  newSubtest = model.clone();
                  newSubtest.set("assessmentId", newModel.id);
                  newSubtestId = Utils.guid();
                  subtestIdMap[newSubtest.id] = newSubtestId;
                  newSubtest.set("_id", newSubtestId);
                  newSubtests.push(newSubtest);
                }
                for (i = 0, _len2 = newSubtests.length; i < _len2; i++) {
                  model = newSubtests[i];
                  gridId = model.get("gridLinkId");
                  if ((gridId || "") !== "") {
                    model.set("gridLinkId", subtestIdMap[gridId]);
                  }
                  model.save();
                }
                newQuestions = [];
                _ref = questions.models;
                for (_i = 0, _len3 = _ref.length; _i < _len3; _i++) {
                  question = _ref[_i];
                  newQuestion = question.clone();
                  oldId = newQuestion.get("subtestId");
                  newQuestion.set("assessmentId", newModel.id);
                  newQuestion.set("_id", Utils.guid());
                  newQuestion.set("subtestId", subtestIdMap[oldId]);
                  newQuestions.push(newQuestion);
                  newQuestion.save();
                }
                return callback(newModel);
              }
            });
          }
        });
      }
    });
  };

  Assessment.prototype.destroy = function() {
    var assessmentId, questions, subtests;
    assessmentId = this.id;
    subtests = new Subtests;
    subtests.fetch({
      key: assessmentId,
      success: function(collection) {
        var _results;
        _results = [];
        while (collection.length !== 0) {
          _results.push(collection.pop().destroy());
        }
        return _results;
      }
    });
    questions = new Questions;
    questions.fetch({
      key: this.id,
      success: function(collection) {
        var _results;
        _results = [];
        while (collection.length !== 0) {
          _results.push(collection.pop().destroy());
        }
        return _results;
      }
    });
    return Assessment.__super__.destroy.call(this);
  };

  Assessment.prototype.isActive = function() {
    return !this.isArchived();
  };

  Assessment.prototype.isArchived = function() {
    var archived;
    archived = this.get("archived");
    return archived === "true" || archived === true;
  };

  return Assessment;

})(Backbone.Model);
