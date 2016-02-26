(function(undefined){

  d3.svg.rangeSlider = function(){

    var validEvents = ["change", "slide"];

    var range = [0, 10],
    values = [2, 8],
    height = 10,
    width = 100,
    margin = {top: 5, bottom: 5, right: 5, left: 5};

    var eventListeners = {
      "slide" : [],
      "change": []
    };


    function slider(g) {
      g.each(function(){
        var g = d3.select(this);

        var scale = d3.scale.linear().domain(range).range([0, width]);

        var background = g.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "white");

        var rangeRect = g.append("rect")
        .attr("x", scale(values[0]))
        .attr("y", 0)
        .attr("width", scale(values[1])-scale(values[0]))
        .attr("height", height)
        .attr("fill", "gray");

        //left handle
        var leftHandle = g.append("circle")
        .attr("cx", scale(values[0]))
        .attr("cy", height/2)
        .attr("r", height/2)
        .attr("fill", "black");

        var rightHandle = g.append("circle")
        .attr("cx", scale(values[1]) )
        .attr("cy", height/2)
        .attr("r", height/2)
        .attr("fill", "black");

        var leftDrag = d3.behavior.drag(),
        rightDrag = d3.behavior.drag(),
        rangeDrag = d3.behavior.drag();

        leftDrag.on("drag", function(){
          var currentX = +leftHandle.attr("cx");
          var newX = currentX + d3.event.dx;
          if (scale.invert(newX) < range[0]) {
            values[0] = range[0];
          } else if (scale.invert(newX + height/2) < values[1] ) {
            values[0] = scale.invert(newX);
            callEventListeners("slide", { handle: "left" });
          }
          redraw();
        })
        .on("dragend", function(){
          callEventListeners("change", { handle: "left" });
        })
        leftHandle.call(leftDrag);

        rightDrag.on("drag", function(){
          var currentX = +rightHandle.attr("cx");

          var newX = currentX + d3.event.dx;

          if (scale.invert(newX) > range[1]) {
            values[1] = range[1];
          } else if (scale.invert(newX) > values[0] ){
            values[1] = scale.invert(newX);
            callEventListeners("slide", { handle: "right" });
          }
          redraw();
        })
        .on("dragend", function(){
          callEventListeners("change", { handle: "right" });
        })
        rightHandle.call(rightDrag);

        rangeDrag.on("drag", function(){
          var currentLeftX = +leftHandle.attr("cx");
          var newLeftX = currentLeftX + d3.event.dx;

          var currentRightX = +rightHandle.attr("cx");
          var newRightX = currentRightX + d3.event.dx;

          if (scale.invert(newLeftX) >= range[0] && scale.invert(newRightX) <= range[1]) {
            values[0] = scale.invert(newLeftX);
            values[1] = scale.invert(newRightX);
            callEventListeners("slide", { handle: "range" });
          }
          redraw();
        })
        .on("dragend", function(){
          callEventListeners("change", { handle: "range" });
        });
        rangeRect.call(rangeDrag);


        function callEventListeners(event, params){
          var listeners = eventListeners[event];
          for(var i in listeners){
            listeners[i](event, params);
          }
        }

        //  this function redraws the slider
        function redraw(){
          rightHandle.attr("cx", scale(values[1]));
          leftHandle.attr("cx", scale(values[0]));
          rangeRect.attr("x", scale(values[0])).attr("width", scale(values[1]) - scale(values[0]) );
        }
      });
    }

    slider.on = function(event, listener) {
      if(!event || !arrayContains(validEvents, event)){
        throw new Error(event + " is not a valid range slider event. It should be one of " + validEvents);
      }
      eventListeners[event].push(listener);
      return slider;
    }

    slider.range = function(x) {
      if(!arguments.length) {return range;}
      range = x;
      return slider;
    }

    slider.values = function(x){
      if(!arguments.length) {return values;}
      values = x;
      return slider;
    }

    slider.height = function(x){
      if(!arguments.length) {return height;}
      height = x;
      return slider;
    }

    slider.width = function(x){
      if(!arguments.length) {return width;}
      width = x;
      return slider;
    }

    return slider;
  };

  // utility functions
  /**
   * Checks if an array contains a value
   * @param  {[type]} array [description]
   * @param  {[type]} value [description]
   * @return {[type]}       [description]
   */
  function arrayContains(array, value) {
    for(var i in array){
      if (array[i] === value){
        return true;
      }
    }
    return false;
  }
})(undefined);
