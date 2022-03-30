

mapboxgl.accessToken = 'pk.eyJ1IjoiY3dob25nIiwiYSI6IjAyYzIwYTJjYTVhMzUxZTVkMzdmYTQ2YzBmMTM0ZDAyIn0.owNd_Qa7Sw2neNJbK6zc1A'

var mapCenter = [-96,37]
var aircraft_range = 500


const bounds = [
  [-130,20],
  [-65,50]
];

var map = new mapboxgl.Map({
  container: 'mapContainer',
  style: 'mapbox://styles/mapbox/dark-v10',
  center: mapCenter,
  zoom: 2,
  maxBounds: bounds
});

var createGeoJSONCircle = function(center, radiusInKm, points) {
  if(!points) points = 64;

  var coords = {
      latitude: center[1],
      longitude: center[0]
  };

  var km = radiusInKm;

  var ret = [];
  var distanceX = km/(111.320*Math.cos(coords.latitude*Math.PI/180));
  var distanceY = km/110.574;

  var theta, x, y;
  for(var i=0; i<points; i++) {
      theta = (i/points)*(2*Math.PI);
      x = distanceX*Math.cos(theta);
      y = distanceY*Math.sin(theta);

      ret.push([coords.longitude+x, coords.latitude+y]);
  }
  ret.push(ret[0]);

  return {
      "type": "geojson",
      "data": {
          "type": "FeatureCollection",
          "features": [{
              "type": "Feature",
              "geometry": {
                  "type": "Polygon",
                  "coordinates": [ret]
              }
          }]
      }
  };
};

const coordinates = document.getElementById('coordinates');

const canvas = map.getCanvasContainer();

const geojson = {
    'type': 'FeatureCollection',
    'features': [
        {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': mapCenter
            }
        }
    ]
};

function onMove(e) {
    const coords = e.lngLat;

    // Set a UI indicator for dragging.
    canvas.style.cursor = 'grabbing';

    // Update the Point feature in `geojson` coordinates
    // and call setData to the source layer `point` on it.
    geojson.features[0].geometry.coordinates = [coords.lng, coords.lat];
    map.getSource('point').setData(geojson);
}

function onUp(e) {
    const coords = e.lngLat;

    // Print the coordinates of where the point had
    // finished being dragged to on the map.
    coordinates.style.display = 'block';
    coordinates.innerHTML = `Longitude: ${coords.lng}<br />Latitude: ${coords.lat}`;
    canvas.style.cursor = '';

    // Unbind mouse/touch events
    map.off('mousemove', onMove);
    map.off('touchmove', onMove);
}

map.on('load', function() {
  // Add a single point to the map.
  map.addSource('point', {
      'type': 'geojson',
      'data': geojson
  });

  map.addLayer({
      'id': 'point',
      'type': 'circle',
      'source': 'point',
      'paint': {
          'circle-radius': 10,
          'circle-color': '#F84C4C' // red color
      }
  });

  // When the cursor enters a feature in
  // the point layer, prepare for dragging.
  map.on('mouseenter', 'point', function() {
      map.setPaintProperty('point', 'circle-color', '#3bb2d0');
      canvas.style.cursor = 'move';
  });

  map.on('mouseleave', 'point', function() {
      map.setPaintProperty('point', 'circle-color', '#3887be');
      canvas.style.cursor = '';
  });

  map.on('mousedown', 'point', (e) => {
      // Prevent the default map drag behavior.
      e.preventDefault();

      canvas.style.cursor = 'grab';

      map.on('mousemove', onMove);
      map.once('mouseup', onUp);
  });

  map.on('touchstart', 'point', (e) => {
      if (e.points.length !== 1) return;

      // Prevent the default map drag behavior.
      e.preventDefault();

      map.on('touchmove', onMove);
      map.once('touchend', onUp);
  });
});

$('#aircraft_rng').change(function() {
  map.addLayer({
    "id": "polygon",
    "type": "fill",
    "source": createGeoJSONCircle(geojson.features[0].geometry.coordinates, aircraft_range),
    "layout": {},
    "paint": {
        "fill-color": "white",
        "fill-opacity": 0.6
    }
});




    
