(function(){
var
  container = document.getElementById("chart"),
  x = [],
  dataA = [],
  dataB = [],
  data = [[x, dataA], [x, dataB]],
  options, i, timeseries, selStart = 10, selStop;

// Mock Data:
function sample(i) {
  x.push(i);
  dataA.push(Math.sin(i / 6) * (Math.random() + 1) / 2);
  dataB.push(Math.sin(i / 6 + Math.PI / 2) * (Math.random() + 1) / 2);
}

// Initial Data:
for (i = 0; i < 100; i++) {
  sample(i);
}

// Envision Timeseries Options
options = {
  container : container,
  data : {
    detail : data,
    summary : data
  },
  defaults : {
    summary : {
      config : {
        handles : { show : true }
      }
    }
  },
  selectionCallback: function(sel) {
    console.log(sel);
    selStart = sel.data.x.min;
    selStop = sel.data.x.max;
  }
}

// Render the timeseries
timeseries = new envision.templates.TimeSeries(options);

// Method to get new data
// This could be part of an Ajax callback, a websocket callback,
// or streaming / long-polling data source.
function getNewData () {
  i++;

  // Short circuit (no need to keep going!  you get the idea)
  if (i > 1000) return;

  sample(i);
  animate(i);
}

// Initial request for new data
getNewData();

// Animate the new data
function animate (i) {
  // Draw the summary first
  timeseries.summary.draw(null, {
    xaxis : {
      min : 0,
      max : i
    }
  });

  // console.log(timeseries);
  console.log(selStart);

  // Trigger the select interaction.
  // Update the select region and draw the detail graph.
  if(selStop >= i - 2 || selStop == undefined) {
    selStop = i;
  }
  timeseries.summary.trigger('select', {
    data : {
      x : {
        min : selStart,
        max : selStop
      }
    }
  });

  setTimeout(getNewData, 1000);
}

})();
