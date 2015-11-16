// Generated by CoffeeScript 1.10.0
var GpsRunView,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

GpsRunView = (function(superClass) {
  extend(GpsRunView, superClass);

  function GpsRunView() {
    this.poll = bind(this.poll, this);
    return GpsRunView.__super__.constructor.apply(this, arguments);
  }

  GpsRunView.prototype.className = "GpsRunView";

  GpsRunView.prototype.events = {
    'click .clear': 'clear'
  };

  GpsRunView.prototype.clear = function() {
    this.position = null;
    return this.updateDisplay();
  };

  GpsRunView.prototype.initialize = function(options) {
    this.i18n();
    this.model = options.model;
    this.parent = options.parent;
    this.dataEntry = options.dataEntry;
    this.position = null;
    return this.retryCount = 0;
  };

  GpsRunView.prototype.i18n = function() {
    return this.text = {
      "clear": t('GpsRunView.button.clear'),
      "good": t('GpsRunView.label.good'),
      "ok": t('GpsRunView.label.ok'),
      "poor": t('GpsRunView.label.poor'),
      "latitude": t('GpsRunView.label.latitude'),
      "longitude": t('GpsRunView.label.longitude'),
      "accuracy": t('GpsRunView.label.accuracy'),
      "meters": t('GpsRunView.label.meters'),
      "savedReading": t('GpsRunView.label.saved_reading'),
      "currentReading": t('GpsRunView.label.current_reading'),
      "bestReading": t('GpsRunView.label.best_reading'),
      "gpsStatus": t('GpsRunView.label.gps_status'),
      "gpsOk": t('GpsRunView.message.gps_ok'),
      "retrying": t('GpsRunView.message.retrying'),
      "searching": t('GpsRunView.message.searching'),
      "notSupported": _(t('GpsRunView.message.not_supported')).escape()
    };
  };

  GpsRunView.prototype.poll = function() {
    return navigator.geolocation.getCurrentPosition((function(_this) {
      return function(position) {
        _this.updateDisplay(position);
        _this.updatePosition(position);
        _this.updateStatus(_this.text.gpsOk);
        _this.retryCount = 0;
        if (!_this.stopPolling) {
          return setTimeout(_this.poll(), 5 * 1000);
        }
      };
    })(this), (function(_this) {
      return function(positionError) {
        _this.updateStatus(positionError.message);
        if (!_this.stopPolling) {
          setTimeout(_this.poll(), 5 * 1000);
        }
        return _this.retryCount++;
      };
    })(this), {
      maximumAge: 10 * 1000,
      timeout: 30 * 1000,
      enableHighAccuracy: true
    });
  };

  GpsRunView.prototype.easify = function(position) {
    var ref, ref1, ref2, ref3, ref4, ref5, ref6;
    return {
      lat: (position != null ? (ref = position.coords) != null ? ref.latitude : void 0 : void 0) != null ? position.coords.latitude : "...",
      long: (position != null ? (ref1 = position.coords) != null ? ref1.longitude : void 0 : void 0) != null ? position.coords.longitude : "...",
      alt: (position != null ? (ref2 = position.coords) != null ? ref2.altitude : void 0 : void 0) != null ? position.coords.altitude : "...",
      acc: (position != null ? (ref3 = position.coords) != null ? ref3.accuracy : void 0 : void 0) != null ? position.coords.accuracy : "...",
      altAcc: (position != null ? (ref4 = position.coords) != null ? ref4.altitudeAccuracy : void 0 : void 0) != null ? position.coords.altitudeAccuracy : "...",
      heading: (position != null ? (ref5 = position.coords) != null ? ref5.heading : void 0 : void 0) != null ? position.coords.heading : "...",
      speed: (position != null ? (ref6 = position.coords) != null ? ref6.speed : void 0 : void 0) != null ? position.coords.speed : "...",
      timestamp: (position != null ? position.timestamp : void 0) != null ? position.timestamp : "..."
    };
  };

  GpsRunView.prototype.updatePosition = function(newPosition) {
    var ref;
    newPosition = this.easify(newPosition);
    if (this.position == null) {
      this.position = newPosition;
    }
    if ((((newPosition != null ? newPosition.acc : void 0) != null) && (((ref = this.position) != null ? ref.acc : void 0) != null)) && newPosition.acc <= this.position.acc) {
      return this.position = newPosition;
    }
  };

  GpsRunView.prototype.updateDisplay = function(position) {
    var acc, data, el, html, i, j, lat, len, long, pos, positions, results;
    position = this.easify(position);
    positions = [
      {
        el: this.$el.find(".gps_current"),
        data: position
      }, {
        el: this.$el.find(".gps_best"),
        data: this.position
      }
    ];
    results = [];
    for (i = j = 0, len = positions.length; j < len; i = ++j) {
      pos = positions[i];
      data = pos.data;
      el = pos.el;
      lat = (data != null ? data.lat : void 0) ? parseFloat(data.lat).toFixed(4) : "...";
      long = (data != null ? data.long : void 0) ? parseFloat(data.long).toFixed(4) : "...";
      acc = (data != null ? data.acc : void 0) ? parseInt(data.acc) + (" " + this.text.meters) : "...";
      acc = acc + (parseInt(data != null ? data.acc : void 0) < 50 ? "(" + this.text.good + ")" : parseInt(data != null ? data.acc : void 0) > 100 ? "(" + this.text.poor + ")" : "(" + this.text.ok + ")");
      html = "<table> <tr><td>" + this.text.latitude + "</td> <td>" + lat + "</td></tr> <tr><td>" + this.text.longitude + "</td><td>" + long + "</td></tr> <tr><td>" + this.text.accuracy + "</td> <td>" + acc + "</td></tr> </table>";
      results.push(el.html(html));
    }
    return results;
  };

  GpsRunView.prototype.updateStatus = function(message) {
    var polling, retries;
    if (message == null) {
      message = '';
    }
    retries = this.retryCount > 0 ? t('GpsRunView.message.attempt', {
      count: this.retryCount + 1
    }) : "";
    polling = !this.stopPolling ? "<br>" + this.text.retrying + " " + retries : "";
    return this.$el.find(".status").html(message + polling);
  };

  GpsRunView.prototype.render = function() {
    var acc, lat, long, previous;
    if (!Modernizr.geolocation) {
      this.$el.html(this.text.notSupported);
      this.position = this.easify(null);
      this.trigger("rendered");
      return this.trigger("ready");
    } else {
      if (!this.dataEntry) {
        previous = this.parent.parent.result.getByHash(this.model.get('hash'));
      }
      if (previous) {
        lat = previous.lat;
        long = previous.long;
        acc = previous.acc;
        this.$el.html("<section> <h3>" + this.text.savedReading + "</h3> <div class='gps_saved'> <table> <tr><td>" + this.text.latitude + "</td> <td>" + lat + "</td></tr> <tr><td>" + this.text.longitude + "</td><td>" + long + "</td></tr> <tr><td>" + this.text.accuracy + "</td> <td>" + acc + "</td></tr> </table> </div>");
      } else {
        this.$el.html("<section> <h3>" + this.text.bestReading + "</h3> <div class='gps_best'></div><button class='clear command'>" + this.text.clear + "</button> <h3>" + this.text.currentReading + "</h3> <div class='gps_current'></div> </section> <section> <h2>" + this.text.gpsStatus + "</h2> <div class='status'>" + this.text.searching + "</div> </section>");
      }
      this.trigger("rendered");
      this.trigger("ready");
      return this.poll();
    }
  };

  GpsRunView.prototype.getResult = function() {
    var previous;
    previous = this.parent.parent.result.getByHash(this.model.get('hash'));
    if (previous) {
      return previous;
    }
    return this.position || {};
  };

  GpsRunView.prototype.getSkipped = function() {
    return this.position || {};
  };

  GpsRunView.prototype.onClose = function() {
    return this.stopPolling = true;
  };

  GpsRunView.prototype.isValid = function() {
    return true;
  };

  GpsRunView.prototype.showErrors = function() {
    return true;
  };

  return GpsRunView;

})(Backbone.View);