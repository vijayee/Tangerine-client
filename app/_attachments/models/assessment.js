var Assessment;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
$.assessment = null;
Assessment = (function() {
  __extends(Assessment, Backbone.Model);
  function Assessment() {
    Assessment.__super__.constructor.apply(this, arguments);
  }
  Assessment.prototype.url = '/assessment';
  Assessment.prototype.changeName = function(newName) {
    var page, _i, _len, _ref, _results;
    this.name = newName;
    this.urlPath = "Assessment." + this.name;
    this.targetDatabase = "/" + this.name.toLowerCase().dasherize() + "/";
    this.urlPathsForPages = [];
    if (this.pages != null) {
      _ref = this.pages;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        page = _ref[_i];
        page.urlPath = this.urlPath + "." + page.pageId;
        _results.push(this.urlPathsForPages.push(page.urlPath));
      }
      return _results;
    }
  };
  Assessment.prototype.setPages = function(pages) {
    var index, page, _len, _ref, _results;
    this.pages = pages;
    this.urlPathsForPages = [];
    _ref = this.pages;
    _results = [];
    for (index = 0, _len = _ref.length; index < _len; index++) {
      page = _ref[index];
      page.assessment = this;
      page.pageNumber = index;
      if (index !== 0) {
        page.previousPage = this.pages[index - 1].pageId;
      }
      if (this.pages.length !== index + 1) {
        page.nextPage = this.pages[index + 1].pageId;
      }
      page.urlScheme = this.urlScheme;
      page.urlPath = this.urlPath + "." + page.pageId;
      _results.push(this.urlPathsForPages.push(page.urlPath));
    }
    return _results;
  };
  Assessment.prototype.getPage = function(pageId) {
    var page, _i, _len, _ref;
    _ref = this.pages;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      page = _ref[_i];
      if (page.pageId === pageId) {
        return page;
      }
    }
  };
  Assessment.prototype.insertPage = function(page, pageNumber) {
    this.pages.splice(pageNumber, 0, page);
    return this.setPages(this.pages);
  };
  Assessment.prototype.url = function() {
    return "" + this.urlScheme + "://" + this.urlPath;
  };
  Assessment.prototype.loginPage = function() {
    return $.assessment.pages[0];
  };
  Assessment.prototype.currentUser = function() {
    return this.loginPage().results().username;
  };
  Assessment.prototype.currentPassword = function() {
    return this.loginPage().results().password;
  };
  Assessment.prototype.hasUserAuthenticated = function() {
    var loginResults;
    loginResults = this.loginPage().results();
    return loginResults.username !== "" && loginResults.password !== "";
  };
  Assessment.prototype.results = function() {
    var page, results, _i, _len, _ref;
    results = {};
    _ref = this.pages;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      page = _ref[_i];
      results[page.pageId] = page.results();
    }
    results.timestamp = new Date().valueOf();
    return results;
  };
  Assessment.prototype.saveResults = function(callback, stopOnError) {
    var results, url;
    if (stopOnError == null) {
      stopOnError = false;
    }
    results = this.results();
    url = this.targetDatabase;
    return $.ajax({
      url: url,
      async: true,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(results),
      complete: function() {
        if (callback != null) {
          return callback(results);
        }
      },
      error: __bind(function() {
        var databaseName;
        if (stopOnError) {
          throw "Could not PUT to " + url;
          return alert("Results NOT saved - do you have permission to save?");
        } else {
          databaseName = this.targetDatabase.replace(/\//g, "");
          console.log("creating " + databaseName);
          return $.couch.db(databaseName).create({
            success: __bind(function() {
              $.couch.db(databaseName).saveDoc({
                "_id": "_design/aggregate",
                "language": "javascript",
                "views": {
                  "fields": {
                    "map": '(function(doc, req) {\n  var concatNodes, fields;\n  fields = [];\n  concatNodes = function(parent, o) {\n    var index, key, value, _len, _results, _results2;\n    if (o instanceof Array) {\n      _results = [];\n      for (index = 0, _len = o.length; index < _len; index++) {\n        value = o[index];\n        _results.push(typeof o !== "string" ? concatNodes(parent + "." + index, value) : void 0);\n      }\n      return _results;\n    } else {\n      if (typeof o === "string") {\n        return fields.push("" + parent + ",\\"" + o + "\\"\\n");\n      } else {\n        _results2 = [];\n        for (key in o) {\n          value = o[key];\n          _results2.push(concatNodes(parent + "." + key, value));\n        }\n        return _results2;\n      }\n    }\n  };\n  concatNodes("", doc);\n  return emit(null, fields);\n});'
                  }
                }
              });
              return this.saveResults(callback, true);
            }, this),
            error: __bind(function() {
              throw "Could not create database " + databaseName;
            }, this)
          });
        }
      }, this)
    });
  };
  Assessment.prototype.resetURL = function() {
    return document.location.pathname + document.location.search;
  };
  Assessment.prototype.reset = function() {
    return document.location = this.resetURL();
  };
  Assessment.prototype.validate = function() {
    var page, pageResult, validationErrors, _i, _len, _ref;
    validationErrors = "";
    if (this.pages != null) {
      _ref = this.pages;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        page = _ref[_i];
        pageResult = page.validate();
        if (pageResult !== true) {
          validationErrors += "'" + (page.name()) + "' page invalid: " + pageResult + " <br/>";
        }
      }
    }
    if (validationErrors !== "") {
      return validationErrors;
    }
  };
  Assessment.prototype.toJSON = function() {
    return JSON.stringify({
      name: this.name,
      urlPathsForPages: this.urlPathsForPages
    });
  };
  Assessment.prototype.save = function() {
    switch (this.urlScheme) {
      case "localstorage":
        return this.saveToLocalStorage();
      default:
        throw "URL type not yet implemented: " + this.urlScheme;
    }
  };
  Assessment.prototype.saveToLocalStorage = function() {
    var page, _i, _len, _ref, _results;
    this.urlScheme = "localstorage";
    localStorage[this.urlPath] = this.toJSON();
    _ref = this.pages;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      page = _ref[_i];
      _results.push(page.saveToLocalStorage());
    }
    return _results;
  };
  Assessment.prototype.saveToCouchDB = function(callback) {
    this.urlScheme = "http";
    if (this.urlPath[0] !== "/") {
      this.urlPath = this.targetDatabase + this.urlPath;
    }
    $.ajax({
      url: this.urlPath,
      async: true,
      type: 'PUT',
      dataType: 'json',
      data: this.toJSON(),
      success: __bind(function(result) {
        var page, _i, _len, _ref;
        this.revision = result.rev;
        _ref = this.pages;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          page = _ref[_i];
          page.saveToCouchDB();
        }
        return this.onReady(function() {
          return callback();
        });
      }, this),
      error: function() {
        throw "Could not PUT to " + this.urlPath;
      }
    });
    return this;
  };
  Assessment.prototype["delete"] = function() {
    if (this.urlScheme === "localstorage") {
      return this.deleteFromLocalStorage();
    }
  };
  Assessment.prototype.deleteFromLocalStorage = function() {
    var page, _i, _len, _ref;
    _ref = this.pages;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      page = _ref[_i];
      page.deleteFromLocalStorage();
    }
    return localStorage.removeItem(this.urlPath);
  };
  Assessment.prototype.deleteFromCouchDB = function() {
    var page, url, _i, _len, _ref;
    url = this.targetDatabase + this.urlPath + ("?rev=" + this.revision);
    if (this.pages) {
      _ref = this.pages;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        page = _ref[_i];
        page.deleteFromCouchDB();
      }
    }
    return $.ajax({
      url: url,
      async: true,
      type: 'DELETE',
      error: function() {
        throw "Error deleting " + url;
      }
    });
  };
  Assessment.prototype.onReady = function(callback) {
    var checkIfLoading, maxTries, timesTried;
    maxTries = 10;
    timesTried = 0;
    checkIfLoading = __bind(function() {
      var page, _i, _len, _ref;
      timesTried++;
      if (this.loading) {
        if (timesTried >= maxTries) {
          throw "Timeout error while waiting for assessment: " + this.name;
        }
        setTimeout(checkIfLoading, 1000);
        return;
      }
      _ref = this.pages;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        page = _ref[_i];
        if (page.loading) {
          if (timesTried >= maxTries) {
            throw "Timeout error while waiting for page: " + page.pageId;
          }
          setTimeout(checkIfLoading, 1000);
          return;
        }
      }
      return callback();
    }, this);
    return checkIfLoading();
  };
  Assessment.prototype.render = function(callback) {
    return this.onReady(__bind(function() {
      var i, page, result;
      $.assessment = this;
      $('div').live('pagebeforeshow', __bind(function(event, ui) {
        var page, _i, _len, _ref;
        _ref = this.pages;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          page = _ref[_i];
          if (page.pageId === $(event.currentTarget).attr('id')) {
            this.currentPage = page;
            return;
          }
        }
      }, this));
      result = (function() {
        var _len, _ref, _results;
        _ref = this.pages;
        _results = [];
        for (i = 0, _len = _ref.length; i < _len; i++) {
          page = _ref[i];
          _results.push(page.render());
        }
        return _results;
      }).call(this);
      result = result.join("");
      if (callback != null) {
        callback(result);
      }
      return result;
    }, this));
  };
  Assessment.prototype.flash = function() {
    $('.controls').addClass("flash");
    $("div[data-role=header]").toggleClass("flash");
    $("div[data-role=footer]").toggleClass("flash");
    return setTimeout(function() {
      $('.controls').removeClass("flash");
      $("div[data-role=header]").removeClass("flash");
      return $("div[data-role=footer]").removeClass("flash");
    }, 3000);
  };
  Assessment.prototype.toPaper = function(callback) {
    return this.onReady(__bind(function() {
      var i, page, result;
      result = (function() {
        var _len, _ref, _results;
        _ref = this.pages;
        _results = [];
        for (i = 0, _len = _ref.length; i < _len; i++) {
          page = _ref[i];
          _results.push(("<div class='subtest " + page.pageType + "'><h1>" + (page.name()) + "</h1>") + page.toPaper() + "</div>");
        }
        return _results;
      }).call(this);
      result = result.join("<div class='page-break'><hr/></div>");
      if (callback != null) {
        callback(result);
      }
      return result;
    }, this));
  };
  Assessment.prototype.handleURLParameters = function() {
    var a, d, e, param, q, r, value, _ref;
    if (this.urlParams != null) {
      return;
    }
    this.urlParams = {};
    a = /\+/g;
    r = /([^&=]+)=?([^&]*)/g;
    d = function(s) {
      return decodeURIComponent(s.replace(a, " "));
    };
    q = window.location.search.substring(1);
    while ((e = r.exec(q))) {
      this.urlParams[d(e[1])] = d(e[2]);
    }
    _ref = this.urlParams;
    for (param in _ref) {
      value = _ref[param];
      $("input#" + param).val(value);
    }
    if (this.urlParams.newAssessment) {
      if (!($.assessment.currentPage.pageId === "DateTime" || $.assessment.currentPage.pageId === "Login")) {
        if (!($.assessment.currentPage.pageId === "DateTime" || $.assessment.currentPage.pageId === "Login")) {
          $.mobile.changePage("DateTime");
        }
        return document.location = document.location.href;
      }
    }
  };
  Assessment.prototype.nextPage = function() {
    var validationMessageElement, validationResult;
    validationResult = this.currentPage.validate();
    if (validationResult !== true) {
      validationMessageElement = $("#" + this.currentPage.pageId + " div.validation-message");
      validationMessageElement.html("").show().html(validationResult).fadeOut(5000);
      return;
    }
    $("#" + this.currentPage.pageId).hide();
    this.currentPage = _.find(this.pages, __bind(function(page) {
      return page.pageId === this.currentPage.nextPage;
    }, this));
    $("#" + this.currentPage.pageId).show();
    window.scrollTo(0, 0);
    return $("#" + this.currentPage.pageId).trigger("pageshow");
  };
  Assessment.prototype.backPage = function() {
    $("#" + this.currentPage.pageId).hide();
    this.currentPage = _.find(this.pages, __bind(function(page) {
      return page.pageId === this.currentPage.previousPage;
    }, this));
    $("#" + this.currentPage.pageId).show();
    window.scrollTo(0, 0);
    return $("#" + this.currentPage.pageId).trigger("pageshow");
  };
  return Assessment;
})();
Assessment.load = function(id, callback) {
  var assessment;
  assessment = new Assessment({
    _id: id
  });
  return assessment.fetch({
    success: function() {
      var pages, url, urlPath, _i, _len, _ref;
      assessment.changeName(assessment.get("name"));
      pages = [];
      _ref = assessment.get("urlPathsForPages");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        urlPath = _ref[_i];
        url = "/" + Tangerine.config.db_name + "/" + urlPath;
        JQueryMobilePage.loadFromHTTP({
          url: url,
          async: false
        }, __bind(function(page) {
          page.assessment = assessment;
          return pages.push(page);
        }, this));
      }
      assessment.setPages(pages);
      if (callback != null) {
        return callback(assessment);
      }
    },
    error: function() {
      throw "Failed to load: " + url;
    }
  });
};