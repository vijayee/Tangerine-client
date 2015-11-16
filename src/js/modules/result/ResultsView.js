// Generated by CoffeeScript 1.10.0
var ResultsView,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ResultsView = (function(superClass) {
  extend(ResultsView, superClass);

  function ResultsView() {
    this.afterRender = bind(this.afterRender, this);
    this.updateResults = bind(this.updateResults, this);
    this.updateOptions = bind(this.updateOptions, this);
    this.detectTablets = bind(this.detectTablets, this);
    return ResultsView.__super__.constructor.apply(this, arguments);
  }

  ResultsView.prototype.className = "ResultsView";

  ResultsView.prototype.events = {
    'click .cloud': 'cloud',
    'click .tablets': 'tablets',
    'click .detect': 'detectOptions',
    'click .details': 'showResultSumView',
    'change #limit': "setLimit",
    'change #page': "setOffset"
  };

  ResultsView.prototype.showResultSumView = function(event) {
    var $details, result, targetId;
    targetId = $(event.target).attr("data-result-id");
    $details = this.$el.find("#details_" + targetId);
    if ($details.html() !== '') {
      return $details.empty();
    }
    result = new Result({
      "_id": targetId
    });
    return result.fetch({
      success: function() {
        var view;
        view = new ResultSumView({
          model: result,
          finishCheck: true
        });
        view.render();
        $details.html("<div class='info_box'>" + $(view.el).html() + "</div>");
        return view.close();
      }
    });
  };

  ResultsView.prototype.cloud = function() {
    var allDocs;
    allDocs = Tangerine.settings.urlDB("group", true) + "/_all_docs";
    console.log(allDocs);
    $.ajax({
      url: allDocs,
      type: "POST",
      data: JSON.stringify({
        keys: this.docList
      }),
      beforeSend: function(xhr) {
        console.log("setting to");
        console.log('Basic ' + btoa("tangerine:tangytangerine"));
        return xhr.setRequestHeader('Authorization', 'Basic ' + btoa(Tangerine.settings.get("upUser") + ":" + Tangerine.settings.get("upPass")));
      },
      error: (function(_this) {
        return function(err) {
          return console.log(err);
        };
      })(this),
      success: (function(_this) {
        return function(response) {
          var a, bulkDocsUrl, compressedData, docs, i, leftToUpload, len, row, rows;
          rows = response.rows;
          leftToUpload = [];
          for (i = 0, len = rows.length; i < len; i++) {
            row = rows[i];
            if (row.id == null) {
              leftToUpload.push(row.key);
            }
          }
          Tangerine.db.allDocs({
            include_docs: true,
            keys: leftToUpload
          }).then(function() {
            return console.log(arguments);
          });
          return;
          docs = {
            "docs": response.rows.map(function(el) {
              return el.doc;
            })
          };
          compressedData = LZString.compressToBase64(JSON.stringify(docs));
          a = document.createElement("a");
          a.href = Tangerine.settings.get("groupHost");
          bulkDocsUrl = a.protocol + "//" + a.host + "/_corsBulkDocs/" + Tangerine.settings.groupDB;
          return $.ajax({
            type: "post",
            url: bulkDocsUrl,
            data: compressedData,
            error: function() {
              _this.uploadingNow = false;
              return alert("Server bulk docs error");
            },
            success: function() {
              _this.sunc.push(currentTrip);
              _this.sunc = _.uniq(_this.sunc);
              _this.log.setTrips(_this.sunc);
              return _this.log.save(null, {
                error: function() {
                  return _this.uploadingNow = false;
                },
                success: function() {
                  return _this.update(function() {
                    _this.render();
                    return doTrip();
                  });
                }
              });
            }
          });
        };
      })(this)
    });
    if (this.available.cloud.ok) {
      console.log("going here " + (Tangerine.settings.urlDB("group", true)));
      $.ajax({
        url: Tangerine.settings.urlDB("group", true) + "/_all_docs",
        ajax: {
          cache: false,
          timeout: 30000,
          data: {
            keys: this.docList
          }
        },
        auth: {
          username: Tangerine.settings.get("upUser"),
          password: Tangerine.settings.get("upPass")
        }
      }).then(function() {
        return console.log(arguments);
      });
      return;
      Tangerine.db.replicate.to(Tangerine.settings.urlDB("group", true), {
        doc_ids: this.docList
      }).on("error", (function(_this) {
        return function(err) {
          return _this.$el.find(".status").find(".info_box").html("<div>Sync error</div><div>" + err + "</div>");
        };
      })(this)).on("complete", (function(_this) {
        return function(info) {
          return _this.$el.find(".status").find(".info_box").html("Results synced to cloud successfully");
        };
      })(this));
    } else {
      Utils.midAlert("Cannot detect cloud");
    }
    return false;
  };

  ResultsView.prototype.tablets = function() {
    var fn, i, ip, len, ref;
    if (this.available.tablets.okCount > 0) {
      ref = this.available.tablets.ips;
      fn = (function(_this) {
        return function(ip) {
          return $.couch.replicate(Tangerine.settings.urlDB("local"), Tangerine.settings.urlSubnet(ip), {
            success: function() {
              return _this.$el.find(".status").find(".info_box").html("Results synced to " + _this.available.tablets.okCount + " successfully");
            },
            error: function(a, b) {
              return _this.$el.find(".status").find(".info_box").html("<div>Sync error</div><div>" + a + " " + b + "</div>");
            }
          }, {
            doc_ids: _this.docList
          });
        };
      })(this);
      for (i = 0, len = ref.length; i < len; i++) {
        ip = ref[i];
        fn(ip);
      }
    } else {
      Utils.midAlert("Cannot detect tablets");
    }
    return false;
  };

  ResultsView.prototype.initDetectOptions = function() {
    return this.available = {
      cloud: {
        ok: false,
        checked: false
      },
      tablets: {
        ips: [],
        okCount: 0,
        checked: 0,
        total: 256
      }
    };
  };

  ResultsView.prototype.detectOptions = function() {
    $("button.cloud, button.tablets").attr("disabled", "disabled");
    this.detectCloud();
    return this.detectTablets();
  };

  ResultsView.prototype.detectCloud = function() {
    return $.ajax({
      type: "GET",
      dataType: "json",
      url: Tangerine.settings.urlHost("group"),
      success: (function(_this) {
        return function(a, b) {
          console.log("cloudy");
          return _this.available.cloud.ok = true;
        };
      })(this),
      error: (function(_this) {
        return function(a, b) {
          console.log("error man");
          return _this.available.cloud.ok = false;
        };
      })(this),
      complete: (function(_this) {
        return function() {
          console.log("complete at least");
          _this.available.cloud.checked = true;
          return _this.updateOptions();
        };
      })(this)
    });
  };

  ResultsView.prototype.detectTablets = function() {
    var i, local, results;
    results = [];
    for (local = i = 0; i <= 255; local = ++i) {
      results.push((function(_this) {
        return function(local) {
          var ip;
          ip = Tangerine.settings.subnetIP(local);
          return $.ajax({
            url: Tangerine.settings.urlSubnet(ip),
            dataType: "jsonp",
            contentType: "application/json;charset=utf-8",
            timeout: 30000,
            complete: function(xhr, error) {
              _this.available.tablets.checked++;
              if (xhr.status === 200) {
                _this.available.tablets.okCount++;
                _this.available.tablets.ips.push(ip);
              }
              return _this.updateOptions();
            }
          });
        };
      })(this)(local));
    }
    return results;
  };

  ResultsView.prototype.updateOptions = function() {
    var message, percentage, tabletMessage;
    percentage = Math.decimals((this.available.tablets.checked / this.available.tablets.total) * 100, 2);
    if (percentage === 100) {
      message = "finished";
    } else {
      message = percentage + "%";
    }
    tabletMessage = "Searching for tablets: " + message;
    if (this.available.tablets.checked > 0) {
      this.$el.find(".checking_status").html("" + tabletMessage);
    }
    if (this.available.cloud.checked && this.available.tablets.checked === this.available.tablets.total) {
      this.$el.find(".status .info_box").html("Done detecting options");
      this.$el.find(".checking_status").hide();
    }
    if (this.available.cloud.ok) {
      this.$el.find('button.cloud').removeAttr('disabled');
    }
    if (this.available.tablets.okCount > 0 && percentage === 100) {
      return this.$el.find('button.tablets').removeAttr('disabled');
    }
  };

  ResultsView.prototype.i18n = function() {
    return this.text = {
      saveOptions: t("ResultsView.label.save_options"),
      cloud: t("ResultsView.label.cloud"),
      tablets: t("ResultsView.label.tablets"),
      csv: t("ResultsView.label.csv"),
      started: t("ResultsView.label.started"),
      results: t("ResultsView.label.results"),
      details: t("ResultsView.label.details"),
      page: t("ResultsView.label.page"),
      status: t("ResultsView.label.status"),
      perPage: t("ResultsView.label.par_page"),
      noResults: t("ResultsView.message.no_results"),
      detect: t("ResultsView.button.detect")
    };
  };

  ResultsView.prototype.initialize = function(options) {
    var i, len, ref, result;
    this.i18n();
    this.resultLimit = 100;
    this.resultOffset = 0;
    this.subViews = [];
    this.results = options.results;
    this.assessment = options.assessment;
    this.docList = [];
    ref = this.results;
    for (i = 0, len = ref.length; i < len; i++) {
      result = ref[i];
      this.docList.push(result.get("_id"));
    }
    this.initDetectOptions();
    return this.detectCloud();
  };

  ResultsView.prototype.render = function() {
    var html;
    this.clearSubViews();
    html = "<h1>" + (this.assessment.getEscapedString('name')) + " " + this.text.results + "</h1> <h2>" + this.text.saveOptions + "</h2> <div class='menu_box'> <button class='cloud command' disabled='disabled'>" + this.text.cloud + "</button> <button class='tablets command' disabled='disabled'>" + this.text.tablets + "</button> </div> <button class='detect command'>" + this.text.detect + "</button> <div class='status'> <h2>" + this.text.status + "</h2> <div class='info_box'></div> <div class='checking_status'></div> </div> <h2 id='results_header'>" + this.text.results + " (<span id='result_position'>loading...</span>)</h2> <div class='confirmation' id='controls'> <label for='page' class='small_grey'>" + this.text.page + "</label><input id='page' type='number' value='0'> <label for='limit' class='small_grey'>" + this.text.perPage + "</label><input id='limit' type='number' value='0'> </div> <section id='results_container'></section>";
    this.$el.html(html);
    this.updateResults();
    return this.trigger("rendered");
  };

  ResultsView.prototype.setLimit = function(event) {
    this.resultLimit = +$("#limit").val() || 100;
    return this.updateResults();
  };

  ResultsView.prototype.setOffset = function(event) {
    var calculated, maxPage, val;
    val = +$("#page").val() || 1;
    calculated = (val - 1) * this.resultLimit;
    maxPage = Math.floor(this.results.length / this.resultLimit);
    this.resultOffset = Math.limit(0, calculated, maxPage * this.resultLimit);
    return this.updateResults();
  };

  ResultsView.prototype.updateResults = function(focus) {
    var previews, ref;
    if (((ref = this.results) != null ? ref.length : void 0) === 0) {
      this.$el.find('#results_header').html(this.text.noResults);
      return;
    }
    previews = new ResultPreviews;
    return previews.fetch({
      viewOptions: {
        key: "result-" + this.assessment.id
      }
    }).then((function(_this) {
      return function() {
        var count, currentPage, end, htmlRows, maxResults, start, total;
        console.log("testing");
        console.log(_this);
        console.log(arguments);
        count = previews.labelngth;
        maxResults = 100;
        currentPage = Math.floor(_this.resultOffset / _this.resultLimit) + 1;
        if (_this.results.length > maxResults) {
          _this.$el.find("#controls").removeClass("confirmation");
          _this.$el.find("#page").val(currentPage);
          _this.$el.find("#limit").val(_this.resultLimit);
        }
        start = _this.resultOffset + 1;
        end = Math.min(_this.resultOffset + _this.resultLimit, _this.results.length);
        total = _this.results.length;
        _this.$el.find('#result_position').html(t("ResultsView.label.pagination", {
          start: start,
          end: end,
          total: total
        }));
        htmlRows = "";
        console.log(previews);
        previews.models.forEach(function(preview) {
          var endTime, fromNow, id, long, startTime, time;
          console.log("doing thisone");
          id = preview.getString('participantId', "No ID");
          endTime = preview.get("endTime");
          if (endTime != null) {
            long = moment(endTime).format('YYYY-MMM-DD HH:mm');
            fromNow = moment(endTime).fromNow();
          } else {
            startTime = preview.get("startTime");
            long = ("<b>" + _this.text.started + "</b> ") + moment(startTime).format('YYYY-MMM-DD HH:mm');
            fromNow = moment(startTime).fromNow();
          }
          time = long + " (" + fromNow + ")";
          return htmlRows += "<div> " + id + " - " + time + " <button data-result-id='" + preview.id + "' class='details command'>" + _this.text.details + "</button> <div id='details_" + preview.id + "'></div> </div>";
        });
        console.log("got here");
        console.log(htmlRows);
        _this.$el.find("#results_container").html(htmlRows);
        return _this.$el.find(focus).focus();
      };
    })(this));
  };

  ResultsView.prototype.afterRender = function() {
    var i, len, ref, results, view;
    ref = this.subViews;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      view = ref[i];
      results.push(typeof view.afterRender === "function" ? view.afterRender() : void 0);
    }
    return results;
  };

  ResultsView.prototype.clearSubViews = function() {
    var i, len, ref, view;
    ref = this.subViews;
    for (i = 0, len = ref.length; i < len; i++) {
      view = ref[i];
      view.close();
    }
    return this.subViews = [];
  };

  return ResultsView;

})(Backbone.View);