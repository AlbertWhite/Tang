var POETS_INFORMATION;

var PoetModel = Backbone.Model.extend({
  defaults: {
    id: 0,
    name: "",
    start: 0,
    end: 0
  }
});

var PoetCollection = Backbone.Collection.extend({
  url: "./data/poets.json",
  model: PoetModel
});

var PoetView = Backbone.View.extend({
  initialize: function(options) {
    this.middleAge = options.middleAge;
  },
  className: "poet-text",
  tagName: "div",
  events: {
    "click .poet-name": "viewPoetDetail"
  },
  viewPoetDetail(e) {
    $(".time-life-bar").remove();

    $(".poet-name").removeClass("highlight");
    $(e.currentTarget)
      //.find(".poet-name")
      .addClass("highlight");

    var selectedPoetName = $(e.currentTarget).text();
    for (var i = 0; i < POETS_INFORMATION.length; i++) {
      if (POETS_INFORMATION[i].name == selectedPoetName) {
        var poet = POETS_INFORMATION[i];
        var life_duration = poet.end - poet.start;

        //new life bar
        var lifebar = $.parseHTML("<div class='time-life-bar'></div>");

        var height = life_duration * ZOOM_IN_TIMES;
        $(lifebar).append("<div class='life-start'>" + poet.start + "</div>");
        $(lifebar).append("<div class='life-end'>" + poet.end + "</div>");
        $(lifebar).append("<div class='life-center-bar'></div>");
        $(lifebar).css("height", +height + "px");
        $(lifebar).css("top", -height / 2 + "px");
        $(e.currentTarget)
          .parent()
          .append(lifebar);
        console.log(life_duration);
      }
    }
  },
  render: function() {
    //get the middle age of the poet
    var distance = this.middleAge - EVENT_START_YEAR;
    var poet = $.parseHTML(
      "<a target='_blank' class='poet-name' href='http://so.gushiwen.org/search.aspx?value=" +
        this.model.get("name") +
        "'>" +
        this.model.get("name") +
        "</a>"
    );
    this.$el.css("top", distance * ZOOM_IN_TIMES + 400 + "px");
    this.$el.html(poet);
    return this;
  }
});

var PoetContainerView = Backbone.View.extend({
  model: PoetModel,
  initialize: function() {
    this.collection.on("sync", this.render, this);
  },
  render: function() {
    var yearArray = []; //put all the years
    this.collection.each(function(model) {
      var isNewNode = false;
      var middleAge = Math.floor((model.get("end") + model.get("start")) / 2);
      if (yearArray.indexOf(middleAge) == -1) {
        isNewNode = true;
      }

      if (isNewNode) {
        var poetView = new PoetView({
          model: model,
          middleAge: middleAge
        });
        $(".poets-container").append(poetView.render().el);
        yearArray.push(middleAge);
      } else {
        $(".poet-text").each(function(index, ele) {
          if (
            $(ele)
              .html()
              .includes(middleAge)
          ) {
            $(ele)
              .find(".poet-name")
              .append(model.get("name"));
          }
        });
      }
    }, this);
  }
});

var poetCollection = new PoetCollection();
var poetContainerView = new PoetContainerView({
  collection: poetCollection
});

poetCollection.fetch({
  success: function(collection, response) {
    POETS_INFORMATION = response;
    console.log(collection);
    console.log(response);
  },
  error: function() {
    console.log("error in getting data");
  }
});
