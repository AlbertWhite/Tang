const EVENT_START_YEAR = 618;
const ZOOM_IN_TIMES = 27;
var POETS_INFORMATION;

var EventModel = Backbone.Model.extend({
  defaults: {
    id: 0,
    name: "",
    year: 0,
    subcontent: []
  }
});

var PoetModel = Backbone.Model.extend({
  defaults: {
    id: 0,
    name: "",
    start: 0,
    end: 0
  }
});

var EventCollection = Backbone.Collection.extend({
  url: "./data/events.json",
  model: EventModel
});

var PoetCollection = Backbone.Collection.extend({
  url: "./data/poets.json",
  model: PoetModel
});

var EventView = Backbone.View.extend({
  initialize: function(options) {
    //parameters need to be passed in variable options
    this.nextYear = options.nextYear;
  },
  events: {},
  tagName: "div",
  render: function() {
    var height = this.nextYear - this.model.get("year");
    var event = $.parseHTML("<div class='time-line'></div>");
    var timebar = $.parseHTML("<div class='time-bar'></div>");
    var timetext = $.parseHTML(
      "<div class='time-text'>" +
        "<div class='year'>" +
        this.model.get("year") +
        "</div>" +
        "<div class='name'><div class='firstletter'>" +
        this.model.get("name")[0] +
        "</div><div>" +
        this.model.get("name").substr(1) +
        "</div></div>" +
        "</div>"
    );

    // if (this.model.get("subcontent").length > 0) {
    //   _.each(this.model.get("subcontent"), function(content) {
    //     $(timetext).append("<div class='subcontent'>" + content + "</div>");
    //   });
    // }

    $(event).css("height", height * ZOOM_IN_TIMES + "px");
    $(timebar).css("height", height * ZOOM_IN_TIMES + "px");
    $(event).append(timetext);
    $(event).append(timebar);
    this.$el.html(event);
    return this;
  }
});

var EventContainerView = Backbone.View.extend({
  el: ".events-container",
  model: EventModel,
  initialize: function() {
    this.collection.on("sync", this.render, this);
  },
  render: function() {
    var nextYear = this.collection.at(1).get("year");
    this.collection.each(function(model, index) {
      var eventView = new EventView({
        model: model,
        nextYear: nextYear
      });
      this.$el.append(eventView.render().el);
      nextYear = this.collection.at(index + 2).get("year");
    }, this);
  }
});

var PoetView = Backbone.View.extend({
  className: "poet-text",
  tagName: "div",
  events: {
    "click .poet-name": "viewPoetDetail"
  },
  viewPoetDetail(){
    for(var i = 0; i < POETS_INFORMATION.length; i++){
      var poet = POETS_INFORMATION[i];
      var life_duration = poet.end - poet.start;      
    }
  },
  render: function() {

    //if it is new node
    var distance = this.model.get("start") - EVENT_START_YEAR;
    var poet = $.parseHTML(
      "<div class='poet-name'>" +
        this.model.get("name") +
        "</div><div class='poet-year'>" +
        this.model.get("start") +
        "</div>"
    );
    this.$el.css("top", distance * ZOOM_IN_TIMES + "px");
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
      if(yearArray.indexOf(model.get('start')) == -1){
        isNewNode = true;
      }

      if(isNewNode){
        var poetView = new PoetView({
          model: model
        });
        $(".events-container").append(poetView.render().el);
        yearArray.push(model.get('start'));
      }else{
        $(".poet-text").each(function(index, ele){
          if($(ele).html().includes(model.get("start"))){
            $(ele).find(".poet-name").append(model.get("name"));
          }
        });
      }

    }, this);
  }
});

var eventCollection = new EventCollection();
var poetCollection = new PoetCollection();
var eventContainerView = new EventContainerView({
  collection: eventCollection
});
var poetContainerView = new PoetContainerView({
  collection: poetCollection
});
eventCollection.fetch({
  success: function(collection, response) {
    console.log(collection);
    console.log(response);
  }
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
