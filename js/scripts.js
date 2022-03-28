

mapboxgl.accessToken = 'pk.eyJ1IjoiY3dob25nIiwiYSI6IjAyYzIwYTJjYTVhMzUxZTVkMzdmYTQ2YzBmMTM0ZDAyIn0.owNd_Qa7Sw2neNJbK6zc1A'

var mapCenter = [-96,37]


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

var airport_data= $.getJSON('/data/all-airport-data.json', function(airport_data) {
});

// airport_data.forEach(function(airportRow){
//   new mapboxgl.Marker()
//     .setLngLat([airportRow.Longitude,airportRow.Latitude])
//     .addTo(map)
// })

$("#start_airport_btn").click(function(){
  $('#start_airport').change(function(){
    var start_airport = $(this).val();
    console.log(start_airport)
  })
  // var start_marker = new mapboxgl.Marker()
  //   .setLngLat(start_coord)
  //   .addTo(map);
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

// map.on('load', function(){
//   map.loadImage(
//     './data/airport-icon.png',
//     (error,image) =>  {
//       if (error) throw error;
//       map.addImage('airport-marker', image);

//       map.addSource('airports', {
//         type: 'geojson',
//         data: './data/all-airport-data.geojson'
//       });

//       map.addLayer({
//         'id': 'points',
//         'type': 'symbol',
//         'source': 'airports',
//         'layout': {
//           'icon-image': 'airport-marker',
//           'icon-size': 0.05
//         }
//       });
//     }
//   );
  
//   map.addSource("polygon", createGeoJSONCircle([-93.6248586, 41.58527859], 500));

//   map.addLayer({
//       "id": "polygon",
//       "type": "fill",
//       "source": "polygon",
//       "layout": {},
//       "paint": {
//           "fill-color": "white",
//           "fill-opacity": 0.6
//       }
//   });


// });
