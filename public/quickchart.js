// set up our data series with 150 random data points
var seriesData = [ [], [], [], [], [], [], [], [], [] ];
var curX = 1;
for (var i = 0; i < seriesData.length; i++) {
  seriesData[i].push({x: 0, y: 0});
}
var palette = new Rickshaw.Color.Palette( { scheme: 'cool' } );
// instantiate our graph!
var graph = new Rickshaw.Graph( {
  element: document.getElementById("chart"),
  width: 900,
  height: 500,
  renderer: 'area',
  stroke: true,
  preserve: true,
  series: [
    {
      color: palette.color(),
      data: seriesData[0],
      name: '0'
    }, {
      color: palette.color(),
      data: seriesData[1],
      name: '1'
    }, {
      color: palette.color(),
      data: seriesData[2],
      name: '2'
    }, {
      color: palette.color(),
      data: seriesData[3],
      name: '3'
    }, {
      color: palette.color(),
      data: seriesData[4],
      name: '4'
    }, {
      color: palette.color(),
      data: seriesData[5],
      name: '5'
    }, {
      color: palette.color(),
      data: seriesData[6],
      name: '6'
    }
  ]
} );
graph.render();
var preview = new Rickshaw.Graph.RangeSlider( {
  graph: graph,
  element: document.getElementById('preview'),
} );
var hoverDetail = new Rickshaw.Graph.HoverDetail( {
  graph: graph,
  xFormatter: function(x) {
    return x.toString();
  }
} );
var annotator = new Rickshaw.Graph.Annotate( {
  graph: graph,
  element: document.getElementById('timeline')
} );
var legend = new Rickshaw.Graph.Legend( {
  graph: graph,
  element: document.getElementById('legend')
} );
var shelving = new Rickshaw.Graph.Behavior.Series.Toggle( {
  graph: graph,
  legend: legend
} );
var order = new Rickshaw.Graph.Behavior.Series.Order( {
  graph: graph,
  legend: legend
} );
var highlighter = new Rickshaw.Graph.Behavior.Series.Highlight( {
  graph: graph,
  legend: legend
} );
var smoother = new Rickshaw.Graph.Smoother( {
  graph: graph,
  element: document.querySelector('#smoother')
} );
var ticksTreatment = 'glow';
// var xAxis = new Rickshaw.Graph.Axis.Time( {
//   graph: graph,
//   ticksTreatment: ticksTreatment,
//   timeFixture: new Rickshaw.Fixtures.Time.Local()
// } );
// xAxis.render();
var yAxis = new Rickshaw.Graph.Axis.Y( {
  graph: graph,
  tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
  ticksTreatment: ticksTreatment
} );
yAxis.render();
var controls = new RenderControls( {
  element: document.querySelector('form'),
  graph: graph
} );
// add some data every so often
// var messages = [
//   "Changed home page welcome message",
//   "Minified JS and CSS",
//   "Changed button color from blue to green",
//   "Refactored SQL query to use indexed columns",
//   "Added additional logging for debugging",
//   "Fixed typo",
//   "Rewrite conditional logic for clarity",
//   "Added documentation for new methods"
// ];
// setInterval( function() {
//   // random.removeData(seriesData);
//   random.addData(seriesData);
//   graph.update();
// }, 500 );
// function addAnnotation(force) {
//   if (messages.length > 0 && (force || Math.random() >= 0.95)) {
//     annotator.add(seriesData[2][seriesData[2].length-1].x, messages.shift());
//     annotator.update();
//   }
// }
// addAnnotation(true);
// setTimeout( function() { setInterval( addAnnotation, 6000 ) }, 6000 );
// var previewXAxis = new Rickshaw.Graph.Axis.Time({
//   graph: preview.previews[0],
//   timeFixture: new Rickshaw.Fixtures.Time.Local(),
//   ticksTreatment: ticksTreatment
// });
// previewXAxis.render();

function connect(room) {
  socket = new WebSocket("ws://127.0.0.1:8080/ws?room="+encodeURIComponent(room));

  socket.onmessage = function(jsonMessage) {
    var msg = JSON.parse(jsonMessage.data);
    console.log(msg);
    for (var i = 0; i < seriesData.length; i++) {
      seriesData[i].push({x: curX, y: msg[i]});
    };
    curX++;
    graph.update();
  }

  socket.onclose = function() {
    console.log("socket closed - reconnecting...");
    window.setTimeout(connect,1000);
  }
}

var queryStr = window.location.search.substring(1)
connect((queryStr.length != 0) ? queryStr : "main");
