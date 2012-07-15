var KlassSubtestResultView,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

KlassSubtestResultView = (function(_super) {

  __extends(KlassSubtestResultView, _super);

  function KlassSubtestResultView() {
    KlassSubtestResultView.__super__.constructor.apply(this, arguments);
  }

  KlassSubtestResultView.prototype.events = {
    "click .run": "gotoRun",
    "click .back": "back"
  };

  KlassSubtestResultView.prototype.initialize = function(options) {};

  KlassSubtestResultView.prototype.gotoRun = function() {
    return Tangerine.router.navigate("class/run/" + this.options.student.id + "/" + this.options.subtest.id, true);
  };

  KlassSubtestResultView.prototype.back = function() {
    return Tangerine.router.navigate("class/" + (this.options.student.get("klassId")) + "/" + (this.options.subtest.get("week")), true);
  };

  KlassSubtestResultView.prototype.render = function() {
    var datum, html, i, resultHTML, subtestItems, taken, timestamp, _len, _ref;
    subtestItems = this.options.subtest.get("items");
    resultHTML = "<br>";
    taken = "";
    if (this.options.result.length !== 0) {
      resultHTML += "<table><tbody><tr><th>Item</th><th>Result</th></tr>";
      _ref = this.options.result[0].get("subtestData").items;
      for (i = 0, _len = _ref.length; i < _len; i++) {
        datum = _ref[i];
        resultHTML += "<tr><td>" + subtestItems[i] + "</td><td>" + datum + "</td></tr>";
      }
      resultHTML += "</tbody></table>";
      timestamp = new Date(this.options.result[0].get("timestamp"));
      taken += "        <tr>          <td><label>Taken</label></td><td>" + (timestamp.getFullYear()) + "/" + (timestamp.getMonth() + 1) + "/" + (timestamp.getDate()) + "</td>        </tr>      ";
    }
    html = "      <h1>Result</h1>      <table class='info_box'><tbody>        <tr>          <td><label>Week</label></td>          <td>" + (this.options.subtest.get("week")) + "</td>        </tr>        <tr>          <td><label>Student</label></td>          <td>" + (this.options.student.escape("name")) + "</td>        </tr>        <tr>          <td><label>Subtest</label></td>          <td>" + (this.options.subtest.escape("name")) + "</td>        </tr>        " + taken + "      </tbody></table>      " + resultHTML + "      <div class='menu_box'>        <img src='images/icon_run.png' class='run'>      </div><br>      <button class='navigation back'>Back</button>    ";
    this.$el.html(html);
    return this.trigger("rendered");
  };

  return KlassSubtestResultView;

})(Backbone.View);
