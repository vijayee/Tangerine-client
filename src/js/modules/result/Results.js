// Generated by CoffeeScript 1.10.0
var ResultPreview, ResultPreviews, Results,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Results = (function(superClass) {
  extend(Results, superClass);

  function Results() {
    return Results.__super__.constructor.apply(this, arguments);
  }

  Results.prototype.url = 'result';

  Results.prototype.model = Result;

  Results.prototype.pouch = {
    viewOptions: {
      key: 'result'
    }
  };

  Results.prototype.comparator = function(model) {
    return model.get('start_time') || 0;
  };

  Results.prototype.fetch = function(options) {
    if (options == null) {
      options = {};
    }
    if (options.include_docs == null) {
      options.include_docs = true;
    }
    return Results.__super__.fetch.call(this, options);
  };

  return Results;

})(Backbone.Collection);

ResultPreview = (function(superClass) {
  extend(ResultPreview, superClass);

  function ResultPreview() {
    return ResultPreview.__super__.constructor.apply(this, arguments);
  }

  return ResultPreview;

})(Backbone.Model);

ResultPreviews = (function(superClass) {
  extend(ResultPreviews, superClass);

  function ResultPreviews() {
    return ResultPreviews.__super__.constructor.apply(this, arguments);
  }

  ResultPreviews.prototype.url = 'result';

  ResultPreviews.prototype.model = ResultPreview;

  ResultPreviews.prototype.pouch = {
    viewOptions: {
      include_docs: false,
      key: 'result'
    }
  };

  ResultPreviews.prototype.parse = function(response) {
    var models;
    console.log(response);
    models = _.pluck(response.rows, 'value');
    return models;
  };

  ResultPreviews.prototype.comparator = function(model) {
    return model.get('start_time') || 0;
  };

  ResultPreviews.prototype.fetch = function(options) {
    if (options == null) {
      options = {};
    }
    if (options.include_docs == null) {
      options.include_docs = true;
    }
    return ResultPreviews.__super__.fetch.call(this, options);
  };

  return ResultPreviews;

})(Backbone.Collection);