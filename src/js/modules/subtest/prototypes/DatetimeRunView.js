// Generated by CoffeeScript 1.10.0
var DatetimeRunView,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

DatetimeRunView = (function(superClass) {
  extend(DatetimeRunView, superClass);

  function DatetimeRunView() {
    return DatetimeRunView.__super__.constructor.apply(this, arguments);
  }

  DatetimeRunView.prototype.className = "datetime";

  DatetimeRunView.prototype.i18n = function() {
    return this.text = {
      year: t("DatetimeRunView.label.year"),
      month: t("DatetimeRunView.label.month"),
      day: t("DatetimeRunView.label.day"),
      time: t("DatetimeRunView.label.time")
    };
  };

  DatetimeRunView.prototype.initialize = function(options) {
    this.i18n();
    this.model = options.model;
    this.parent = options.parent;
    return this.dataEntry = options.dataEntry;
  };

  DatetimeRunView.prototype.render = function() {
    var dateTime, day, m, minutes, month, months, previous, time, year;
    dateTime = new Date();
    year = dateTime.getFullYear();
    months = [t("jan"), t("feb"), t("mar"), t("apr"), t("may"), t("jun"), t("jul"), t("aug"), t("sep"), t("oct"), t("nov"), t("dec")];
    month = months[dateTime.getMonth()];
    day = dateTime.getDate();
    minutes = dateTime.getMinutes();
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    time = dateTime.getHours() + ":" + minutes;
    if (!this.dataEntry) {
      previous = this.parent.parent.result.getByHash(this.model.get('hash'));
      if (previous) {
        year = previous.year;
        month = previous.month;
        day = previous.day;
        time = previous.time;
      }
    }
    this.$el.html("<div class='question'> <table> <tr> <td><label for='year'>" + this.text.year + "</label><input id='year' value='" + year + "'></td> <td> <label for='month'>" + this.text.month + "</label><br> <select id='month' value='" + month + "'>" + (((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = months.length; i < len; i++) {
        m = months[i];
        results.push("<option value='" + m + "' " + ((m === month ? "selected='selected'" : void 0) || '') + ">" + (m.titleize()) + " </option>");
      }
      return results;
    })()).join('')) + "</select> </td> <td><label for='day'>" + this.text.day + "</label><input id='day' type='day' value='" + day + "'></td> </tr> <tr> <td><label for='time'>" + this.text.time + "</label><br><input type='text' id='time' value='" + time + "'></td> </tr> </table> </div>");
    this.trigger("rendered");
    return this.trigger("ready");
  };

  DatetimeRunView.prototype.getResult = function() {
    return {
      "year": this.$el.find("#year").val(),
      "month": this.$el.find("#month").val(),
      "day": this.$el.find("#day").val(),
      "time": this.$el.find("#time").val()
    };
  };

  DatetimeRunView.prototype.getSkipped = function() {
    return {
      "year": "skipped",
      "month": "skipped",
      "day": "skipped",
      "time": "skipped"
    };
  };

  DatetimeRunView.prototype.isValid = function() {
    return true;
  };

  DatetimeRunView.prototype.showErrors = function() {
    return true;
  };

  DatetimeRunView.prototype.next = function() {
    console.log("next!!");
    this.prototypeView.on("click .next", (function(_this) {
      return function() {
        console.log("clickme!");
        return _this.next();
      };
    })(this));
    return this.parent.next();
  };

  DatetimeRunView.prototype.back = function() {
    return this.parent.back();
  };

  return DatetimeRunView;

})(Backbone.View);
