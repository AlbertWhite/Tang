var TimelineModel = Backbone.Model.extend({
  defaults: {
    id: 0,
    name: "",
    startyear: 0,
    endyear: 0
  }
});

var TimeLineCollection = Backbone.Collection.extend({
  url: "./emperor.json",
  model: TimelineModel
});

var TimeLineView = Backbone.View.extend({
  events: {},
  tagName: "div",
  render: function() {
    var height =
      parseInt(this.model.get("endyear")) -
      parseInt(this.model.get("startyear"));

    var timeline = $.parseHTML("<div class='time-line'></div>");
    var timebar = $.parseHTML("<div class='time-bar'></div>");
    var timetext = $.parseHTML(
      "<div class='time-text'>" +
        this.model.get("name") +
        this.model.get("startyear") +
        "</div>"
    );

    $(timebar).css("height", height * 5 + "px");
    $(timeline).css("height", height * 5 + "px");

    $(timeline).append(timetext);
    $(timeline).append(timebar);
    this.$el.html(timeline);
    return this;
  }
});

var TimeLineContainerView = Backbone.View.extend({
  el: ".timeline-container",
  model: TimelineModel,
  initialize: function() {
    this.collection.on("sync", this.render, this);
  },
  render: function() {
    this.collection.each(function(model) {
      var timeLineView = new TimeLineView({
        model: model
      });
      this.$el.append(timeLineView.render().el);
    }, this);
  }
});

var timeLineCollection = new TimeLineCollection();
var timeLineContainerView = new TimeLineContainerView({
  collection: timeLineCollection
});

timeLineCollection.fetch({
  success: function(collection, response) {
    console.log(collection);
    console.log(response);
  }
});
